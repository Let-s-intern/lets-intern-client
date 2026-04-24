import { MagnetListResponse } from '@/api/magnet/magnetSchema';
import {
  createIncludesFilterOperators,
  formatDateTimeCellValue,
  MultiSelectFilterInput,
  MultiSelectFilterOption,
} from '@/domain/admin/ui/table/TableFilter';
import dayjs from '@/lib/dayjs';
import { Button, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import {
  isMagnetManageable,
  isMagnetVisibilityManageable,
  MAGNET_TYPE,
  MagnetListItem,
} from './types';

interface MagnetTableProps {
  data: MagnetListResponse;
  onToggleVisibility: (id: number, isVisible: boolean) => void;
  onDelete: (id: number) => void;
}

type Row = MagnetListItem;

const magnetTypeOptions: MultiSelectFilterOption[] = Object.entries(
  MAGNET_TYPE,
).map(([value, label]) => ({
  value,
  label,
}));

const magnetTypeOperators = createIncludesFilterOperators((props) => (
  <MultiSelectFilterInput {...props} options={magnetTypeOptions} />
));

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
        valueGetter: (_, row) => row.type,
        valueFormatter: (value) =>
          MAGNET_TYPE[value as keyof typeof MAGNET_TYPE],
        filterOperators: magnetTypeOperators,
      },
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'programType',
        headerName: '프로그램 타입',
        width: 130,
        valueGetter: (_, row) =>
          isMagnetManageable(row.type) ? '-' : row.programType || '-',
      },
      {
        field: 'challengeType',
        headerName: '챌린지 타입',
        width: 130,
        valueGetter: (_, row) =>
          isMagnetManageable(row.type) ? '-' : row.challengeType || '-',
      },
      {
        field: 'startDate',
        headerName: '노출 시작일',
        type: 'dateTime',
        width: 130,
        valueGetter: (_, row) =>
          isMagnetVisibilityManageable(row.type) && row.startDate
            ? dayjs(row.startDate).toDate()
            : null,
        valueFormatter: (value) => formatDateTimeCellValue(value),
      },
      {
        field: 'endDate',
        headerName: '노출 종료일',
        type: 'dateTime',
        width: 130,
        valueGetter: (_, row) =>
          isMagnetVisibilityManageable(row.type) && row.endDate
            ? dayjs(row.endDate).toDate()
            : null,
        valueFormatter: (value) => formatDateTimeCellValue(value),
      },
      {
        field: 'isVisible',
        headerName: '노출여부',
        type: 'boolean',
        width: 90,
        renderCell: ({ row }) =>
          isMagnetVisibilityManageable(row.type) ? (
            <Checkbox
              checked={row.isVisible}
              onChange={(e) =>
                onToggleVisibility(row.magnetId, e.target.checked)
              }
              size="small"
            />
          ) : (
            '-'
          ),
      },
      {
        field: 'applicationCount',
        headerName: '신청자 수',
        width: 90,
        renderCell: ({ row }) => row.applicationCount,
      },
      {
        field: 'applicantManage',
        headerName: '신청자 관리',
        width: 120,
        sortable: false,
        renderCell: ({ row }) => (
          <Link to={`/leads/managements/${row.magnetId}`}>
            <Button variant="outlined" color="primary" size="small">
              신청자 정보
            </Button>
          </Link>
        ),
      },
      {
        field: 'actions',
        headerName: '관리',
        width: 280,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => {
          const manageable = isMagnetManageable(row.type);
          const postEditable = manageable || row.type === 'LAUNCH_ALERT';
          return (
            <div className="inline-flex items-center gap-2">
              {postEditable && (
                <Link to={`/magnet/${row.magnetId}/post`}>
                  <Button variant="outlined" color="primary" size="small">
                    글 관리
                  </Button>
                </Link>
              )}
              {manageable && (
                <Link to={`/magnet/${row.magnetId}/form`}>
                  <Button variant="outlined" color="info" size="small">
                    신청 폼 관리
                  </Button>
                </Link>
              )}
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onDelete(row.magnetId)}
              >
                삭제
              </Button>
            </div>
          );
        },
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
      getRowHeight={() => 'auto'}
      sx={{
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          py: 1,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        },
      }}
    />
  );
};

export default MagnetTable;
