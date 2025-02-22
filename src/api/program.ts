import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  challengeSchema,
  CreateChallengeReq,
  CreateLiveReq,
  CreateVodReq,
  faqSchema,
  getChallengeIdSchema,
  getLiveIdPrimitiveSchema,
  getLiveIdSchema,
  getVodIdSchema,
  LiveIdPrimitive,
  liveTitleSchema,
  programAdminSchema,
  programBannerAdminDetailSchema,
  programBannerAdminListSchema,
  programBannerUserListSchema,
  ProgramClassification,
  programRecommendSchema,
  programSchema,
  ProgramStatus,
  ProgramTypeUpperCase,
  UpdateChallengeReq,
  UpdateLiveReq,
  UpdateVodReq,
} from '../schema';
import { IPageable } from '../types/interface';
import axios from '../utils/axios';

export const useProgramQuery = ({
  programId,
  type,
}: {
  type: 'live' | 'vod' | 'challenge';
  programId: number;
}) => {
  const liveQuery = useGetLiveQuery({
    liveId: programId,
    enabled: type === 'live',
  });

  const challengeQuery = useGetChallengeQuery({
    challengeId: programId,
    enabled: type === 'challenge',
  });

  switch (type) {
    case 'live':
      return {
        type: 'live' as const,
        query: liveQuery,
      };
    case 'vod':
      throw new Error('Not implemented');
    case 'challenge':
      return {
        type: 'challenge' as const,
        query: challengeQuery,
      };
  }
};

export type ProgramQuery = ReturnType<typeof useProgramQuery>;

export const useUserProgramQuery = ({
  pageable,
  searchParams,
}: {
  pageable: IPageable;
  searchParams: URLSearchParams;
}) => {
  return useQuery({
    queryKey: [useUserProgramQuery, pageable.page, searchParams.toString()],
    queryFn: async () => {
      const pageableQuery = Object.entries({
        ...pageable,
      })?.map(([key, value]) => `${key}=${value}`);

      const res = await axios.get(
        `/program?${pageableQuery.join('&')}&${searchParams.toString()}`,
      );

      return programSchema.parse(res.data.data);
    },
  });
};

export const useGetProgramAdminQueryKey = 'useGetProgramAdminQueryKey';

export const useGetProgramAdminQuery = (params: {
  type?: ProgramTypeUpperCase;
  classification?: ProgramClassification;
  status?: ProgramStatus[];
  startDate?: string;
  endDate?: string;
  page: number | string;
  size: number | string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [useGetProgramAdminQueryKey, params],
    queryFn: async () => {
      const res = await axios.get(`/program/admin`, {
        params: { ...params, status: params.status?.join(',') },
      });
      return programAdminSchema.parse(res.data.data);
    },
    enabled: params.enabled,
  });
};

export const useGetProgramRecommend = () => {
  return useQuery({
    queryKey: ['useGetProgramRecommend'],
    queryFn: async () => {
      const res = await axios.get(`/program/recommend`);
      return programRecommendSchema.parse(res.data.data);
    },
  });
};

export const useGetChallengeListQuery = ({
  pageable,
  enabled = true,
}: {
  pageable: IPageable;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['useGetChallengeListQuery'],
    queryFn: async () => {
      const res = await axios.get('/challenge', { params: pageable });
      return challengeSchema.parse(res.data.data);
    },
  });
};

export const useGetChallengeQueryKey = 'challenge';

export const useGetChallengeQuery = ({
  challengeId,
  enabled,
  refetchOnWindowFocus = true,
}: {
  challengeId: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    enabled,
    refetchOnWindowFocus,
    queryKey: [useGetChallengeQueryKey, challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdSchema.parse(res.data.data);
    },
  });
};

/** 1회용으로 사용하기 위한 함수 */
export const getChallenge = async (challengeId: number) => {
  const res = await axios.get(`/challenge/${challengeId}`);
  return getChallengeIdSchema.parse(res.data.data);
};

