'use client';

import { LOCALIZED_YYYY_MD_Hm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { useMemo } from 'react';
import SubmissionCountCell from './cells/SubmissionCountCell';
import useFeedbackMissionRows from './hooks/useFeedbackMissionRows';
import type { Row } from './types';

function FeedbackMissionList() {
  const rows = useFeedbackMissionRows();

  const columns: GridColDef<Row>[] = useMemo(
    () => [
      { field: 'title', headerName: '미션 명', flex: 1, minWidth: 180 },
      { field: 'th', headerName: '미션 회차', type: 'number', width: 90 },
      {
        field: 'startDate',
        headerName: '공개일',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Row, string>) =>
          dayjs(params.value).format(LOCALIZED_YYYY_MD_Hm),
      },
      {
        field: 'endDate',
        headerName: '마감일',
        sortable: false,
        width: 200,
        renderCell: (params: GridRenderCellParams<Row, string>) =>
          dayjs(params.value).format(LOCALIZED_YYYY_MD_Hm),
      },
      {
        field: 'challengeOptionTitle',
        headerName: '피드백 옵션',
        sortable: false,
        width: 180,
      },
      {
        field: 'submissionCount',
        headerName: '제출 / 전체',
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Row>) => (
          <SubmissionCountCell missionId={params.row.id} />
        ),
      },
      {
        field: 'url',
        headerName: '피드백 페이지',
        width: 120,
        renderCell: (params: GridRenderCellParams<Row, string>) => (
          <Link
            href={params.value || '#'}
            className="text-primary underline"
            onClick={() => {
              localStorage.setItem('mission', JSON.stringify(params.row));
            }}
          >
            바로가기
          </Link>
        ),
      },
      {
        field: 'feedbackPeriod',
        headerName: '피드백 마감기간',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Row>) => {
          const endDate = params.row.endDate;
          if (!endDate) return '-';
          const feedbackDeadline = dayjs(endDate).add(3, 'day');
          return (
            <span className="font-semibold">
              {feedbackDeadline.format('YYYY년 M월 D일')}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      hideFooter
      sx={{ '& .MuiDataGrid-cell': { overflow: 'visible' } }}
    />
  );
}

export default FeedbackMissionList;
