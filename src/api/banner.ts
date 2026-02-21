import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { uploadFileForId } from './file';

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

const maybeUploadCommonBanner = (file: File | null): Promise<number | null> =>
  file ? uploadFileForId({ file, type: 'COMMON_BANNER' }) : Promise.resolve(null);

export type CommonBannerDetailInfo = {
  type: CommonBannerType;
  agentType: 'PC' | 'MOBILE';
  fileId: number;
  commonBannerDetailId?: number;
  fileUrl?: string;
};

export type CommonBannerDetailResponse = {
  commonBanner: {
    commonBannerId: number;
    title: string;
    landingUrl: string;
    startDate: string;
    endDate: string;
    isVisible: boolean;
  };
  commonBannerDetailList: CommonBannerDetailInfo[];
};

export type CommonBannerFormValue = {
  title: string;
  landingUrl: string;
  isVisible: boolean;
  startDate: string;
  endDate: string;
  types: Record<CommonBannerType, boolean>;
  homePcFile: File | null;
  homeMobileFile: File | null;
  programPcFile: File | null;
  programMobileFile: File | null;
  // 수정 시 기존 fileId 보존용
  homePcFileId?: number | null;
  homeMobileFileId?: number | null;
  programPcFileId?: number | null;
  programMobileFileId?: number | null;
  // 수정 시 기존 이미지 미리보기용
  homePcFileUrl?: string | null;
  homeMobileFileUrl?: string | null;
  programPcFileUrl?: string | null;
  programMobileFileUrl?: string | null;
};

