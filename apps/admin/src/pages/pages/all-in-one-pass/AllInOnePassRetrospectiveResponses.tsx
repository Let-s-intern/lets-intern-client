import {
  useGetCommonQuestionsQuery,
  useGetRetrospectiveResponsesQuery,
  useGetRetrospectiveRoundsQuery,
} from '@/api/all-in-one-pass/useRetrospectives';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { RetrospectiveResponse } from '@/domain/all-in-one-pass/types';
import { downloadResponsesCsv } from '@/domain/all-in-one-pass/util/downloadResponsesCsv';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import dayjs from '@/lib/dayjs';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';

interface QuestionTab {
  questionId: number;
  label: string;
}

/** 응답에 등장한 질문들로 탭 구성 (공통 먼저 → 주차별). 저장 라벨은 스냅샷. */
const buildTabs = (
  responses: RetrospectiveResponse[],
  commonQuestionIds: number[],
): QuestionTab[] => {
  const present = new Set<number>();
  responses.forEach((r) => r.answers.forEach((a) => present.add(a.questionId)));

  const commonSet = new Set(commonQuestionIds);
  const commonTabs = commonQuestionIds
    .filter((id) => present.has(id))
    .map((id, i) => ({ questionId: id, label: `공통 질문 ${i + 1}` }));
  const weeklyTabs = [...present]
    .filter((id) => !commonSet.has(id))
    .map((id) => ({ questionId: id, label: '주차별 질문' }));
  return [...commonTabs, ...weeklyTabs];
};

/** A-5 회고 응답 조회 */
export default function AllInOnePassRetrospectiveResponses() {
  const { retrospectiveId } = useParams();
  const roundId = retrospectiveId ? Number(retrospectiveId) : undefined;

  const { data: rounds = [] } = useGetRetrospectiveRoundsQuery();
  const { data: commonQuestions = [] } = useGetCommonQuestionsQuery();
  const {
    data: responses = [],
    isLoading,
    error,
  } = useGetRetrospectiveResponsesQuery(roundId);

  const round = rounds.find((r) => r.id === roundId);
  const tabs = useMemo(
    () =>
      buildTabs(
        responses,
        commonQuestions.map((q) => q.id),
      ),
    [responses, commonQuestions],
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const activeId = selectedId ?? tabs[0]?.questionId ?? null;

  const [detail, setDetail] = useState<{
    submitterName: string;
    passName: string;
    submittedAt: string;
    answer: string;
  } | null>(null);

  // 선택 질문의 전문(제출 당시 스냅샷 아무거나) — 삭제된 질문도 안전
  const activeLabel = responses
    .flatMap((r) => r.answers)
    .find((a) => a.questionId === activeId)?.questionLabel;

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const rows = responses.map((r) => ({
    id: r.id,
    submitterName: r.submitterName,
    passName: r.passName,
    submittedAt: r.submittedAt,
    answer: r.answers.find((a) => a.questionId === activeId)?.answer ?? '-',
  }));

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'submitterName', headerName: '제출자', width: 140 },
    { field: 'passName', headerName: '올인원 패스', width: 200 },
    {
      field: 'submittedAt',
      headerName: '제출일',
      width: 140,
      valueFormatter: (value) => dayjs(value).format('YYYY.MM.DD'),
    },
    {
      field: 'answer',
      headerName: '답변',
      flex: 1,
      minWidth: 320,
      sortable: false,
      renderCell: ({ row, value }) => (
        <div className="flex h-full w-full min-w-0 items-center gap-4">
          <span className="min-w-0 flex-1 truncate">{value}</span>
          {String(value).length > 40 && (
            <button
              type="button"
              className="text-primary text-xsmall14 shrink-0 hover:underline"
              onClick={() =>
                setDetail({
                  submitterName: row.submitterName,
                  passName: row.passName,
                  submittedAt: row.submittedAt,
                  answer: String(value),
                })
              }
            >
              상세보기
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-5 p-6">
      <header className="flex flex-col gap-2">
        <Link
          to="/all-in-one-pass/retrospectives"
          className="text-xsmall14 text-neutral-40 hover:text-neutral-0 flex w-fit items-center gap-1"
        >
          <IoArrowBack />
          회고 관리
        </Link>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-medium24 text-neutral-0 font-bold">
            {round?.round ?? '-'}회차 회고 응답 조회
          </h1>
          <Button
            variant="outlined"
            onClick={() => downloadResponsesCsv(responses, tabs, round?.round)}
          >
            엑셀 다운로드
          </Button>
        </div>
      </header>
      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : responses.length === 0 ? (
        <EmptyContainer text="제출된 응답이 없습니다." />
      ) : (
        <>
          {/* 질문 탭 */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.questionId}
                type="button"
                onClick={() => setSelectedId(tab.questionId)}
                className={clsx(
                  'text-xsmall14 rounded-full border px-4 py-1.5 font-medium transition-colors',
                  tab.questionId === activeId
                    ? 'border-neutral-0 bg-neutral-0 text-white'
                    : 'border-neutral-80 text-neutral-40 hover:bg-neutral-95',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 선택 질문 전문 */}
          <div className="border-neutral-80 bg-neutral-95 flex items-center gap-2 rounded-md border px-4 py-3">
            <span className="text-xsmall16 text-neutral-0 font-semibold">
              Q. {activeLabel ?? '-'}
            </span>
          </div>

          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pagination
            pageSizeOptions={[10, 20, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
          />
        </>
      )}

      <Dialog
        open={detail !== null}
        onClose={() => setDetail(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>응답 상세</DialogTitle>
        <DialogContent dividers className="flex flex-col gap-4">
          <div className="text-xxsmall12 text-neutral-40 flex flex-col gap-1">
            <span>
              {detail?.submitterName} | {detail?.passName} |{' '}
              {detail && dayjs(detail.submittedAt).format('YYYY.MM.DD')}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-xsmall14 text-primary-80 font-medium">
              Q. {activeLabel ?? '-'}
            </span>
            <div className="bg-neutral-90 rounded rounded-sm p-4">
              <p className="text-xsmall16 text-neutral-10 whitespace-pre-wrap">
                {detail?.answer}
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDetail(null)}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
