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
import { useState } from 'react';

const rangeLabel = (p: ActivePassParticipant) =>
  p.startDate && p.endDate
    ? `${dayjs(p.startDate).format('YYYY.MM.DD')} ~ ${dayjs(p.endDate).format(
        'YYYY.MM.DD',
      )}`
    : '-';

/** 참여중 유저 목록 (전 패스 통합 · 현재 참여중) */
export default function AllInOnePassParticipants() {
  const [historyTarget, setHistoryTarget] =
    useState<ActivePassParticipant | null>(null);

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const { data, isLoading, error } = useGetActivePassParticipantsQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const list = data?.list ?? [];

  const columns: GridColDef<ActivePassParticipant>[] = [
    { field: 'orderId', headerName: '주문번호', width: 150 },
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
      field: 'totalPayment',
      headerName: '결제 금액',
      width: 130,
      sortable: false,
      valueGetter: (_, row) => `${row.totalPayment.toLocaleString()}원`,
    },
    {
      field: 'extensionCount',
      headerName: '연장 정보',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <span
          className={
            row.extensionCount === 0 ? 'text-neutral-40' : 'text-neutral-0'
          }
        >
          {row.extensionCount === 0 ? '-' : `연장 ${row.extensionCount}회`}
        </span>
      ),
    },
    {
      field: 'period',
      headerName: '참여 기간',
      width: 360,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex h-full w-full items-center gap-1.5 pr-1">
          <span className="text-neutral-0 w-11 shrink-0">
            {row.totalDays}일
          </span>
          <span className="text-neutral-0">({rangeLabel(row)})</span>
          {row.extensionCount > 0 && (
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
      ),
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
          paginationMode="server"
          rowCount={data?.totalElements ?? 0}
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
