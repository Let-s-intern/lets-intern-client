import { useGetAllInOnePassListQuery } from '@/api/all-in-one-pass/usePassList';
import {
  useGetRetrospectiveResponsesQuery,
  useGetRetrospectiveRoundsQuery,
} from '@/api/all-in-one-pass/useRetrospectives';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { RetrospectiveResponse } from '@/domain/all-in-one-pass/types';
import AnswerViewModal from '@/domain/all-in-one-pass/ui/retrospective/AnswerViewModal';
import ResponseCommentModal from '@/domain/all-in-one-pass/ui/retrospective/ResponseCommentModal';
import {
  AnswerView,
  buildResponseTabs,
  getResponseColumns,
} from '@/domain/all-in-one-pass/ui/retrospective/responseColumns';
import { downloadResponsesCsv } from '@/domain/all-in-one-pass/util/downloadResponsesCsv';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams, useSearchParams } from 'react-router-dom';

/**
 * A-5 회고 응답 조회. 질문 탭으로 답변을 전환해 보고, 코멘트는 제출자(유저)별 1개.
 * 현재 로컬 상태 = mock, 추후 실 API(PATCH/DELETE)로 교체.
 */
export default function AllInOnePassRetrospectiveResponses() {
  const { retrospectiveId } = useParams();
  const roundId = retrospectiveId ? Number(retrospectiveId) : undefined;

  const [searchParams] = useSearchParams();
  const passId = Number(searchParams.get('passId')) || undefined;

  const { data: passes = [] } = useGetAllInOnePassListQuery();
  const passName = passes.find((p) => p.id === passId)?.title;

  const { data: rounds = [] } = useGetRetrospectiveRoundsQuery(passId);
  const {
    data: responses = [],
    isLoading,
    error,
  } = useGetRetrospectiveResponsesQuery(roundId);

  const round = rounds.find((r) => r.id === roundId);
  const tabs = useMemo(
    () => buildResponseTabs(responses, roundId),
    [responses, roundId],
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const activeId = selectedId ?? tabs[0]?.questionId ?? null;
  const activeLabel = responses
    .flatMap((r) => r.answers)
    .find((a) => a.questionId === activeId)?.questionLabel;

  const [commentMap, setCommentMap] = useState<Record<number, string>>({});
  const [target, setTarget] = useState<RetrospectiveResponse | null>(null);
  const [draft, setDraft] = useState('');
  const [answerView, setAnswerView] = useState<AnswerView | null>(null);

  const openComment = (res: RetrospectiveResponse) => {
    setTarget(res);
    setDraft(commentMap[res.id] ?? '');
  };
  const saveComment = () => {
    if (!target) return;
    setCommentMap((prev) => ({ ...prev, [target.id]: draft.trim() }));
    setTarget(null);
  };
  const deleteComment = () => {
    if (!target) return;
    setCommentMap((prev) => {
      const next = { ...prev };
      delete next[target.id];
      return next;
    });
    setTarget(null);
  };

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const columns = getResponseColumns({
    activeId,
    hasComment: (id) => !!commentMap[id],
    onOpenComment: openComment,
    onViewAnswer: setAnswerView,
  });

  return (
    <main className="flex flex-col gap-5 p-6">
      <header className="flex flex-col gap-3">
        <Link
          to="/all-in-one-pass/retrospectives"
          className="text-xsmall14 text-neutral-40 hover:text-neutral-0 flex w-fit items-center gap-1"
        >
          <IoArrowBack />
          회고 관리
        </Link>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            {passName && (
              <span className="text-xsmall16 text-neutral-30 font-semibold">
                {passName}
              </span>
            )}
            <h1 className="text-medium24 text-neutral-0 font-bold">
              {round?.round ?? '-'}회차 회고 응답 조회
            </h1>
          </div>
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
          {/* 질문 탭 (뱃지) */}
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
            rows={responses}
            columns={columns}
            pagination
            pageSizeOptions={[10, 20, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
          />
        </>
      )}

      <ResponseCommentModal
        response={target}
        value={draft}
        onChange={setDraft}
        hasComment={!!(target && commentMap[target.id])}
        passName={passName}
        onSave={saveComment}
        onDelete={deleteComment}
        onClose={() => setTarget(null)}
      />

      <AnswerViewModal
        view={answerView}
        question={activeLabel}
        passName={passName}
        onClose={() => setAnswerView(null)}
      />
    </main>
  );
}
