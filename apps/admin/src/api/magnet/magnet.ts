import {
  CreateMagnetReqBody,
  MagnetTypeKey,
} from '@/domain/admin/magnet/types';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BaseQuestionListResponse,
  LaunchAlertResponse,
  MagnetDetailResponse,
  MagnetListResponse,
  MagnetType,
  MypageMagnetListResponse,
  ProgramType,
  UserMagnetDetailResponse,
  UserMagnetListResponse,
  baseQuestionListResponseSchema,
  launchAlertResponseSchema,
  magnetDetailResponseSchema,
  magnetListResponseSchema,
  mypageMagnetListResponseSchema,
  userMagnetDetailResponseSchema,
  userMagnetListResponseSchema,
} from './magnetSchema';

const magnetListQueryKey = 'MagnetListQueryKey';
const magnetDetailQueryKey = 'MagnetDetailQueryKey';
const userMagnetListQueryKey = 'UserMagnetListQueryKey';
const myMagnetListQueryKey = 'MyMagnetListQueryKey';
const baseQuestionQueryKey = 'BaseQuestionQueryKey';

/** 마그넷 생성 시 노출 종료일 기본값 — 시작일로부터 30일 후 */
const DEFAULT_VISIBILITY_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const mypageMagnetListQueryKey = 'MypageMagnetListQueryKey';
const userMagnetDetailQueryKey = 'UserMagnetDetailQueryKey';
const launchAlertQueryKey = 'LaunchAlertQueryKey';

export interface MagnetListQueryParams {
  typeList?: MagnetTypeKey[];
  keyword?: string;
}

export const useGetMagnetListQuery = (params: MagnetListQueryParams = {}) => {
  return useQuery({
    queryKey: [magnetListQueryKey, params.typeList, params.keyword],
    queryFn: async (): Promise<MagnetListResponse> => {
      const res = await axios.get('/admin/magnet', {
        params: {
          typeList: params.typeList,
          keyword: params.keyword || undefined,
        },
      });
      return magnetListResponseSchema.parse(res.data.data);
    },
  });
};

