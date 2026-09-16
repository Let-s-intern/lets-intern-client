import { useGetAllInOnePassNoticeListQuery } from '@/api/all-in-one-pass/useNoticeList';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import CategoryTabs from '@/common/ui/CategoryTabs';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { AllInOnePassNotice, NoticeType } from '@/domain/all-in-one-pass/types';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

type TabValue = 'ALL' | NoticeType;

const TAB_OPTIONS: { value: TabValue; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'NOTICE', label: '공지' },
  { value: 'GUIDE', label: '가이드' },
];

const NOTICE_TYPE_LABEL: Record<NoticeType, string> = {
  NOTICE: '공지',
  GUIDE: '가이드',
};

const NOTICE_COLUMNS: GridColDef<AllInOnePassNotice>[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  {
    field: 'type',
    headerName: '콘텐츠 구분',
    width: 120,
    valueGetter: (_, row) => NOTICE_TYPE_LABEL[row.type],
  },
  {
    field: 'title',
    headerName: '제목',
    flex: 1,
    minWidth: 240,
    valueGetter: (_, row) => row.title || '-',
  },
  {
    field: 'createdAt',
    headerName: '생성일',
    type: 'dateTime',
    width: 160,
    valueGetter: (_, row) => dayjs(row.createdAt).toDate(),
    valueFormatter: (value) => dayjs(value).format('YYYY/MM/DD HH:mm'),
  },
];

/** A-3 공지 / 가이드 관리 */
export default function AllInOnePassNotices() {
  const [tab, setTab] = useState<TabValue>('ALL');

  const { data, isLoading, error } = useGetAllInOnePassNoticeListQuery(
    tab === 'ALL' ? undefined : tab,
  );
  const list = useMemo(() => data ?? [], [data]);

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>공지/가이드 관리</Heading>
      </Header>

      <CategoryTabs<TabValue>
        options={TAB_OPTIONS}
        selected={tab}
        onChange={setTab}
      />

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : list.length === 0 ? (
        <EmptyContainer text="등록된 공지/가이드가 없습니다." />
      ) : (
        <DataGrid
          autoHeight
          rows={list}
          columns={NOTICE_COLUMNS}
          pagination
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}
    </main>
  );
}
