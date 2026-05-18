import { MagnetListResponse } from '@/api/magnet/magnetSchema';
import {
  createIncludesFilterOperators,
  formatDateTimeCellValue,
  MultiSelectFilterInput,
  MultiSelectFilterOption,
} from '@/domain/admin/ui/table/TableFilter';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { getLibraryPathname } from '@/utils/url';
import { Button, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import {
  isMagnetManageable,
  isMagnetVisibilityManageable,
  MAGNET_TYPE,
  MagnetListItem,
  MagnetTypeKey,
} from './types';

// 클립보드로 공유되는 절대 URL이므로 메인 web 도메인을 사용한다.
// VITE_WEB_URL 미설정 시 admin 자기 자신의 root 로 fallback (안전장치).
const WEB_URL = import.meta.env.VITE_WEB_URL ?? '/';

const buildApplyUrl = (magnetId: number, type: MagnetTypeKey) => {
  const base = `${WEB_URL}/library/${magnetId}/apply`;
  return type === 'LAUNCH_ALERT' ? `${base}?type=launch-alert` : base;
};

const buildDetailUrl = (magnetId: number, title: string) =>
  `${WEB_URL}${getLibraryPathname({ id: magnetId, title })}`;

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
  const { snackbar } = useAdminSnackbar();

  const copyToClipboard = useCallback(
    async (url: string, successMessage: string) => {
      try {
        await navigator.clipboard.writeText(url);
        snackbar(successMessage);
      } catch {
        snackbar('복사에 실패했습니다. 다시 시도해 주세요.');
      }
    },
    [snackbar],
  );

  const handleCopyApplyLink = useCallback(
    (magnetId: number, type: MagnetTypeKey) =>
      copyToClipboard(
        buildApplyUrl(magnetId, type),
        '신청 페이지 링크가 복사되었습니다.',
      ),
    [copyToClipboard],
  );

  const handleCopyDetailLink = useCallback(
    (magnetId: number, title: string) =>
      copyToClipboard(
        buildDetailUrl(magnetId, title),
        '상세 페이지 링크가 복사되었습니다.',
      ),
    [copyToClipboard],
  );

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
      {
        field: 'detailLink',
        headerName: '상세페이지 링크',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => handleCopyDetailLink(row.magnetId, row.title)}
          >
            복사
          </Button>
        ),
      },
      {
        field: 'applyLink',
        headerName: '신청페이지 링크',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => handleCopyApplyLink(row.magnetId, row.type)}
          >
            복사
          </Button>
        ),
      },
    ],
    [onToggleVisibility, onDelete, handleCopyApplyLink, handleCopyDetailLink],
  );

  return (
    <DataGrid
      autoHeight
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