export const usePostChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateChallengeReq) => {
      const res = await axios.post(`/challenge`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateChallengeReq & { challengeId: number }) => {
      const { challengeId, ...rest } = data;
      const res = await axios.patch(`/challenge/${challengeId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteChallengeMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (challengeId: number) => {
      const res = await axios.delete(`/challenge/${challengeId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetLiveQueryKey = 'useGetLiveQueryKey';

export const useGetLiveQuery = ({
  liveId,
  enabled,
}: {
  liveId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetLiveQueryKey, liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}`);
      return getLiveIdSchema.parse(res.data.data);
    },
  });
};

export const fetchLiveData = async (
  liveId: string,
): Promise<LiveIdPrimitive> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/live/${liveId}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch live data');
  }

  const data = await res.json();
  return getLiveIdPrimitiveSchema.parse(data.data);
};

/** 1회용으로 사용하기 위한 함수 */
export const getLive = async (liveId: number) => {
  const res = await axios.get(`/live/${liveId}`);
  return getLiveIdSchema.parse(res.data.data);
};

export const usePostLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateLiveReq) => {
      const res = await axios.post(`/live`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateLiveReq & { liveId: number }) => {
      const { liveId, ...rest } = data;
      const res = await axios.patch(`/live/${liveId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteLiveMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (liveId: number) => {
      const res = await axios.delete(`/live/${liveId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetLiveFaq = (liveId: number | string) => {
  return useQuery({
    queryKey: ['useGetLiveFaq', liveId],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/faqs`);
      return faqSchema.parse(res.data.data);
    },
  });
};

export const useGetVodQueryKey = 'useGetVodQueryKey';

export const useGetVodQuery = ({
  vodId,
  enabled,
}: {
  vodId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useGetVodQueryKey, vodId],
    queryFn: async () => {
      const res = await axios.get(`/vod/${vodId}`);
      return getVodIdSchema.parse(res.data.data);
    },
  });
};

/** 1회용으로 사용하기 위한 함수 */
export const getVod = async (vodId: number) => {
  const res = await axios.get(`/vod/${vodId}`);
  return getVodIdSchema.parse(res.data.data);
};

export const usePostVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: CreateVodReq) => {
      const res = await axios.post(`/vod`, data);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const usePatchVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: UpdateVodReq & { vodId: number }) => {
      const { vodId, ...rest } = data;
      const res = await axios.patch(`/vod/${vodId}`, rest);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useDeleteVodMutation = ({
  errorCallback,
  successCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (vodId: number) => {
      const res = await axios.delete(`/vod/${vodId}`);
      return res.data as unknown;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
};

export const useGetLiveTitle = (liveId: number | string) => {
  return useQuery({
    queryKey: [liveId, 'useGetLiveTitle'],
    queryFn: async () => {
      const res = await axios.get(`/live/${liveId}/title`);
      return liveTitleSchema.parse(res.data.data);
    },
  });
};

// 프로그램 배너 목록 조회
const getProgramBannerListQueryKey = ['useGetProgramBannerListQueryKey'];

export const useGetProgramBannerListQuery = () => {
  return useQuery({
    queryKey: getProgramBannerListQueryKey,
    queryFn: async () => {
      const res = await axios.get('/banner/admin', {
        params: {
          type: 'PROGRAM',
        },
      });
      return programBannerAdminListSchema.parse(res.data.data);
    },
  });
};

// 유저단 프로그램 배너 목록 조회
const getUserProgramBannerListQueryKey = [
  'useGetUserProgramBannerListQueryKey',
];

export const useGetUserProgramBannerListQuery = () => {
  return useQuery({
    queryKey: getUserProgramBannerListQueryKey,
    queryFn: async () => {
      const res = await axios.get('/banner', {
        params: {
          type: 'PROGRAM',
        },
      });
      return programBannerUserListSchema.parse(res.data.data);
    },
  });
};

// 프로그램 배너 상세 조회
export const getProgramBannerDetailQueryKey = (bannerId: number) => [
  'banner',
  'admin',
  bannerId,
];

export const useGetProgramBannerDetailQuery = (bannerId: number) => {
  return useQuery({
    queryKey: getProgramBannerDetailQueryKey(bannerId),
    queryFn: async () => {
      const res = await axios.get(`/banner/admin/${bannerId}`, {
        params: {
          type: 'PROGRAM',
        },
      });
      return programBannerAdminDetailSchema.parse(res.data.data);
    },
  });
};

// 프로그램 배너 등록
export const useCreateProgramBannerMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/banner', formData, {
        params: {
          type: 'PROGRAM',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...getProgramBannerListQueryKey],
      });
      return onSuccess && onSuccess();
    },
    onError: (error) => {
      return onError && onError(error);
    },
  });
};

// 프로그램 배너 수정
export const useEditProgramBannerMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bannerId,
      formData,
    }: {
      bannerId: number;
      formData: FormData;
    }) => {
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'PROGRAM',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: res.data, bannerId };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getProgramBannerDetailQueryKey(data.bannerId),
      });
      await queryClient.invalidateQueries({
        queryKey: getProgramBannerListQueryKey,
      });
      return onSuccess && onSuccess();
    },
    onError: (error) => {
      return onError && onError(error);
    },
  });
};

// 프로그램 배너 삭제
export const useDeleteProgramBannerMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bannerId: number) => {
      const res = await axios.delete(`/banner/${bannerId}`, {
        params: {
          type: 'PROGRAM',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...getProgramBannerListQueryKey],
      });
      return onSuccess && onSuccess();
    },
    onError: (error) => {
      return onError && onError(error);
    },
  });
};
