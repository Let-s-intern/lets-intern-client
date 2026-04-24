'use client';

import { useMemo, useState } from 'react';

import {
  BannerAdminListItemType,
  useDeleteBannerForAdmin,
  useGetBannerListForAdmin,
} from '@/api/banner';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import BannerVisibilityToggle from '@/domain/admin/banner/BannerVisibilityToggle';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';

const TopBarBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const {
    data: topBannerList,
    isLoading,
    error,
  } = useGetBannerListForAdmin({ type: 'LINE' });

  const deleteTopBarBanner = useDeleteBannerForAdmin({
    successCallback: async () => {
      setIsDeleteModalShown(false);
    },
  });

  const handleDeleteButtonClicked = (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  const columns = useMemo<GridColDef<BannerAdminListItemType>[]>(
    () => [
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        valueGetter: (_, row) => row.title || '-',
      },
      {
        field: 'link',
        headerName: '링크',
        width: 250,
        valueGetter: (_, row) => row.link || '-',
      },
      {
        field: 'isVisible',
        headerName: '노출 여부',
        width: 150,
        type: 'boolean',
        renderCell: ({ row }) => (
          <BannerVisibilityToggle type="LINE" row={row} />
        ),
      },
      {
        field: 'date',
        headerName: '노출 기간',
        width: 250,
        valueGetter: (_, row) =>
          `${dayjs(row.startDate).format('YYYY-MM-DD')} ~ ${dayjs(
            row.endDate,
          ).format('YYYY-MM-DD')}`,
      },
      {
        field: 'management',
        type: 'actions',
        headerName: '관리',
        width: 150,
        getActions: (params: GridRowParams<BannerAdminListItemType>) => {
          const id = params.id;

          return [
            <Link
              href={`/admin/banner/top-bar-banners/${id}/edit`}
              key={'edit' + id}
            >
              <Pencil />
            </Link>,
            <Trash
              key={'delete' + id}
              className="ml-4 cursor-pointer"
              color="red"
              onClick={() => handleDeleteButtonClicked(Number(id))}
            />,
          ];
        },
      },
    ],
    [],
  );

  return (
    <>
      <TableLayout
        title="상단 띠 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/banner/top-bar-banners/new',
        }}
      >
        {isLoading ? (
          <LoadingContainer />
        ) : error || !topBannerList || topBannerList.bannerList.length === 0 ? (
          <EmptyContainer />
        ) : (
          <DataGrid
            rows={topBannerList?.bannerList || []}
            columns={columns}
            hideFooter
          />
        )}
      </TableLayout>
      <WarningModal
        isOpen={isDeleteModalShown}
        title="띠 배너 삭제"
        content="정말로 띠 배너를 삭제하시겠습니까?"
        onConfirm={() =>
          bannerIdForDeleting &&
          deleteTopBarBanner.mutate({
            bannerId: bannerIdForDeleting,
            type: 'LINE',
          })
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default TopBarBanners;
