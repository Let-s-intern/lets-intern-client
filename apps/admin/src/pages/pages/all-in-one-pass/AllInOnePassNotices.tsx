import {
  allInOnePassNoticeListQueryKey,
  NoticeFormValues,
  useCreateAllInOnePassNoticeMutation,
  useDeleteAllInOnePassNoticeMutation,
  useGetAllInOnePassNoticeListQuery,
  useUpdateAllInOnePassNoticeMutation,
} from '@/api/all-in-one-pass/useNoticeList';
import {
  AllInOnePassNotice,
  AllInOnePassNoticeType,
} from '@/api/all-in-one-pass/allInOnePassSchema';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import CategoryTabs from '@/common/ui/CategoryTabs';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import NoticeExposureModal from '@/domain/all-in-one-pass/ui/notice/NoticeExposureModal';
import NoticeFormModal from '@/domain/all-in-one-pass/ui/notice/NoticeFormModal';
import NoticeRowActions from '@/domain/all-in-one-pass/ui/notice/NoticeRowActions';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import dayjs from '@/lib/dayjs';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

type TabValue = 'ALL' | AllInOnePassNoticeType;

const TAB_OPTIONS: { value: TabValue; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'NOTICE', label: '공지' },
  { value: 'GUIDE', label: '가이드' },
];

const NOTICE_TYPE_LABEL: Record<AllInOnePassNoticeType, string> = {
  NOTICE: '공지',
  GUIDE: '가이드',
};

/** 모달 대상: 생성(POST) 또는 특정 공지 수정(PATCH) */
type ModalTarget =
  | { mode: 'create' }
  | { mode: 'edit'; notice: AllInOnePassNotice };

/** A-3 공지 / 가이드 관리 */
export default function AllInOnePassNotices() {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const [tab, setTab] = useState<TabValue>('ALL');
  const [target, setTarget] = useState<ModalTarget | null>(null);
  const [exposureNotice, setExposureNotice] =
    useState<AllInOnePassNotice | null>(null);

  const { data, isLoading, error } = useGetAllInOnePassNoticeListQuery(
    tab === 'ALL' ? undefined : tab,
  );
  const list = data ?? [];

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [allInOnePassNoticeListQueryKey],
    });
  const createNotice = useCreateAllInOnePassNoticeMutation({
    successCallback: invalidate,
  });
  const updateNotice = useUpdateAllInOnePassNoticeMutation({
    successCallback: invalidate,
  });
  const deleteNotice = useDeleteAllInOnePassNoticeMutation({
    successCallback: invalidate,
  });

  const handleSubmit = async (values: NoticeFormValues) => {
    try {
      if (target?.mode === 'edit') {
        await updateNotice.mutateAsync({ id: target.notice.id, values });
        snackbar('수정되었습니다.');
      } else {
        await createNotice.mutateAsync(values);
        snackbar('추가되었습니다.');
      }
      setTarget(null);
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '저장에 실패했습니다.');
    }
  };

  const handleDelete = async (notice: AllInOnePassNotice) => {
    if (!window.confirm(`<${notice.title}> 정말로 삭제하시겠습니까?`)) return;
    try {
      await deleteNotice.mutateAsync(notice.id);
      snackbar('삭제되었습니다.');
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    }
  };

  const columns: GridColDef<AllInOnePassNotice>[] = [
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
      field: 'createDate',
      headerName: '생성일',
      type: 'dateTime',
      width: 180,
      valueGetter: (_, row) => dayjs(row.createDate).toDate(),
      valueFormatter: (value) => dayjs(value).format('YYYY/MM/DD HH:mm'),
    },
    {
      field: 'exposure',
      headerName: '노출 영역 관리',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex h-full items-center">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setExposureNotice(row)}
          >
            노출 영역 관리
          </Button>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: '관리',
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <NoticeRowActions
          notice={row}
          onEdit={(notice) => setTarget({ mode: 'edit', notice })}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>공지/가이드 관리</Heading>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus size={12} />}
          onClick={() => setTarget({ mode: 'create' })}
        >
          공지/가이드 추가
        </Button>
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
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}

      <NoticeFormModal
        open={target !== null}
        isEdit={target?.mode === 'edit'}
        initial={target?.mode === 'edit' ? target.notice : null}
        onSubmit={handleSubmit}
        onClose={() => setTarget(null)}
        isLoading={createNotice.isPending || updateNotice.isPending}
      />

      <NoticeExposureModal
        notice={exposureNotice}
        onClose={() => setExposureNotice(null)}
      />
    </main>
  );
}
