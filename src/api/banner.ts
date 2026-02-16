import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const bannerAdminListItemSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isValid: z.boolean().nullable().optional(),
  isVisible: z.boolean().nullable().optional(),
  imgUrl: z.string().nullable().optional(),
  mobileImgUrl: z.string().nullable().optional(),
  contents: z.string().nullable().optional(),
  colorCode: z.string().nullable().optional(),
  textColorCode: z.string().nullable().optional(),
});

export type BannerAdminListItemType = z.infer<typeof bannerAdminListItemSchema>;

export type BannerItemType = {
  title?: string | null;
  link?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isValid?: boolean | null;
  isVisible?: boolean | null;
  imgUrl?: string | null;
  mobileImgUrl?: string | null;
  contents?: string | null;
  colorCode?: string | null;
  textColorCode?: string | null;
  file?: File | null;
  mobileFile?: File | null;
};

export const bannerAdminListSchema = z.object({
  bannerList: z.array(bannerAdminListItemSchema),
});

// 공통 배너 타입 정의
export type CommonBannerType =
  | 'HOME_TOP'
  | 'HOME_BOTTOM'
  | 'PROGRAM'
  | 'MY_PAGE';

// 공통 배너 아이템 스키마 (노출 중 - type 필수)
export const commonBannerAdminListItemSchema = z.object({
  type: z.enum(['HOME_TOP', 'HOME_BOTTOM', 'PROGRAM', 'MY_PAGE']),
  commonBannerId: z.number(),
  title: z.string().nullable().optional(),
  landingUrl: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isVisible: z.boolean().nullable().optional(),
});

// 공통 배너 아이템 스키마 (전체 - type optional)
export const commonBannerAdminAllItemSchema = z.object({
  commonBannerId: z.number(),
  title: z.string().nullable().optional(),
  landingUrl: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isVisible: z.boolean().nullable().optional(),
});

// 공통 배너 리스트 스키마 - 타입별로 그룹화된 객체 (노출 중)
export const commonBannerAdminListSchema = z.object({
  commonBannerList: z.record(z.array(commonBannerAdminListItemSchema)),
});

// 공통 배너 리스트 스키마 - 배열 형식 (전체)
export const commonBannerAdminArrayListSchema = z.object({
  commonBannerList: z.array(commonBannerAdminAllItemSchema),
});

export type CommonBannerAdminListItemType = z.infer<
  typeof commonBannerAdminListItemSchema
>;

export type CommonBannerAdminAllItemType = z.infer<
  typeof commonBannerAdminAllItemSchema
>;

export type bannerType =
  | 'MAIN'
  | 'PROGRAM'
  | 'LINE'
  | 'POPUP'
  | 'MAIN_BOTTOM'
  | 'COMMON';

export const getBnnerListForAdminQueryKey = (type: bannerType) => [
  'banner',
  'admin',
  type,
];

export const getCommonBannerForAdminQueryKey = () => [
  'banner',
  'admin',
  'common',
];

export const getActiveBannersForAdminQueryKey = () => [
  'banner',
  'admin',
  'common',
  'active',
];

export const useGetBannerListForAdmin = ({ type }: { type: bannerType }) => {
  return useQuery({
    queryKey: getBnnerListForAdminQueryKey(type),
    queryFn: async () => {
      const res = await axios('/banner/admin', {
        params: {
          type,
        },
      });
      return bannerAdminListSchema.parse(res.data.data);
    },
  });
};

// 전체 공통 배너 조회
export const useGetCommonBannerForAdmin = ({
  enabled,
}: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: getCommonBannerForAdminQueryKey(),
    queryFn: async () => {
      const res = await axios('/admin/common-banner', {});
      return commonBannerAdminArrayListSchema.parse(res.data.data);
    },
    enabled,
  });
};

// 노출 중인 공통 배너만 조회
export const useGetActiveBannersForAdmin = ({
  enabled,
}: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: getActiveBannersForAdminQueryKey(),
    queryFn: async () => {
      const res = await axios('/admin/common-banner/visible', {});
      return commonBannerAdminListSchema.parse(res.data.data);
    },
    enabled,
  });
};

export const bannerAdminDetailSchema = z.object({
  bannerAdminDetailVo: bannerAdminListItemSchema,
});

export const getBannerDetailForAdminQueryKey = (
  bannerId: number,
  type: bannerType,
) => ['banner', 'admin', 'detail', bannerId, type];

export const useGetBannerDetailForAdmin = ({
  bannerId,
  type,
}: {
  bannerId: number;
  type: bannerType;
}) => {
  return useQuery({
    queryKey: getBannerDetailForAdminQueryKey(bannerId, type),
    queryFn: async () => {
      const res = await axios(`/banner/admin/${bannerId}`, {
        params: {
          type,
        },
      });
      return bannerAdminDetailSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

export const usePostBannerForAdmin = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      type,
      formData,
    }: {
      type: bannerType;
      formData: FormData;
    }) => {
      const res = await axios.post(`/banner`, formData, {
        params: {
          type,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: res.data, type };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: getBnnerListForAdminQueryKey(data.type),
      });
      successCallback?.();
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });
};

export const useEditBannerForAdmin = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bannerId,
      type,
      formData,
    }: {
      bannerId: number;
      type: bannerType;
      formData: FormData;
    }) => {
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: res.data, bannerId, type };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: getBnnerListForAdminQueryKey(data.type),
      });
      queryClient.invalidateQueries({
        queryKey: getBannerDetailForAdminQueryKey(data.bannerId, data.type),
      });
      successCallback?.();
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });
};

export const useDeleteBannerForAdmin = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bannerId,
      type,
    }: {
      bannerId: number;
      type: bannerType;
    }) => {
      const res = await axios.delete(`/banner/${bannerId}`, {
        params: {
          type,
        },
      });
      return { data: res.data, bannerId, type };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: getBnnerListForAdminQueryKey(data.type),
      });
      queryClient.invalidateQueries({
        queryKey: getBannerDetailForAdminQueryKey(data.bannerId, data.type),
      });
      if (data.type === 'COMMON') {
        queryClient.invalidateQueries({
          queryKey: getCommonBannerForAdminQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getActiveBannersForAdminQueryKey(),
        });
      }
      successCallback?.();
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });
};

export const bannerUserListItemSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isValid: z.boolean().nullable().optional(),
  imgUrl: z.string().nullable().optional(),
  mobileImgUrl: z.string().nullable().optional(),
  contents: z.string().nullable().optional(),
  colorCode: z.string().nullable().optional(),
  textColorCode: z.string().nullable().optional(),
});

export type BannerUserListItemType = z.infer<typeof bannerUserListItemSchema>;

export const bannerUserListSchema = z.object({
  bannerList: z.array(bannerUserListItemSchema),
});

export const useGetBannerListForUser = ({ type }: { type: bannerType }) => {
  return useQuery({
    queryKey: ['banner', type],
    queryFn: async () => {
      const res = await axios('/banner', {
        params: {
          type,
        },
      });
      return bannerUserListSchema.parse(res.data.data);
    },
  });
};
