import {
  AdminBannerWithPositionType,
  useDeleteBannerForAdmin,
  useGetBannerListForAdmin,
} from '@/api/banner';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/ui/EmptyContainer';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import BannerVisibilityToggle from '@/domain/admin/banner/BannerVisibilityToggle';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const AllBanners = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerForDeleting, setBannerForDeleting] =
    useState<AdminBannerWithPositionType>();

  const { data: topBanners, isLoading: isTopBannerLoading } =
    useGetBannerListForAdmin({ type: 'MAIN' });
  const { data: bottomBanners, isLoading: isBottomBannerLoading } =
    useGetBannerListForAdmin({ type: 'MAIN_BOTTOM' });
  const { data: programBanners, isLoading: isProgramBannerLoading } =
    useGetBannerListForAdmin({ type: 'PROGRAM' });

  const { mutate: deleteBanner } = useDeleteBannerForAdmin({
    successCallback: async () => {
      setIsDeleteModalShown(false);
    },
  });

  // 모든 배너를 1차원 배열로 합치기
  const allBanners = useMemo(() => {
    const banners: AdminBannerWithPositionType[] = [];

    if (topBanners?.bannerList) {
      banners.push(
        ...topBanners.bannerList.map((banner) => ({
          ...banner,
          type: 'MAIN' as const,
          position: '홈 상단',
        })),
      );
    }

    if (bottomBanners?.bannerList) {
      banners.push(
        ...bottomBanners.bannerList.map((banner) => ({
          ...banner,
          type: 'MAIN_BOTTOM' as const,
          position: '홈 하단',
        })),
      );
    }

    if (programBanners?.bannerList) {
      banners.push(
        ...programBanners.bannerList.map((banner) => ({
          ...banner,
          type: 'PROGRAM' as const,
          position: '프로그램',
        })),
      );
    }

    return banners;
  }, [topBanners, bottomBanners, programBanners]);

  const isLoading =
    isTopBannerLoading || isBottomBannerLoading || isProgramBannerLoading;

  const handleDeleteButtonClicked = async (
    banner: AdminBannerWithPositionType,
  ) => {
    setBannerForDeleting(banner);
    setIsDeleteModalShown(true);
  };

  const columns = useMemo<GridColDef<AdminBannerWithPositionType>[]>(
    () => [
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
        field: 'visible',
        headerName: '노출 여부',
        width: 150,
        renderCell: (params) => (
          <BannerVisibilityToggle type={params.row.type} row={params.row} />
        ),
      },
      {
        field: 'date',
        headerName: '노출 기간',
        width: 240,
        valueGetter: (_, row) =>
          `${dayjs(row.startDate).format('YYYY-MM-DD')} ~ ${dayjs(row.endDate).format('YYYY-MM-DD')}`,
      },
      {
        field: 'management',
        type: 'actions',
        headerName: '관리',
        width: 150,
        getActions: (params: GridRowParams<AdminBannerWithPositionType>) => {
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

export default AllBanners;