export const usePostCommonBannerForAdmin = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: CommonBannerFormValue) => {
      const { types } = form;
      const needsHome = types.HOME_TOP || types.HOME_BOTTOM;
      const needsProgram = types.PROGRAM;
      const needsMyPage = types.MY_PAGE;

      // 필수 이미지 유효성 검사
      if (needsMyPage && !form.homeMobileFile) {
        throw new Error(
          '마이페이지 선택 시 홈 배너 (모바일) 이미지는 필수입니다.',
        );
      }
      if (needsMyPage && !form.programMobileFile) {
        throw new Error(
          '마이페이지 선택 시 프로그램 배너 (모바일) 이미지는 필수입니다.',
        );
      }

      // 필요한 파일만 병렬 업로드
      const [
        homePcFileId,
        homeMobileFileId,
        programPcFileId,
        programMobileFileId,
      ] = await Promise.all([
        needsHome ? maybeUploadCommonBanner(form.homePcFile) : Promise.resolve(null),
        needsHome || needsMyPage
          ? maybeUploadCommonBanner(form.homeMobileFile)
          : Promise.resolve(null),
        needsProgram ? maybeUploadCommonBanner(form.programPcFile) : Promise.resolve(null),
        needsProgram || needsMyPage
          ? maybeUploadCommonBanner(form.programMobileFile)
          : Promise.resolve(null),
      ]);

      // 선택된 위치별 PC/MOBILE 항목 생성
      const commonBannerDetailInfoList: {
        type: string;
        agentType: 'PC' | 'MOBILE';
        fileId: number;
      }[] = [];

      if (types.HOME_TOP) {
        if (homePcFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_TOP', agentType: 'PC', fileId: homePcFileId });
        if (homeMobileFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_TOP', agentType: 'MOBILE', fileId: homeMobileFileId });
      }

      if (types.HOME_BOTTOM) {
        if (homePcFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_BOTTOM', agentType: 'PC', fileId: homePcFileId });
        if (homeMobileFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_BOTTOM', agentType: 'MOBILE', fileId: homeMobileFileId });
      }

      if (types.PROGRAM) {
        if (programPcFileId)
          commonBannerDetailInfoList.push({ type: 'PROGRAM', agentType: 'PC', fileId: programPcFileId });
        if (programMobileFileId)
          commonBannerDetailInfoList.push({ type: 'PROGRAM', agentType: 'MOBILE', fileId: programMobileFileId });
      }

      if (types.MY_PAGE) {
        if (programMobileFileId)
          commonBannerDetailInfoList.push({ type: 'MY_PAGE', agentType: 'PC', fileId: programMobileFileId });
        if (homeMobileFileId)
          commonBannerDetailInfoList.push({ type: 'MY_PAGE', agentType: 'MOBILE', fileId: homeMobileFileId });
      }

      // 통합 배너 생성
      const res = await axios.post('/admin/common-banner', {
        commonBannerInfo: {
          title: form.title,
          landingUrl: form.landingUrl,
          startDate: form.startDate
            ? new Date(form.startDate).toISOString()
            : null,
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
          isVisible: form.isVisible,
        },
        commonBannerDetailInfoList,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCommonBannerForAdminQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getActiveBannersForAdminQueryKey(),
      });
      successCallback?.();
    },
    onError: (error: Error) => {
      errorCallback?.(error);
    },
  });
};

// 공통 배너 상세 조회
export const getCommonBannerDetailForAdminQueryKey = (
  commonBannerId: number,
) => ['banner', 'admin', 'common', 'detail', commonBannerId];

export const useGetCommonBannerDetailForAdmin = ({
  commonBannerId,
}: {
  commonBannerId: number;
}) => {
  return useQuery({
    queryKey: getCommonBannerDetailForAdminQueryKey(commonBannerId),
    queryFn: async () => {
      const res = await axios(`/admin/common-banner/${commonBannerId}`);
      return res.data.data as CommonBannerDetailResponse;
    },
    refetchOnWindowFocus: false,
  });
};

// 공통 배너 수정
export const useEditCommonBannerForAdmin = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commonBannerId,
      form,
    }: {
      commonBannerId: number;
      form: CommonBannerFormValue;
    }) => {
      const { types } = form;
      const needsHome = types.HOME_TOP || types.HOME_BOTTOM;
      const needsProgram = types.PROGRAM;
      const needsMyPage = types.MY_PAGE;

      // 새 파일이 있으면 업로드, 없으면 기존 fileId 유지
      const [
        homePcFileId,
        homeMobileFileId,
        programPcFileId,
        programMobileFileId,
      ] = await Promise.all([
        needsHome && form.homePcFile
          ? maybeUploadCommonBanner(form.homePcFile)
          : Promise.resolve(form.homePcFileId ?? null),
        (needsHome || needsMyPage) && form.homeMobileFile
          ? maybeUploadCommonBanner(form.homeMobileFile)
          : Promise.resolve(form.homeMobileFileId ?? null),
        needsProgram && form.programPcFile
          ? maybeUploadCommonBanner(form.programPcFile)
          : Promise.resolve(form.programPcFileId ?? null),
        (needsProgram || needsMyPage) && form.programMobileFile
          ? maybeUploadCommonBanner(form.programMobileFile)
          : Promise.resolve(form.programMobileFileId ?? null),
      ]);

      const commonBannerDetailInfoList: CommonBannerDetailInfo[] = [];

      if (types.HOME_TOP) {
        if (homePcFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_TOP', agentType: 'PC', fileId: homePcFileId });
        if (homeMobileFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_TOP', agentType: 'MOBILE', fileId: homeMobileFileId });
      }

      if (types.HOME_BOTTOM) {
        if (homePcFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_BOTTOM', agentType: 'PC', fileId: homePcFileId });
        if (homeMobileFileId)
          commonBannerDetailInfoList.push({ type: 'HOME_BOTTOM', agentType: 'MOBILE', fileId: homeMobileFileId });
      }

      if (types.PROGRAM) {
        if (programPcFileId)
          commonBannerDetailInfoList.push({ type: 'PROGRAM', agentType: 'PC', fileId: programPcFileId });
        if (programMobileFileId)
          commonBannerDetailInfoList.push({ type: 'PROGRAM', agentType: 'MOBILE', fileId: programMobileFileId });
      }

      if (types.MY_PAGE) {
        if (programMobileFileId)
          commonBannerDetailInfoList.push({ type: 'MY_PAGE', agentType: 'PC', fileId: programMobileFileId });
        if (homeMobileFileId)
          commonBannerDetailInfoList.push({ type: 'MY_PAGE', agentType: 'MOBILE', fileId: homeMobileFileId });
      }

      const res = await axios.patch(`/admin/common-banner/${commonBannerId}`, {
        commonBannerInfo: {
          title: form.title,
          landingUrl: form.landingUrl,
          startDate: form.startDate
            ? new Date(form.startDate).toISOString()
            : null,
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
          isVisible: form.isVisible,
        },
        commonBannerDetailInfoList,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCommonBannerForAdminQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getActiveBannersForAdminQueryKey(),
      });
      successCallback?.();
    },
    onError: (error: Error) => {
      errorCallback?.(error);
    },
  });
};

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
