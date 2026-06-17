import { useMemo, useState } from 'react';

import {
  CommonBannerAdminListItemType,
  CommonBannerType,
  useDeleteCommonBannerForAdmin,
  useGetActiveBannersForAdmin,
  useGetCommonBannerForAdmin,
  useUpdateExpiredCommonBanners,
} from '@/api/banner';

export type TabType = 'active' | 'all';

const useCommonBanners = () => {
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

  const { mutate: updateExpiredBanners, isPending: isUpdatingExpired } =
    useUpdateExpiredCommonBanners({
      successCallback: () => {
        alert('만료된 배너가 업데이트되었습니다.');
      },
      errorCallback: (error) => {
        alert('업데이트에 실패했습니다: ' + error.message);
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

  return {
    activeTab,
    setActiveTab,
    isLoading,
    error,
    groupedActiveBanners,
    allBanners,
    isDeleteModalShown,
    setIsDeleteModalShown,
    bannerIdForDeleting,
    handleDeleteButtonClicked,
    deleteCommonBanner,
    isUpdatingExpired,
    updateExpiredBanners,
  };
};

export default useCommonBanners;
