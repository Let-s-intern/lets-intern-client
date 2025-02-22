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

export type bannerType = 'MAIN' | 'PROGRAM' | 'LINE' | 'POPUP' | 'HOME_BOTTOM';

export const getBnnerListForAdminQueryKey = (type: bannerType) => [
  'banner',
  'admin',
  type,
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
      successCallback?.();
    },
    onError: (error) => {
      errorCallback?.(error);
    },
  });
};
