import { Chip, type ChipProps } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

import { useOneTimeFormListQuery } from '@/api/one-time-form/oneTimeFormQueries';
import type { AdminOneTimeFormListItem } from '@/api/one-time-form/oneTimeFormSchema';
import ActionButton from '@/domain/admin/ui/button/ActionButton';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import dayjs from '@/lib/dayjs';

import {
  getOneTimeFormStatus,
  ONE_TIME_FORM_STATUS_LABEL,
  type OneTimeFormStatus,
} from '../utils/oneTimeFormStatus';

const STATUS_CHIP_COLOR: Record<OneTimeFormStatus, ChipProps['color']> = {
  HIDDEN: 'default',
  BEFORE: 'primary',
  OPEN: 'success',
  CLOSED: 'default',
};

const DATE_FORMAT = 'YYYY.MM.DD HH:mm';

const formatPeriod = (form: AdminOneTimeFormListItem) =>
  `${dayjs(form.startDate).format(DATE_FORMAT)} ~ ${dayjs(form.endDate).format(DATE_FORMAT)}`;

const LOCALE_TEXT = { noRowsLabel: '등록된 폼이 없습니다.' } as const;

const columns: GridColDef<AdminOneTimeFormListItem>[] = [
  {
    field: 'title',
    headerName: '제목',
    flex: 1,
    minWidth: 240,
    renderCell: ({ row }) => (
      <Link
        to={`/one-time-form/${row.formId}/edit`}
        className="text-primary hover:underline"
      >
        {row.title}
      </Link>
    ),
  },
  {
    field: 'status',
    headerName: '상태',
    width: 110,
    sortable: false,
    renderCell: ({ row }) => {
      const status = getOneTimeFormStatus(row);
      return (
        <Chip
          size="small"
          color={STATUS_CHIP_COLOR[status]}
          label={ONE_TIME_FORM_STATUS_LABEL[status]}
        />
      );
    },
  },
  {
    field: 'period',
    headerName: '기간',
    width: 320,
    sortable: false,
    valueGetter: (_, row) => formatPeriod(row),
  },
  {
    field: 'applicationCount',
    headerName: '신청 수',
    description: '취소한 신청도 포함합니다.',
    type: 'number',
    width: 100,
  },
];

const OneTimeFormListPage = () => {
  const { data, isLoading, isError } = useOneTimeFormListQuery();

  return (
    <div className="mx-6 mb-40 mt-6">
      <Header>
        <Heading>폼 관리/등록</Heading>
      </Header>

      <div className="my-4 flex items-center justify-end">
        <ActionButton
          type="button"
          bgColor="blue"
          width="6rem"
          to="/one-time-form/new"
        >
          폼 만들기
        </ActionButton>
      </div>

      <main>
        {isError ? (
          <div className="py-4 text-center">폼 목록을 불러오지 못했습니다.</div>
        ) : (
          <DataGrid
            autoHeight
            rows={data?.forms ?? []}
            columns={columns}
            getRowId={(row) => row.formId}
            loading={isLoading}
            localeText={LOCALE_TEXT}
            disableRowSelectionOnClick
            hideFooter
          />
        )}
      </main>
    </div>
  );
};

export default OneTimeFormListPage;
