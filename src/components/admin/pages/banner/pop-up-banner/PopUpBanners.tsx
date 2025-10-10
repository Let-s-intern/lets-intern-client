'use client';

import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';

import {
  BannerAdminListItemType,
  useDeleteBannerForAdmin,
  useGetBannerListForAdmin,
} from '@/api/banner';
import BannerVisibilityToggle from '@components/admin/banner/BannerVisibilityToggle';
import TableLayout from '@components/admin/ui/table/TableLayout';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import WarningModal from '@components/ui/alert/WarningModal';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';

const PopUpBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [popUpIdForDeleting, setPopUpIdForDeleting] = useState<number>();

  const {
    data: popupList,
    isLoading,
    error,
  } = useGetBannerListForAdmin({ type: 'POPUP' });

  const { mutate: deletePopupBanner } = useDeleteBannerForAdmin({
    successCallback: async () => {
      setIsDeleteModalShown(false);
    },
  });

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setPopUpIdForDeleting(bannerId);
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
          <BannerVisibilityToggle type="POPUP" row={row} />
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
            <Link href={`/admin/banner/pop-up/${id}/edit`} key={'edit' + id}>
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
        title="팝업 관리"
        headerButton={{
          label: '등록',
          href: '/admin/banner/pop-up/new',
        }}
      >
        {isLoading ? (
          <LoadingContainer />
        ) : error || !popupList || popupList.bannerList.length === 0 ? (
          <EmptyContainer />
        ) : (
          <DataGrid rows={popupList.bannerList} columns={columns} hideFooter />
        )}
      </TableLayout>
      <WarningModal
        isOpen={isDeleteModalShown}
        title="팝업 삭제"
        content="정말로 팝업을 삭제하시겠습니까?"
        onConfirm={() =>
          popUpIdForDeleting &&
          deletePopupBanner({
            bannerId: popUpIdForDeleting,
            type: 'POPUP',
          })
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default PopUpBanners;
