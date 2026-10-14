import { useGetActivePassParticipantsQuery } from '@/api/all-in-one-pass/useActiveParticipants';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { ActivePassParticipant } from '@/domain/all-in-one-pass/types';
import ParticipationHistoryModal from '@/domain/all-in-one-pass/ui/participant/ParticipationHistoryModal';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import dayjs from '@/lib/dayjs';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

const periodSummary = (p: ActivePassParticipant) => {
  const first = p.periods[0];
  const last = p.periods[p.periods.length - 1];
  if (!first || !last) return null;
  return {
    days: dayjs(last.endDate).diff(dayjs(first.startDate), 'day'),
    range: `${dayjs(first.startDate).format('YYYY.MM.DD')} ~ ${dayjs(
      last.endDate,
    ).format('YYYY.MM.DD')}`,
  };
};

const totalPrice = (p: ActivePassParticipant) =>
  p.periods.reduce((sum, period) => sum + period.price, 0);

/** A-8 참여중 유저 목록 (전 패스 통합 · 현재 참여중) */
export default function AllInOnePassParticipants() {
  const [historyTarget, setHistoryTarget] =
    useState<ActivePassParticipant | null>(null);

  const { data, isLoading, error } = useGetActivePassParticipantsQuery();
  const list = useMemo(() => data ?? [], [data]);

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const columns: GridColDef<ActivePassParticipant>[] = [
    { field: 'id', headerName: '주문번호', width: 150 },
    { field: 'name', headerName: '이름', width: 100 },
    {
      field: 'email',
      headerName: '이메일',
      minWidth: 240,
      valueGetter: (_, row) => row.email || '-',
    },
    {
      field: 'passTitle',
      headerName: '참여 올인원패스',
      flex: 1,
      minWidth: 220,
      valueGetter: (_, row) => row.passTitle || '-',
    },
    {
      field: 'totalPrice',
      headerName: '결제 금액',
      width: 130,
      sortable: false,
      valueGetter: (_, row) => `${totalPrice(row).toLocaleString()}원`,
    },
    {
      field: 'history',
      headerName: '연장 정보',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        const extendCount = Math.max(row.periods.length - 1, 0);
        return (
          <span
            className={extendCount === 0 ? 'text-neutral-40' : 'text-neutral-0'}
          >
            {extendCount === 0 ? '-' : `연장 ${extendCount}회`}
          </span>
        );
      },
    },
    {
      field: 'period',
      headerName: '참여 기간',
      width: 360,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        const summary = periodSummary(row);
        if (!summary) return '-';
        const hasExtension = row.periods.length > 1;
        return (
          <div className="flex h-full w-full items-center gap-1.5 pr-1">
            <span className="text-neutral-0 w-11 shrink-0">
              {summary.days}일
            </span>
            <span className="text-neutral-0">({summary.range})</span>
            {hasExtension && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className="!ml-auto"
                onClick={() => setHistoryTarget(row)}
              >
                자세히보기
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>참여중인 유저 목록</Heading>
      </Header>

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : list.length === 0 ? (
        <EmptyContainer text="참여중인 유저가 없습니다." />
      ) : (
        <DataGrid
          autoHeight
          rows={list}
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}

      <ParticipationHistoryModal
        participant={historyTarget}
        onClose={() => setHistoryTarget(null)}
      />
    </main>
  );
}
