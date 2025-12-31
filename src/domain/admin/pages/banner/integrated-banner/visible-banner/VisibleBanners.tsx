import {
  useDeleteBannerForAdmin,
  useGetBannerListForUser,
  UserBannerWithPositionType,
} from '@/api/banner';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/ui/EmptyContainer';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const dataGridStyles = {
  '& .MuiDataGrid-cell.merged-cell': {
    borderTop: 'none',
  },
};

const VisibleBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerForDeleting, setBannerForDeleting] =
    useState<UserBannerWithPositionType>();

  const { data: topBanners, isLoading: isTopBannerLoading } =
    useGetBannerListForUser({ type: 'MAIN' });
  const { data: bottomBanners, isLoading: isBottomBannerLoading } =
    useGetBannerListForUser({ type: 'MAIN_BOTTOM' });
  const { data: programBanners, isLoading: isProgramBannerLoading } =
    useGetBannerListForUser({ type: 'PROGRAM' });

  const { mutate: deleteBanner } = useDeleteBannerForAdmin({
    successCallback: async () => {
      setIsDeleteModalShown(false);
    },
  });

  // 모든 배너를 1차원 배열로 합치기
  const allBanners = useMemo(() => {
    const banners: UserBannerWithPositionType[] = [];

    if (topBanners?.bannerList) {
      banners.push(
        ...topBanners.bannerList.map((banner, index) => ({
          ...banner,
          type: 'MAIN' as const,
          position: '홈 상단',
          isFirstInGroup: index === 0,
        })),
      );
    }

    if (bottomBanners?.bannerList) {
      banners.push(
        ...bottomBanners.bannerList.map((banner, index) => ({
          ...banner,
          type: 'MAIN_BOTTOM' as const,
          position: '홈 하단',
          isFirstInGroup: index === 0,
        })),
      );
    }

    if (programBanners?.bannerList) {
      banners.push(
        ...programBanners.bannerList.map((banner, index) => ({
          ...banner,
          type: 'PROGRAM' as const,
          position: '프로그램',
          isFirstInGroup: index === 0,
        })),
      );
    }

    return banners;
  }, [topBanners, bottomBanners, programBanners]);

  const isLoading =
    isTopBannerLoading || isBottomBannerLoading || isProgramBannerLoading;

  const handleDeleteButtonClicked = async (
    banner: UserBannerWithPositionType,
  ) => {
    setBannerForDeleting(banner);
    setIsDeleteModalShown(true);
  };

  const columns = useMemo<GridColDef<UserBannerWithPositionType>[]>(
    () => [
      {
        field: 'position',
        headerName: '배너 위치',
        width: 150,
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
        flex: 2,
        renderCell: (params) => {
          const url = params.value;
          if (!url) return '-';
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {url}
            </a>
          );
        },
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
        getActions: (params: GridRowParams<UserBannerWithPositionType>) => {
          const id = params.id;

          return [
            <Link href={`/admin/banner/pop-up/${id}/edit`} key={'edit' + id}>
              <Pencil size="20" className="cursor-pointer" />
            </Link>,
            <Trash
              key={'delete' + id}
              className="className='cursor-pointer' ml-4 cursor-pointer"
              size="20"
              color="red"
              onClick={() => handleDeleteButtonClicked(params.row)}
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
        onConfirm={() =>
          bannerForDeleting &&
          deleteBanner({
            bannerId: bannerForDeleting.id,
            type: bannerForDeleting.type,
          })
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default VisibleBanners;
