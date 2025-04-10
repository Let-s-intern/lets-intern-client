import { useGetAdminProgramReview } from '@/api/review';
import dayjs from '@/lib/dayjs';
import ReviewDetailModal from '@components/admin/review/ReviewDetailModal';
import ReviewItemVisibilityToggle from '@components/admin/review/ReviewItemVisibilityToggle';
import VisibilityToggle from '@components/admin/review/VisibilityToggle';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid';
import React, { useState } from 'react';
import { Row } from './AdminChallengeReviewListPage';
import AdminReviewHeader from './AdminReviewHeader';

const columns: GridColDef<Row>[] = [
  {
    field: 'createDate',
    type: 'dateTime',
    headerName: '작성일자',
    width: 200,
    sortable: true,
    filterable: false,
    valueGetter: (_, row) => dayjs(row.reviewInfo.createDate).toDate(),
  },
  {
    field: 'title',
    headerName: '진단서 명',
    width: 200,
    valueGetter: (_, row) => row.reviewInfo.title,
  },
  {
    field: 'name',
    headerName: '이름',
    width: 110,
    valueGetter: (_, row) => row.reviewInfo.name,
  },
  {
    field: 'score',
    headerName: '만족도 점수',
    width: 150,
    valueGetter: (_, row) => row.reviewInfo.score,
  },
  {
    field: 'npsScore',
    headerName: 'NPS 점수',
    width: 150,
    valueGetter: (_, row) => row.reviewInfo.npsScore,
  },
  // 고민 (내용 + 노출여부)
  {
    field: 'worry_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'WORRY')
        ?.answer || '-',
  },
  {
    field: 'worry_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle
        type="REPORT_REVIEW"
        row={row}
        questionType="WORRY"
      />
    ),
  },
  // 고민 해결 여부 (내용 + 노출여부)
  {
    field: 'worry_result_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'WORRY_RESULT')
        ?.answer || '-',
  },
  {
    field: 'worry_result_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle
        type="REPORT_REVIEW"
        row={row}
        questionType="WORRY_RESULT"
      />
    ),
  },
  // 좋았던 점 (내용 + 노출여부)
  {
    field: 'good_point_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'GOOD_POINT')
        ?.answer || '-',
  },
  {
    field: 'good_point_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle
        type="REPORT_REVIEW"
        row={row}
        questionType="GOOD_POINT"
      />
    ),
  },
  // 아쉬웠던 점 (내용 + 노출여부)
  {
    field: 'bad_point_content',
    headerName: '내용',
    width: 200,
    valueGetter: (_, row) =>
      row.reviewItemList?.find((item) => item.questionType === 'BAD_POINT')
        ?.answer || '-',
  },
  {
    field: 'bad_point_visible',
    headerName: '노출여부',
    width: 100,
    renderCell: ({ row }) => (
      <ReviewItemVisibilityToggle
        type="REPORT_REVIEW"
        row={row}
        questionType="BAD_POINT"
      />
    ),
  },
  // 전체 리뷰의 노출 여부
  {
    field: 'isVisible',
    headerName: '노출여부',
    width: 150,
    type: 'boolean',
    renderCell: ({ row }) => (
      <VisibilityToggle type="REPORT_REVIEW" row={row} />
    ),
  },
];

// 헤더 그룹화
const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'worry',
    headerName: '고민',
    children: [{ field: 'worry_content' }, { field: 'worry_visible' }],
  },
  {
    groupId: 'worry_result',
    headerName: '고민 해결 여부',
    children: [
      { field: 'worry_result_content' },
      { field: 'worry_result_visible' },
    ],
  },
  {
    groupId: 'good_point',
    headerName: '좋았던 점',
    children: [
      { field: 'good_point_content' },
      { field: 'good_point_visible' },
    ],
  },
  {
    groupId: 'bad_point',
    headerName: '아쉬웠던 점',
    children: [{ field: 'bad_point_content' }, { field: 'bad_point_visible' }],
  },
];

const AdminReportReviewListPage = () => {
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const { data, isLoading } = useGetAdminProgramReview({
    type: 'REPORT_REVIEW',
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
          sx={{
            // '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
            //   outline: 'none', // outline 제거
            // },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold', // 헤더 폰트 굵게
            },
            '& .MuiDataGrid-columnHeader[data-field="goal_content"], \
                .MuiDataGrid-columnHeader[data-field="goal_visible"], \
                .MuiDataGrid-columnHeader[data-field="goal_result_content"], \
                .MuiDataGrid-columnHeader[data-field="goal_result_visible"], \
                .MuiDataGrid-columnHeader[data-field="good_point_content"], \
                .MuiDataGrid-columnHeader[data-field="good_point_visible"], \
                .MuiDataGrid-columnHeader[data-field="bad_point_content"], \
                .MuiDataGrid-columnHeader[data-field="bad_point_visible"]': {
              color: 'gray',
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
          columnGroupingModel={columnGroupingModel}
          columnHeaderHeight={36}
          columnGroupHeaderHeight={36}
          disableRowSelectionOnClick
          disableColumnSelector
          disableDensitySelector
          hideFooter
        />
      )}
      <ReviewDetailModal
        onClose={handleClose}
        selectedRow={selectedRow}
        worry
      />
    </div>
  );
};

export default AdminReportReviewListPage;