export const useDeleteMagnetMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (magnetId: number) => {
      const res = await axios.delete(`/admin/magnet/${magnetId}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [magnetListQueryKey] });
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};

export const usePatchMagnetVisibilityMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      magnetId,
      isVisible,
    }: {
      magnetId: number;
      isVisible: boolean;
    }) => {
      const res = await axios.patch(`/admin/magnet/${magnetId}`, {
        isVisible,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [magnetListQueryKey] });
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};

/** 접속 가능 여부(목록 노출과 독립) 토글 — 링크 접속·신청 게이트 */
export const usePatchMagnetAccessibilityMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      magnetId,
      isAccessible,
    }: {
      magnetId: number;
      isAccessible: boolean;
    }) => {
      const res = await axios.patch(`/admin/magnet/${magnetId}`, {
        isAccessible,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [magnetListQueryKey] });
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};

export const magnetDetailQueryOptions = (magnetId: number) => ({
  queryKey: [magnetDetailQueryKey, magnetId],
  queryFn: async (): Promise<MagnetDetailResponse> => {
    const res = await axios.get(`/admin/magnet/${magnetId}`);
    return magnetDetailResponseSchema.parse(res.data.data);
  },
});

export const useGetMagnetDetailQuery = (
  magnetId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...magnetDetailQueryOptions(magnetId),
    enabled: options?.enabled,
  });
};

export interface PatchMagnetReqBody {
  magnetId: number;
  type?: string;
  programType?: string | null;
  challengeType?: string | null;
  title?: string;
  description?: string;
  previewContents?: string;
  mainContents?: string;
  desktopThumbnail?: string;
  mobileThumbnail?: string;
  useBaseQuestion?: boolean;
  useLaunchAlert?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  isVisible?: boolean;
  isAccessible?: boolean;
  magnetQuestionList?: unknown[];
}

export const usePatchMagnetMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ magnetId, ...body }: PatchMagnetReqBody) => {
      const res = await axios.patch(`/admin/magnet/${magnetId}`, body);
      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [magnetListQueryKey] }),
        queryClient.invalidateQueries({ queryKey: [magnetDetailQueryKey] }),
      ]);
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};

// 출시알림 마그넷 조회
export interface LaunchAlertQueryParams {
  programTypeList?: string[];
  challengeTypeList?: string[];
  enabled?: boolean;
}

export const useGetLaunchAlertQuery = ({
  programTypeList,
  challengeTypeList,
  enabled,
}: LaunchAlertQueryParams) => {
  return useQuery({
    queryKey: [launchAlertQueryKey, programTypeList, challengeTypeList],
    queryFn: async (): Promise<LaunchAlertResponse> => {
      const res = await axios.get('/magnet/launch-alert', {
        params: {
          programTypeList,
          challengeTypeList,
        },
      });
      return launchAlertResponseSchema.parse(res.data.data);
    },
    enabled,
    retry: false,
  });
};


// 유저용 마그넷 상세 조회
export const userMagnetDetailQueryOptions = (magnetId: number) => ({
  queryKey: [userMagnetDetailQueryKey, magnetId],
  queryFn: async (): Promise<UserMagnetDetailResponse> => {
    const res = await axios.get(`/magnet/${magnetId}`);
    return userMagnetDetailResponseSchema.parse(res.data.data);
  },
});

export const useGetUserMagnetDetailQuery = (
  magnetId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...userMagnetDetailQueryOptions(magnetId),
    enabled: options?.enabled,
  });
};

// 마그넷 목록 조회
export interface UserMagnetListQueryParams {
  typeList?: MagnetType[];
  programTypeList?: ProgramType[];
  pageable: {
    page: number;
    size: number;
    sort?: string[];
  };
  enabled?: boolean;
}

export const useGetUserMagnetListQuery = ({
  typeList,
  programTypeList,
  pageable,
  enabled,
}: UserMagnetListQueryParams) => {
  return useQuery({
    queryKey: [userMagnetListQueryKey, typeList, programTypeList, pageable],
    queryFn: async (): Promise<UserMagnetListResponse> => {
      const res = await axios.get('/magnet', {
        params: {
          typeList,
          programTypeList,
          page: pageable.page,
          size: pageable.size,
          sort: pageable.sort,
        },
      });
      return userMagnetListResponseSchema.parse(res.data.data);
    },
    enabled,
  });
};

// MY 마그넷 목록 조회
export interface MyMagnetListQueryParams {
  typeList?: MagnetType[];
  pageable: {
    page: number;
    size: number;
    sort?: string[];
  };
  enabled?: boolean;
}

export const useGetMyMagnetListQuery = ({
  typeList,
  pageable,
  enabled,
}: MyMagnetListQueryParams) => {
  return useQuery({
    queryKey: [myMagnetListQueryKey, typeList, pageable],
    queryFn: async (): Promise<UserMagnetListResponse> => {
      const res = await axios.get('/magnet/my', {
        params: {
          typeList,
          page: pageable.page,
          size: pageable.size,
          sort: pageable.sort,
        },
      });
      return userMagnetListResponseSchema.parse(res.data.data);
    },
    enabled,
  });
};


// 마그넷 조회일 기록
export const usePatchMagnetViewDateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (magnetId: number) => {
      const res = await axios.patch(
        `/magnet-application/${magnetId}/view-date`,
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [userMagnetDetailQueryKey],
      });
    },
  });
};

// 마그넷 좋아요
export const useMagnetLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (magnetId: number | string) => {
      const res = await axios.get(`/magnet/${magnetId}/likes`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [userMagnetDetailQueryKey],
      });
    },
  });
};

// 마그넷 신청
export interface MagnetApplicationReqBody {
  magnetAnswerList: {
    magnetQuestionId: number;
    answer: string;
  }[];
}

export const usePostMagnetApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      magnetId,
      body,
    }: {
      magnetId: number;
      body: MagnetApplicationReqBody;
    }) => {
      const res = await axios.post(`/magnet-application/${magnetId}`, body);
      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [userMagnetDetailQueryKey],
        }),
        queryClient.invalidateQueries({
          queryKey: [userMagnetListQueryKey],
        }),
        queryClient.invalidateQueries({
          queryKey: [launchAlertQueryKey],
        }),
      ]);
    },
  });
};

// 마이페이지 MY 마그넷 신청현황 조회
export const useGetMypageMagnetListQuery = ({
  typeList,
  enabled,
}: {
  typeList?: MagnetType[];
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [mypageMagnetListQueryKey, typeList],
    queryFn: async (): Promise<MypageMagnetListResponse> => {
      const res = await axios.get('/magnet/mypage', {
        params: { typeList },
      });
      return mypageMagnetListResponseSchema.parse(res.data.data);
    },
    enabled,
  });
};

// --- Magnet Question API ---

export interface MagnetQuestionReqBody {
  type: string;
  question: string;
  description: string;
  isRequired: boolean;
  answerType: 'CHOICE' | 'TEXT';
  choiceType: 'SINGLE' | 'MULTIPLE';
  options: string | null;
}

export interface PatchMagnetQuestionReqBody {
  question: string;
  description: string;
  isRequired: boolean;
  answerType: 'CHOICE' | 'TEXT';
  choiceType: 'SINGLE' | 'MULTIPLE';
  options: string | null;
  isVisible: boolean;
}

export const useCreateMagnetMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateMagnetReqBody) => {
      // BE 가 startDate/endDate non-null 을 요구하므로, 호출자가 미지정 시에만 default 를 채운다.
      const defaultStart = new Date().toISOString();
      const defaultEnd = new Date(
        Date.now() + DEFAULT_VISIBILITY_DURATION_MS,
      ).toISOString();
      const res = await axios.post('/admin/magnet', {
        type: body.type,
        programType: body.programType ?? null,
        challengeType: body.challengeType ?? null,
        title: body.title,
        description: '',
        previewContents: '',
        mainContents: '',
        desktopThumbnail: '',
        mobileThumbnail: '',
        useBaseQuestion: false,
        useLaunchAlert: false,
        startDate: body.startDate ?? defaultStart,
        endDate: body.endDate ?? defaultEnd,
        magnetQuestionList: [],
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [magnetListQueryKey] });
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};

// --- Base (Common) Question API ---

export const useGetBaseQuestionsQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [baseQuestionQueryKey],
    queryFn: async (): Promise<BaseQuestionListResponse> => {
      const res = await axios.get('/admin/magnet-question/base', {
        params: { isVisible: true },
      });
      return baseQuestionListResponseSchema.parse(res.data.data);
    },
    enabled: options?.enabled,
  });
};

export const useCreateBaseQuestionMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: MagnetQuestionReqBody) => {
      const res = await axios.post('/admin/magnet-question/base', {
        ...body,
        isVisible: true,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [baseQuestionQueryKey],
      });
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};

export const usePatchMagnetQuestionMutation = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      magnetQuestionId,
      ...body
    }: PatchMagnetQuestionReqBody & { magnetQuestionId: number }) => {
      const res = await axios.patch(
        `/admin/magnet-question/${magnetQuestionId}`,
        body,
      );
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [baseQuestionQueryKey],
      });
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};
