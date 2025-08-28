'use client';

import { useGetAdminProgramReview } from '@/api/review';
import dayjs from '@/lib/dayjs';
import { ChallengeType } from '@/schema';
import { challengeTypeToDisplay } from '@/utils/convert';
import ReviewDetailModal from '@components/admin/review/ReviewDetailModal';
import VisibilityToggle from '@components/admin/review/VisibilityToggle';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { challengeTypeOperators, Row } from '../challenge/page';
import AdminReviewHeader from '../AdminReviewHeader';

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
    field: 'type',
    headerName: '챌린지 구분',
    width: 150,
    filterable: true,
    valueGetter: (_, row) => row.reviewInfo.challengeType as ChallengeType,
    valueFormatter: (value: ChallengeType) => challengeTypeToDisplay[value],
    filterOperators: challengeTypeOperators,
  },
  {
    field: 'challengeTitle',
    headerName: '프로그램 명',
    width: 200,
    valueGetter: (_, row) => row.reviewInfo.challengeTitle,
  },
  {
    field: 'missionTh',
    headerName: '미션 회차',
    width: 100,
    valueGetter: (_, row) => row.reviewInfo.missionTh,
  },
  {
    field: 'missionTitle',
    headerName: '미션 명',
    width: 200,
    valueGetter: (_, row) => row.reviewInfo.missionTitle,
  },
  {
    field: 'name',
    headerName: '이름',
    width: 110,
    valueGetter: (_, row) => row.reviewInfo.name,
  },
  {
    field: 'review',
    headerName: '미션 소감',
    width: 200,
    valueGetter: (_, row) => row.reviewInfo.review,
  },
  // 전체 리뷰의 노출 여부
  {
    field: 'isVisible',
    headerName: '노출여부',
    width: 150,
    type: 'boolean',
    renderCell: ({ row }) => (
      <VisibilityToggle type="MISSION_REVIEW" row={row} />
    ),
  },
];

const AdminMissionReviewListPage = () => {
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const { data, isLoading } = useGetAdminProgramReview({
    type: 'MISSION_REVIEW',
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
              id: review.reviewInfo.attendanceId ?? 0,
            })) ?? []
          }
          onRowClick={(params, event) =>
            handleRowClick(event, params.row as Row)
          }
          columns={columns}
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
        mission
      />
    </div>
  );
};

export default AdminMissionReviewListPage;