import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { client } from '@/utils/client';
import {
  ChallengeIdSchema,
  CreateChallengeReq,
  CreateLiveReq,
  CreateVodReq,
  faqSchema,
  getChallengeIdPrimitiveSchema,
  getChallengeIdSchema,
  getLiveIdPrimitiveSchema,
  getLiveIdSchema,
  getVodIdSchema,
  LiveIdPrimitive,
  LiveIdSchema,
  liveListResponseSchema,
  liveTitleSchema,
  Program,
  programAdminSchema,
  programBannerAdminDetailSchema,
  programBannerAdminListSchema,
  programBannerUserListSchema,
  ProgramClassification,
  ProgramRecommend,
  programRecommendSchema,
  programSchema,
  ProgramStatus,
  ProgramStatusEnum,
  ProgramTypeEnum,
  ProgramTypeUpperCase,
  UpdateChallengeReq,
  UpdateLiveReq,
  UpdateVodReq,
  VodIdSchema,
  vodListResponseSchema,
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
    enabled: type === 'live' && programId !== -1,
  });

  const challengeQuery = useGetChallengeQuery({
    challengeId: programId,
    enabled: type === 'challenge' && programId !== -1,
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

export const useGetUserProgramQuery = ({
  pageable,
  searchParams,
}: {
  pageable: IPageable;
  searchParams: {
    type?: ProgramTypeUpperCase;
    status?: ProgramStatus[];
    classification?: ProgramClassification[];
    startDate?: string;
    endDate?: string;
  };
}) => {
  return useQuery({
    queryKey: [useGetProgramAdminQueryKey, pageable, searchParams],
    queryFn: async () => {
      const res = await axios.get(`/program`, {
        params: {
          status: searchParams.status?.join(','),
          classification: searchParams.classification?.join(','),
          type: searchParams.type,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          ...pageable,
        },
      });

      return programSchema.parse(res.data.data);
    },
  });
};

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

/** 챌린지 상세 조회 */
export const useChallengeQuery = (challengeId?: string | number) => {
  return useQuery({
    queryKey: ['useChallengeQuery', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdPrimitiveSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
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

export const useGetLiveListQuery = ({
  typeList,
  statusList,
  pageable,
  enabled = true,
}: {
  typeList?: ProgramClassification[];
  statusList?: ProgramStatus[];
  pageable: IPageable;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['live', 'list', typeList, statusList, pageable],
    queryFn: async () => {
      const res = await axios.get('/live', {
        params: {
          typeList: typeList?.join(','),
          statusList: statusList?.join(','),
          ...pageable,
        },
      });
      return liveListResponseSchema.parse(res.data.data);
    },
  });
};

export const useGetVodListQuery = ({
  type,
  pageable,
}: {
  type?: ProgramClassification;
  pageable: IPageable;
}) => {
  return useQuery({
    queryKey: ['vod', 'list', type, pageable],
    queryFn: async () => {
      const res = await axios.get('/vod', {
        params: {
          type,
          ...pageable,
        },
      });
      return vodListResponseSchema.parse(res.data.data);
    },
  });
};

export const fetchChallenge = async (
  id: string | number,
): Promise<ChallengeIdSchema> => {
  const data = await client<ChallengeIdSchema>(`/v1/challenge/${id}`, {
    method: 'GET',
  });
  return getChallengeIdSchema.parse(data);
};

export const fetchVod = async (id: string | number): Promise<VodIdSchema> => {
  const data = await client<VodIdSchema>(`/v1/vod/${id}`, {
    method: 'GET',
  });
  return getVodIdSchema.parse(data);
};

export const fetchLive = async (id: string | number): Promise<LiveIdSchema> => {
  const data = await client<LiveIdSchema>(`/v1/live/${id}`, {
    method: 'GET',
  });
  return getLiveIdSchema.parse(data);
};

export const fetchProgram = async (params: {
  type?: ProgramTypeUpperCase[];
  classification?: ProgramClassification[];
  status?: ProgramStatus[];
  startDate?: string;
  endDate?: string;
  page: number | string;
  size: number | string;
}): Promise<Program> => {
  const data = await client<Program>('/v1/program', {
    method: 'GET',
    params: {
      ...params,
      type: params.type?.join(',') ?? '',
      classification: params.classification?.join(',') ?? '',
      status: params.status?.join(',') ?? '',
      page: String(params.page),
      size: String(params.size),
    },
  });

  return programSchema.parse(data);
};

export const getChallengeByKeyword = async (keyword: string) => {
  // 챌린지 가져오기
  const programs = await fetchProgram({
    page: 1,
    size: 10,
    type: [ProgramTypeEnum.enum.CHALLENGE],
    status: [ProgramStatusEnum.enum.PROCEEDING],
  });

  const filtered = programs.programList.filter((item) =>
    item.programInfo.title?.includes(keyword),
  );

  if (filtered.length === 0) return undefined;

  // 모집 마감일 제일 빠른 챌린지 찾기
  filtered.sort(
    (a, b) =>
      new Date(a.programInfo.deadline ?? '').getTime() -
      new Date(b.programInfo.deadline ?? '').getTime(),
  );

  return filtered[0];
};

export const fetchProgramRecommend = async () => {
  const data = await client<ProgramRecommend>('/v1/program/recommend', {
    method: 'GET',
  });
  return programRecommendSchema.parse(data);
};
