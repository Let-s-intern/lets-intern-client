'use client';

import { MagnetListResponse } from '@/api/magnet/magnetSchema';
import dayjs from '@/lib/dayjs';
import { Button, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  isMagnetManageable,
  MAGNET_TYPE,
  MagnetListItem,
} from './types';

interface MagnetTableProps {
  data: MagnetListResponse;
  onToggleVisibility: (id: number, isVisible: boolean) => void;
  onDelete: (id: number) => void;
}

type Row = MagnetListItem;

const MagnetTable = ({
  data,
  onToggleVisibility,
  onDelete,
}: MagnetTableProps) => {
  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'magnetId',
        headerName: '마그넷 ID',
        width: 100,
      },
      {
        field: 'type',
        headerName: '타입',
        width: 110,
        valueGetter: (_, row) => MAGNET_TYPE[row.type],
      },
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'startDate',
        headerName: '노출 시작일',
        width: 130,
        valueGetter: (_, row) =>
          row.startDate
            ? dayjs(row.startDate).format('YYYY-MM-DD')
            : '-',
      },
      {
        field: 'endDate',
        headerName: '노출 종료일',
        width: 130,
        valueGetter: (_, row) =>
          row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD') : '-',
      },
      {
        field: 'isVisible',
        headerName: '노출여부',
        width: 90,
        renderCell: ({ row }) =>
          isMagnetManageable(row.type) ? (
            <Checkbox
              checked={row.isVisible}
              onChange={(e) =>
                onToggleVisibility(row.magnetId, e.target.checked)
              }
              size="small"
            />
          ) : null,
      },
      {
        field: 'applicationCount',
        headerName: '신청자 수',
        width: 90,
        renderCell: ({ row }) =>
          isMagnetManageable(row.type) ? row.applicationCount : null,
      },
      {
        field: 'applicantManage',
        headerName: '신청자 관리',
        width: 120,
        sortable: false,
        renderCell: ({ row }) =>
          isMagnetManageable(row.type) ? (
            <Link href={`/admin/leads/managements/${row.magnetId}`}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
              >
                신청자 정보
              </Button>
            </Link>
          ) : null,
      },
      {
        field: 'actions',
        headerName: '관리',
        width: 280,
        sortable: false,
        renderCell: ({ row }) =>
          isMagnetManageable(row.type) ? (
            <div className="inline-flex items-center gap-2">
              <Link href={`/admin/blog/magnet/${row.magnetId}/post`}>
                <Button variant="outlined" color="primary" size="small">
                  글 관리
                </Button>
              </Link>
              <Link href={`/admin/blog/magnet/${row.magnetId}/form`}>
                <Button variant="outlined" color="info" size="small">
                  신청 폼 관리
                </Button>
              </Link>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onDelete(row.magnetId)}
              >
                삭제
              </Button>
            </div>
          ) : null,
      },
    ],
    [onToggleVisibility, onDelete],
  );

  return (
    <DataGrid
      rows={data.magnetList}
      columns={columns}
      getRowId={(row) => row.magnetId}
      hideFooter
      disableColumnSorting
      disableColumnFilter
      disableColumnMenu
      getRowHeight={() => 'auto'}
      sx={{
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          py: 1,
        },
      }}
    />
  );
};

export default MagnetTable;
