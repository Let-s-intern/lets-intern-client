import { useMemo, useState } from 'react';

import {
  BannerAdminListItemType,
  useDeleteBannerForAdmin,
  useGetBannerListForAdmin,
} from '@/api/banner';
import dayjs from '@/lib/dayjs';
import BannerVisibilityToggle from '@components/admin/banner/BannerVisibilityToggle';
import TableLayout from '@components/admin/ui/table/TableLayout';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import WarningModal from '@components/ui/alert/WarningModal';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

const BottomBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const {
    data: bottomBannerList,
    isLoading,
    error,
  } = useGetBannerListForAdmin({ type: 'HOME_BOTTOM' });

  const { mutate: deleteBottomBanner } = useDeleteBannerForAdmin({
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
              to={`/admin/home/bottom-banners/${id}/edit`}
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
        title="홈 하단 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/home/bottom-banners/new',
        }}
      >
        {isLoading ? (
          <LoadingContainer />
        ) : error ||
          !bottomBannerList ||
          bottomBannerList.bannerList.length === 0 ? (
          <EmptyContainer />
        ) : (
          <DataGrid
            rows={bottomBannerList?.bannerList || []}
            columns={columns}
            hideFooter
          />
        )}
      </TableLayout>
      <WarningModal
        isOpen={isDeleteModalShown}
        title="홈 하단 배너 삭제"
        content="정말로 홈 하단 배너를 삭제하시겠습니까?"
        onConfirm={() =>
          bannerIdForDeleting &&
          deleteBottomBanner({
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

export default BottomBanners;
