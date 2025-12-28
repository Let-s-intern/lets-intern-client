import { BannerWithPositionType, useGetBannerListForUser } from '@/api/banner';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/ui/EmptyContainer';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { PenIcon, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const dataGridStyles = {
  '& .MuiDataGrid-cell.merged-cell': {
    borderTop: 'none',
  },
};

const VisibleBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  const { data: topBanners, isLoading: isTopBannerLoading } =
    useGetBannerListForUser({ type: 'MAIN' });
  const { data: bottomBanners, isLoading: isBottomBannerLoading } =
    useGetBannerListForUser({ type: 'MAIN_BOTTOM' });
  const { data: programBanners, isLoading: isProgramBannerLoading } =
    useGetBannerListForUser({ type: 'PROGRAM' });

  // 모든 배너를 1차원 배열로 합치기
  const allBanners = useMemo(() => {
    const banners = [];

    if (topBanners?.bannerList) {
      banners.push(
        ...topBanners.bannerList.map((banner, index) => ({
          ...banner,
          position: '홈 상단',
          isFirstInGroup: index === 0,
        })),
      );
    }

    if (bottomBanners?.bannerList) {
      banners.push(
        ...bottomBanners.bannerList.map((banner, index) => ({
          ...banner,
          position: '홈 하단',
          isFirstInGroup: index === 0,
        })),
      );
    }

    if (programBanners?.bannerList) {
      banners.push(
        ...programBanners.bannerList.map((banner, index) => ({
          ...banner,
          position: '프로그램',
          isFirstInGroup: index === 0,
        })),
      );
    }

    return banners;
  }, [topBanners, bottomBanners, programBanners]);

  const isLoading =
    isTopBannerLoading || isBottomBannerLoading || isProgramBannerLoading;

  const handleDeleteButtonClicked = async (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  const columns = useMemo<GridColDef<BannerWithPositionType>[]>(
    () => [
      {
        field: 'position',
        headerName: '배너 위치',
        flex: 1,
        renderCell: (params) => {
          if (params.row.isFirstInGroup) {
            return params.row.position || '-';
          }
          return '';
        },
        cellClassName: (params) => {
          if (!params.row.isFirstInGroup) {
            return 'merged-cell';
          }
          return '';
        },
      },
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        valueGetter: (value) => value || '-',
      },
      {
        field: 'link',
        headerName: '랜딩 URL',
        width: 250,
        valueGetter: (value) => value || '-',
      },
      {
        field: 'startDate',
        headerName: '노출 시작일',
        width: 150,

        valueGetter: (value) => dayjs(value).format('YYYY-MM-DD'),
      },
      {
        field: 'endDate',
        headerName: '노출 종료일',
        width: 150,

        valueGetter: (value) => dayjs(value).format('YYYY-MM-DD'),
      },
      {
        field: 'management',
        type: 'actions',
        headerName: '관리',
        width: 150,
        getActions: (params: GridRowParams<BannerWithPositionType>) => {
          const id = params.id;

          return [
            <Link href={`/admin/banner/pop-up/${id}/edit`} key={'edit' + id}>
              <PenIcon className="cursor-pointer" />
            </Link>,
            <Trash
              key={'delete' + id}
              className="className='cursor-pointer' ml-4 cursor-pointer"
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
      {isLoading ? (
        <LoadingContainer />
      ) : allBanners.length === 0 ? (
        <EmptyContainer />
      ) : (
        <DataGrid
          rows={allBanners}
          columns={columns}
          hideFooter
          disableColumnMenu
          disableColumnSorting
          sx={dataGridStyles}
        />
      )}

      <WarningModal
        isOpen={isDeleteModalShown}
        title="배너 삭제"
        content="정말로 배너를 삭제하시겠습니까?"
        onConfirm={
          () => bannerIdForDeleting
          // &&
          // deletePopupBanner({
          //   bannerId: popUpIdForDeleting,
          //   type: 'POPUP',
          // })
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default VisibleBanners;
