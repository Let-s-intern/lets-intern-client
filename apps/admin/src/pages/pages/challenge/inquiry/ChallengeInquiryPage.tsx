import {
  AnswerStatus,
  ChallengeQuestionItem,
  useAllChallengeQuestionsQuery,
  useDeleteQuestionMutation,
  useToggleVisibilityMutation,
} from '@/api/challenge-question/challengeQuestion';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { usePageableWithSearchParams } from '@/hooks/usePageableWithSearchParams';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Tab = 'all' | 'WAITING' | 'COMPLETED';

const tabs: { id: Tab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'WAITING', label: '답변 대기' },
  { id: 'COMPLETED', label: '답변 완료' },
];

const ChallengeInquiryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [deleteTarget, setDeleteTarget] = useState<{
    challengeId: number;
    questionId: number;
  } | null>(null);

  const { pageable, setPageable, handlePageChange } =
    usePageableWithSearchParams({ defaultPage: 1, defaultSize: 20 });

  const answerStatus: AnswerStatus | undefined =
    activeTab === 'all' ? undefined : activeTab;

  const { data, isLoading } = useAllChallengeQuestionsQuery({
    answerStatus,
    page: pageable.page,
    size: pageable.size,
  });
  const questions = data?.questionList ?? [];
  const pageInfo = data?.pageInfo;

  const { mutate: toggleVisibility } = useToggleVisibilityMutation();
  const { mutate: deleteQuestion, isPending: isDeleting } =
    useDeleteQuestionMutation();

  const columns = useMemo<GridColDef<ChallengeQuestionItem>[]>(
    () => [
      {
        field: 'id',
        headerName: 'id',
        width: 70,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'answerStatus',
        headerName: '답변 상태',
        width: 100,
        valueGetter: (_, row) =>
          row.answerStatus === 'WAITING' ? '답변 대기' : '답변 완료',
      },
      { field: 'title', headerName: '문의 제목', flex: 1 },
      {
        field: 'challengeTitle',
        headerName: '챌린지 명',
        width: 300,
        valueGetter: (_, row) => row.challengeTitle ?? '-',
      },
      {
        field: 'createDate',
        headerName: '문의 등록일',
        width: 150,
        valueGetter: (_, row) => row.createDate?.slice(0, 10) ?? '-',
      },
      {
        field: 'answer',
        headerName: '답변 등록',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => (
          <button
            className="bg-primary rounded px-3 py-1 text-xs text-white"
            onClick={() =>
              navigate(
                `/challenge/inquiry/${row.challengeId}/${row.id}/answer`,
                { state: { question: row } },
              )
            }
          >
            이동
          </button>
        ),
      },
      {
        field: 'isVisible',
        headerName: '노출여부',
        width: 90,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.isVisible}
            onChange={(e) =>
              toggleVisibility({
                challengeId: row.challengeId,
                questionId: row.id,
                isVisible: e.target.checked,
              })
            }
          />
        ),
      },
      {
        field: 'management',
        headerName: '관리',
        width: 160,
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) => (
          <div className="flex h-full items-center justify-center gap-2">
            <button
              className="rounded border border-blue-500 px-3 py-1 text-xs text-blue-500"
              onClick={() =>
                navigate(
                  `/challenge/inquiry/${row.challengeId}/${row.id}/answer`,
                  { state: { question: row } },
                )
              }
            >
              수정
            </button>
            <button
              className="rounded border border-red-500 px-3 py-1 text-xs text-red-500"
              onClick={() =>
                setDeleteTarget({
                  challengeId: row.challengeId,
                  questionId: row.id,
                })
              }
            >
              삭제
            </button>
          </div>
        ),
      },
    ],
    [navigate, toggleVisibility],
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPageable((prev) => ({ ...prev, page: 1 }));
  };

  const renderContent = () => {
    if (isLoading) return <LoadingContainer />;
    if (questions.length === 0) return <EmptyContainer />;
    return (
      <DataGrid
        autoHeight
        rows={questions}
        columns={columns}
        hideFooter
        disableRowSelectionOnClick
      />
    );
  };

  return (
    <>
      <TableLayout
        title="챌린지 1:1 문의"
        tabs={
          <div className="flex items-center gap-3 text-sm">
            {tabs.map((tab, i) => (
              <React.Fragment key={tab.id}>
                {i > 0 && <span className="text-gray-300">|</span>}
                <button
                  className={
                    activeTab === tab.id ? 'text-primary' : 'text-neutral-40'
                  }
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        }
      >
        <div className="w-full pb-24">
          {renderContent()}
          {pageInfo && pageInfo.totalPages > 1 && (
            <MuiPagination
              className="mt-4"
              pageInfo={pageInfo}
              page={pageable.page}
              onChange={handlePageChange}
            />
          )}
        </div>
      </TableLayout>

      <WarningModal
        isOpen={deleteTarget !== null}
        title="문의 삭제"
        content="정말로 이 문의를 삭제하시겠습니까?"
        confirmText="삭제"
        isLoading={isDeleting}
        onConfirm={() => {
          if (deleteTarget) {
            deleteQuestion(deleteTarget, {
              onSuccess: () => setDeleteTarget(null),
            });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default ChallengeInquiryPage;
