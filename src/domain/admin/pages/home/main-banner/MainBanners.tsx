'use client';

import { useMemo, useState } from 'react';

import {
  BannerAdminListItemType,
  useDeleteBannerForAdmin,
  useGetBannerListForAdmin,
} from '@/api/banner';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/ui/EmptyContainer';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import BannerVisibilityToggle from '@/domain/admin/banner/BannerVisibilityToggle';
import TableLayout from '@/domain/admin/ui/table/TableLayout';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';

const MainBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const {
    data: mainBannerList,
    isLoading,
    error,
  } = useGetBannerListForAdmin({ type: 'MAIN' });

  const { mutate: deleteMainBanner } = useDeleteBannerForAdmin({
    successCallback: async () => {
      setIsDeleteModalShown(false);
    },
  });

  const handleDeleteButtonClicked = async (bannerId: number) => {
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
          <BannerVisibilityToggle type="MAIN" row={row} />
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
              href={`/admin/home/main-banners/${id}/edit`}
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
        title="홈 상단 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/home/main-banners/new',
        }}
      >
        {isLoading ? (
          <LoadingContainer />
        ) : error ||
          !mainBannerList ||
          mainBannerList.bannerList.length === 0 ? (
          <EmptyContainer />
        ) : (
          <DataGrid
            rows={mainBannerList?.bannerList || []}
            columns={columns}
            hideFooter
          />
        )}
      </TableLayout>
      <WarningModal
        isOpen={isDeleteModalShown}
        title="홈 상단 배너 삭제"
        content="정말로 홈 상단 배너를 삭제하시겠습니까?"
        onConfirm={() =>
          bannerIdForDeleting &&
          deleteMainBanner({
            bannerId: bannerIdForDeleting,
            type: 'MAIN',
          })
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default MainBanners;
