import { Chip, type ChipProps } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import type { AdminOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';
import dayjs from '@/lib/dayjs';

import {
  getApplicationStatus,
  getApplicationStatusLabel,
  getPaymentAmountText,
  getSelectedOptionsText,
  type ApplicationStatus,
} from '../utils/applicationDisplay';

const STATUS_CHIP_COLOR: Record<ApplicationStatus, ChipProps['color']> = {
  PAID: 'success',
  FREE: 'default',
  CANCELED: 'error',
};

const LOCALE_TEXT = { noRowsLabel: '아직 신청자가 없습니다.' } as const;

const columns: GridColDef<AdminOneTimeFormApplication>[] = [
  {
    field: 'createDate',
    headerName: '신청일시',
    width: 150,
    valueFormatter: (value: string) => dayjs(value).format('YYYY.MM.DD HH:mm'),
  },
  {
    field: 'user',
    headerName: '계정',
    width: 90,
    sortable: false,
    valueGetter: (_, row) => (row.user === null ? '탈퇴' : row.user.userId),
  },
  { field: 'name', headerName: '이름', width: 100 },
  { field: 'email', headerName: '이메일', minWidth: 200, flex: 1 },
  { field: 'phoneNum', headerName: '전화번호', width: 130 },
  {
    field: 'selectedOptions',
    headerName: '고른 옵션',
    minWidth: 200,
    flex: 1,
    sortable: false,
    valueGetter: (_, row) => getSelectedOptionsText(row.selectedOptions),
  },
  {
    field: 'payment',
    headerName: '결제 금액',
    width: 110,
    sortable: false,
    valueGetter: (_, row) => getPaymentAmountText(row.payment),
  },
  {
    field: 'status',
    headerName: '상태',
    width: 170,
    sortable: false,
    renderCell: ({ row }) => (
      <Chip
        size="small"
        color={STATUS_CHIP_COLOR[getApplicationStatus(row)]}
        label={getApplicationStatusLabel(row)}
      />
    ),
  },
  { field: 'utmSource', headerName: 'utm_source', width: 120 },
  { field: 'utmCampaign', headerName: 'utm_campaign', width: 140 },
];

interface Props {
  formId: number;
  applications: AdminOneTimeFormApplication[];
  loading: boolean;
}

/** 신청자 목록. 행을 누르면 신청 상세로 간다. 취소한 신청은 흐리게 둔다 */
const ApplicantTable = ({ formId, applications, loading }: Props) => {
  const navigate = useNavigate();

  return (
    <DataGrid
      autoHeight
      rows={applications}
      columns={columns}
      getRowId={(row) => row.applicationId}
      getRowClassName={({ row }) =>
        row.isCanceled
          ? 'cursor-pointer bg-neutral-95 text-neutral-40'
          : 'cursor-pointer'
      }
      onRowClick={({ row }) =>
        navigate(`/one-time-form/${formId}/applications/${row.applicationId}`)
      }
      loading={loading}
      localeText={LOCALE_TEXT}
      disableRowSelectionOnClick
      hideFooter
    />
  );
};

export default ApplicantTable;
