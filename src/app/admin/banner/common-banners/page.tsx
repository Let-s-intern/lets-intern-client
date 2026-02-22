'use client';

import { useMemo, useState } from 'react';

import {
  CommonBannerAdminAllItemType,
  CommonBannerAdminListItemType,
  CommonBannerType,
  useDeleteCommonBannerForAdmin,
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

const BANNER_TYPE_ORDER: CommonBannerType[] = [
  'HOME_TOP',
  'HOME_BOTTOM',
  'PROGRAM',
  'MY_PAGE',
];

interface ActiveBannerTableProps {
  groupedData: Record<CommonBannerType, CommonBannerAdminListItemType[]>;
  onDeleteClick: (bannerId: number) => void;
}

const ActiveBannerTable = ({
  groupedData,
  onDeleteClick,
}: ActiveBannerTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="w-[150px] px-4 py-3 text-left font-medium">
            배너 위치
          </th>
          <th className="px-4 py-3 text-left font-medium text-gray-600">
            제목
          </th>
          <th className="w-[300px] px-4 py-3 text-left font-medium text-gray-600">
            랜딩 URL
          </th>
          <th className="w-[160px] px-4 py-3 text-left font-medium text-gray-600">
            노출 시작일
          </th>
          <th className="w-[160px] px-4 py-3 text-left font-medium text-gray-600">
            노출 종료일
          </th>
          <th className="w-[80px] px-4 py-3 text-center font-medium text-gray-600">
            관리
          </th>
        </tr>
      </thead>
      <tbody>
        {BANNER_TYPE_ORDER.map((type) => {
          const banners = groupedData[type] ?? [];
          const label = BANNER_TYPE_LABELS[type];

          if (banners.length === 0) {
            // 배너 없는 위치: 빈 행으로 표시
            return (
              <tr key={type} className="border-b border-gray-100">
                <td className="bg-gray-50 px-4 py-4 align-middle font-bold text-gray-800">
                  {label}
                </td>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-400">
                  -
                </td>
              </tr>
            );
          }

          return banners.map((banner, index) => (
            <tr
              key={`${type}-${banner.commonBannerId}-${index}`}
              className="border-b border-gray-100"
            >
              {/* 첫 번째 행에만 위치명 표시 */}
              {index === 0 && (
                <td
                  className="bg-gray-50 px-4 py-4 align-top font-bold text-gray-800"
                  rowSpan={banners.length}
                >
                  {label}
                </td>
              )}
              <td className="px-4 py-4 text-gray-700">{banner.title || '-'}</td>
              <td className="max-w-[300px] truncate px-4 py-4 text-gray-500">
                {banner.landingUrl || '-'}
              </td>
              <td className="whitespace-pre-line px-4 py-4 text-gray-700">
                {dayjs(banner.startDate).format('YYYY-MM-DD\nHH:mm:ss')}
              </td>
              <td className="whitespace-pre-line px-4 py-4 text-gray-700">
                {dayjs(banner.endDate).format('YYYY-MM-DD\nHH:mm:ss')}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href={`/admin/banner/common-banners/${banner.commonBannerId}/edit`}
                  >
                    <Pencil
                      size={16}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                    />
                  </Link>
                  <Trash
                    size={16}
                    className="cursor-pointer text-gray-400 hover:text-red-500"
                    onClick={() => onDeleteClick(Number(banner.commonBannerId))}
                  />
                </div>
              </td>
            </tr>
          ));
        })}
      </tbody>
    </table>
  );
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

  const { mutate: deleteCommonBanner } = useDeleteCommonBannerForAdmin({
    successCallback: () => {
      setIsDeleteModalShown(false);
    },
  });

  const handleDeleteButtonClicked = (bannerId: number) => {
    setBannerIdForDeleting(bannerId);
    setIsDeleteModalShown(true);
  };

  // 노출 중 탭: 위치별로 그룹화된 데이터
  const groupedActiveBanners = useMemo(() => {
    const result: Record<CommonBannerType, CommonBannerAdminListItemType[]> = {
      HOME_TOP: [],
      HOME_BOTTOM: [],
      PROGRAM: [],
      MY_PAGE: [],
    };

    if (activeTab !== 'active' || !activeBannerData?.commonBannerList)
      return result;

    const bannerList = activeBannerData.commonBannerList;

    if (!Array.isArray(bannerList)) {
      Object.entries(bannerList).forEach(([key, bannerArray]) => {
        if (key in result) {
          result[key as CommonBannerType] = bannerArray;
        }
      });
    }

    return result;
  }, [activeTab, activeBannerData]);

  // 전체 탭: 배너 리스트
  const allBanners = useMemo(() => {
    if (activeTab !== 'all' || !allBannerData?.commonBannerList) return [];

    const bannerList = allBannerData.commonBannerList;

    if (Array.isArray(bannerList)) {
      return bannerList.map((banner) => ({
        ...banner,
        uniqueId: `${banner.commonBannerId}`,
      }));
    }

    return [];
  }, [activeTab, allBannerData]);

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
        width: 300,
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
              href={`/admin/banner/common-banners/${id}/edit`}
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

    // 노출 중 탭: 커스텀 그룹핑 테이블
    if (activeTab === 'active') {
      return (
        <div className="overflow-x-auto rounded-xxs border border-gray-200">
          <ActiveBannerTable
            groupedData={groupedActiveBanners}
            onDeleteClick={handleDeleteButtonClicked}
          />
        </div>
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
          href: '/admin/banner/common-banners/new',
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
        <div className="pb-24">{renderContent()}</div>
      </TableLayout>
      <WarningModal
        isOpen={isDeleteModalShown}
        title="배너 삭제"
        content="정말로 배너를 삭제하시겠습니까?"
        onConfirm={() =>
          bannerIdForDeleting && deleteCommonBanner(bannerIdForDeleting)
        }
        onCancel={() => setIsDeleteModalShown(false)}
        confirmText="삭제"
      />
    </>
  );
};

export default CommonBanners;
