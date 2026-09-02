import { useGetAdminProgramReview } from '@/api/review/review';
import AdminReviewHeader from '@/app/admin/review/AdminReviewHeader';
import LoadingContainer from '@/common/loading/LoadingContainer';
import ReviewDetailModal from '@/domain/admin/review/ReviewDetailModal';
import VisibilityToggle from '@/domain/admin/review/VisibilityToggle';
import dayjs from '@/lib/dayjs';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { Row } from './AdminChallengeReviewListPage';

/**
 * 후기 관리 > 1:1 라이브 멘토링.
 *
 * 기존 "라이브 멘토링" 탭(AdminLiveMentoringReviewListPage)과 이름이 비슷하지만 완전히
 * 다른 데이터다 — 그 탭은 챌린지 라이브 피드백(feedback 테이블) 후기이고, 이 탭은 독립
 * 상품 1:1 라이브 멘토링(LIVE_MENTORING_REVIEW, 범용 review 테이블) 후기다.
 *
 * 어드민 목록 조회 백엔드(LiveMentoringReviewAdminVo)가 아직 멘토명·예약일시를 내려주지
 * 않는다 — 상품명·작성자(멘티)명·별점·내용·노출여부만 이 화면에 둔다.
 */
const columns: GridColDef<Row>[] = [
  {
    field: 'createDate',
    type: 'dateTime',
    headerName: '작성일자',
    width: 180,
    sortable: true,
    filterable: false,
    valueGetter: (_, row) => dayjs(row.reviewInfo.createDate).toDate(),
  },
  {
    field: 'title',
    headerName: '상품명',
    width: 220,
    valueGetter: (_, row) => row.reviewInfo.title,
  },
  {
    field: 'name',
    headerName: '멘티명',
    width: 110,
    valueGetter: (_, row) => row.reviewInfo.name,
  },
  {
    field: 'score',
    headerName: '별점',
    width: 100,
    valueGetter: (_, row) => row.reviewInfo.score,
  },
  {
    field: 'content',
    headerName: '내용',
    flex: 1,
    minWidth: 280,
    valueGetter: (_, row) => row.reviewInfo.content,
  },
  {
    field: 'isVisible',
    headerName: '노출여부',
    width: 120,
    type: 'boolean',
    renderCell: ({ row }) => (
      <VisibilityToggle type="LIVE_MENTORING_REVIEW" row={row} />
    ),
  },
];

const AdminOneOnOneMentoringReviewListPage = () => {
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const { data, isLoading } = useGetAdminProgramReview({
    type: 'LIVE_MENTORING_REVIEW',
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const handleRowClick = (e: React.MouseEvent, row: Row) => {
    if ((e.target as HTMLElement).closest('.ignore-click')) return;
    setSelectedRow(row);
  };

  const handleClose = () => {
    setSelectedRow(null);
  };

  return (
    <div className="p-5">
      <AdminReviewHeader />
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <DataGrid
          autoHeight
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
          rows={
            data?.reviewList.map((review) => ({
              ...review,
              id: review.reviewInfo.reviewId,
            })) ?? []
          }
          onRowClick={(params, event) =>
            handleRowClick(event, params.row as Row)
          }
          columns={columns}
          columnHeaderHeight={36}
          disableRowSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          pagination
          paginationMode="server"
          rowCount={data?.pageInfo.totalElements ?? 0}
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}
      <ReviewDetailModal onClose={handleClose} selectedRow={selectedRow} />
    </div>
  );
};

export default AdminOneOnOneMentoringReviewListPage;
