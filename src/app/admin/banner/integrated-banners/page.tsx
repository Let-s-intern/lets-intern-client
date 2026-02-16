'use client';

import { useMemo, useState } from 'react';

import {
  CommonBannerAdminAllItemType,
  CommonBannerAdminListItemType,
  CommonBannerType,
  useDeleteBannerForAdmin,
  useGetActiveBannersForAdmin,
  useGetCommonBannerForAdmin,
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

type TabType = 'active' | 'all';

// 배너 위치 타입별 한글 이름 매핑
const BANNER_TYPE_LABELS: Record<CommonBannerType, string> = {
  HOME_TOP: '홈 상단',
  HOME_BOTTOM: '홈 하단',
  PROGRAM: '프로그램',
  MY_PAGE: '마이페이지',
};

const CommonBanners = () => {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [isDeleteModalShown, setIsDeleteModalShown] = useState<boolean>(false);
  const [bannerIdForDeleting, setBannerIdForDeleting] = useState<number>();

  // 노출 중 탭 API
  const {
    data: activeBannerData,
    isLoading: isActiveLoading,
    error: activeError,
  } = useGetActiveBannersForAdmin({ enabled: activeTab === 'active' });

  // 전체 탭 API
  const {
    data: allBannerData,
    isLoading: isAllLoading,
    error: allError,
  } = useGetCommonBannerForAdmin({ enabled: activeTab === 'all' });

  const isLoading = activeTab === 'active' ? isActiveLoading : isAllLoading;
  const error = activeTab === 'active' ? activeError : allError;

  const { mutate: deleteBanner } = useDeleteBannerForAdmin({
    successCallback: async () => {
      setIsDeleteModalShown(false);
    },
  });

  const handleDeleteButtonClicked = (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  // 노출 중 탭: 배너 위치별로 그룹화된 데이터 (기존 UI 유지)
  const flattenedBanners = useMemo(() => {
    if (activeTab !== 'active' || !activeBannerData?.commonBannerList)
      return [];

    const banners: Array<
      CommonBannerAdminListItemType & {
        bannerPosition: string;
        uniqueId: string;
      }
    > = [];

    const bannerList = activeBannerData.commonBannerList;

    // 객체 형식인 경우 (노출 중 탭)
    if (!Array.isArray(bannerList)) {
      Object.entries(bannerList).forEach(([key, bannerArray]) => {
        bannerArray.forEach((banner) => {
          banners.push({
            ...banner,
            bannerPosition: BANNER_TYPE_LABELS[banner.type] || banner.type,
            uniqueId: `${banner.type}-${banner.commonBannerId}`,
          });
        });
      });
    }

    return banners;
  }, [activeTab, activeBannerData]);

  // 전체 탭: 평탄화된 배너 리스트
  const allBanners = useMemo(() => {
    if (activeTab !== 'all' || !allBannerData?.commonBannerList) return [];

    const bannerList = allBannerData.commonBannerList;

    // 배열 형식인 경우 (전체 탭)
    if (Array.isArray(bannerList)) {
      return bannerList.map((banner) => ({
        ...banner,
        uniqueId: `${banner.commonBannerId}`,
      }));
    }

    return [];
  }, [activeTab, allBannerData]);

  // 노출 중 탭용 컬럼 (기존 유지)
  const activeColumns = useMemo<
    GridColDef<
      CommonBannerAdminListItemType & {
        bannerPosition: string;
        uniqueId: string;
      }
    >[]
  >(
    () => [
      {
        field: 'bannerPosition',
        headerName: '배너 위치',
        width: 150,
        valueGetter: (_, row) => row.bannerPosition,
      },
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        valueGetter: (_, row) => row.title || '-',
      },
      {
        field: 'landingUrl',
        headerName: '랜딩 URL',
        width: 250,
        valueGetter: (_, row) => row.landingUrl || '-',
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
        getActions: (
          params: GridRowParams<
            CommonBannerAdminListItemType & {
              bannerPosition: string;
              uniqueId: string;
            }
          >,
        ) => {
          const id = params.row.commonBannerId;

          return [
            <Link
              href={`/admin/home/common-banners/${id}/edit`}
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

  // 전체 탭용 컬럼
  const allColumns = useMemo<
    GridColDef<CommonBannerAdminAllItemType & { uniqueId: string }>[]
  >(
    () => [
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        valueGetter: (_, row) => row.title || '-',
      },
      {
        field: 'landingUrl',
        headerName: '링크',
        width: 250,
        valueGetter: (_, row) => row.landingUrl || '-',
      },
      {
        field: 'isVisible',
        headerName: '노출 여부',
        width: 150,
        renderCell: ({ row }) => (
          <BannerVisibilityToggle
            type="COMMON"
            row={{ ...row, id: row.commonBannerId }}
          />
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
        width: 100,
        getActions: (
          params: GridRowParams<
            CommonBannerAdminAllItemType & { uniqueId: string }
          >,
        ) => {
          const id = params.row.commonBannerId;

          return [
            <Link
              href={`/admin/home/common-banners/${id}/edit`}
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

  const renderContent = () => {
    if (isLoading) {
      return <LoadingContainer />;
    }

    if (error) {
      return <EmptyContainer />;
    }

    // 노출 중 탭 (기존 UI 유지)
    if (activeTab === 'active') {
      if (flattenedBanners.length === 0) {
        return <EmptyContainer />;
      }

      return (
        <DataGrid
          rows={flattenedBanners}
          getRowId={(row) => row.uniqueId}
          columns={activeColumns}
          hideFooter
        />
      );
    }

    // 전체 탭
    if (activeTab === 'all') {
      if (allBanners.length === 0) {
        return <EmptyContainer />;
      }

      return (
        <DataGrid
          rows={allBanners}
          getRowId={(row) => row.uniqueId}
          columns={allColumns}
          hideFooter
        />
      );
    }

    return <EmptyContainer />;
  };

  return (
    <>
      <TableLayout
        title="통합 배너 관리"
        headerButton={{
          label: '등록',
          href: '/admin/home/common-banners/new',
        }}
        tabs={
          <div className="flex items-center gap-3 text-sm">
            <button
              className={
                activeTab === 'active' ? 'text-primary' : 'text-neutral-40'
              }
              onClick={() => setActiveTab('active')}
            >
              노출 중
            </button>
            <span className="text-gray-300">|</span>
            <button
              className={
                activeTab === 'all' ? 'text-primary' : 'text-neutral-40'
              }
              onClick={() => setActiveTab('all')}
            >
              전체
            </button>
          </div>
        }
      >
        {renderContent()}
      </TableLayout>
      <WarningModal
        isOpen={isDeleteModalShown}
        title="배너 삭제"
        content="정말로 배너를 삭제하시겠습니까?"
        onConfirm={() =>
          bannerIdForDeleting &&
          deleteBanner({
            bannerId: bannerIdForDeleting,
            type: 'COMMON',
          })
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default CommonBanners;
