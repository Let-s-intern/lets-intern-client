import { DataGrid, GridColDef } from '@mui/x-data-grid';

import {
  useAdminFeedbackReviewsQuery,
  useUpdateAdminFeedbackMutation,
} from '@/api/feedback/feedback';
import type { FeedbackReviewAdminVo } from '@/api/feedback/feedbackSchema';
import AdminReviewHeader from '@/app/admin/review/AdminReviewHeader';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import dayjs from '@/lib/dayjs';

/**
 * 후기 관리 > 라이브 멘토링.
 *
 * 다른 후기 탭은 review 테이블을 보지만 챌린지 1:1 라이브 멘토링 후기는
 * feedback 테이블의 score·review 에 저장된다. 그래서 조회 API 도 노출여부 변경 API 도
 * 피드백 도메인 것을 쓴다(GET·PATCH /admin/feedback). 후기 원본은 그 한 곳뿐이라
 * 같은 후기가 두 화면에서 다르게 보일 일이 없다.
 *
 * 이 화면은 목록과 노출여부 토글만 담당한다. 점수·내용 수정은 기존 위치인
 * 피드백 운영 > LIVE 피드백 > 상세에서 한다.
 */

/** 노출 여부 토글 — PATCH /admin/feedback/{id} 하나로 처리한다. */
function ReviewVisibilityToggle({ row }: { row: FeedbackReviewAdminVo }) {
  const { mutate: updateFeedback, isPending } =
    useUpdateAdminFeedbackMutation();

  return (
    <input
      type="checkbox"
      className="cursor-pointer"
      checked={row.reviewIsVisible ?? false}
      disabled={isPending}
      aria-label={`${row.menteeName} 후기 노출 여부`}
      onChange={() =>
        updateFeedback({
          feedbackId: row.feedbackId,
          // 점수·내용은 그대로 두고 노출여부만 바꾼다. 서버가 받은 값을 그대로 반영하므로
          // 두 값을 함께 보내지 않으면 후기가 지워진다.
          score: row.score,
          review: row.review,
          reviewIsVisible: !(row.reviewIsVisible ?? false),
        })
      }
    />
  );
}

const columns: GridColDef<FeedbackReviewAdminVo>[] = [
  {
    field: 'feedbackDate',
    type: 'dateTime',
    headerName: '멘토링 일시',
    width: 180,
    filterable: false,
    valueGetter: (_, row) => dayjs(row.feedbackDate).toDate(),
  },
  {
    field: 'programTitle',
    headerName: '프로그램 명',
    width: 240,
  },
  {
    field: 'missionTh',
    headerName: '회차',
    width: 80,
    valueGetter: (_, row) =>
      row.missionTh != null ? `${row.missionTh}회차` : '-',
  },
  {
    field: 'mentorName',
    headerName: '멘토',
    width: 110,
  },
  {
    field: 'menteeName',
    headerName: '멘티',
    width: 110,
  },
  {
    field: 'score',
    headerName: '만족도 점수',
    width: 120,
  },
  {
    field: 'review',
    headerName: '후기 내용',
    flex: 1,
    minWidth: 280,
  },
  {
    field: 'reviewIsVisible',
    headerName: '노출 여부',
    width: 110,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => <ReviewVisibilityToggle row={row} />,
  },
];

export default function AdminLiveMentoringReviewListPage() {
  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const { data, isLoading } = useAdminFeedbackReviewsQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  return (
    <div className="p-5">
      <AdminReviewHeader />
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <DataGrid
          rows={data?.reviewList ?? []}
          columns={columns}
          getRowId={(row) => row.feedbackId}
          rowCount={data?.pageInfo.totalElements ?? 0}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              alignItems: 'center',
              display: 'flex',
              paddingY: '12px',
              whiteSpace: 'normal',
            },
          }}
        />
      )}
    </div>
  );
}
