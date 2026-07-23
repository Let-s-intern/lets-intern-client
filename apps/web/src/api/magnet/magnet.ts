import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LaunchAlertResponse,
  MagnetType,
  MypageMagnetListResponse,
  ProgramType,
  UserMagnetDetailResponse,
  UserMagnetListResponse,
  UserMagnetQuestionListResponse,
  launchAlertResponseSchema,
  mypageMagnetListResponseSchema,
  userMagnetDetailResponseSchema,
  userMagnetListResponseSchema,
  userMagnetQuestionListResponseSchema,
} from './magnetSchema';

const userMagnetListQueryKey = 'UserMagnetListQueryKey';
const myMagnetListQueryKey = 'MyMagnetListQueryKey';
const mypageMagnetListQueryKey = 'MypageMagnetListQueryKey';
const userMagnetDetailQueryKey = 'UserMagnetDetailQueryKey';
const launchAlertQueryKey = 'LaunchAlertQueryKey';

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

// 서버용 마그넷 목록 조회
export async function fetchUserMagnetList(params?: {
  page?: number;
  size?: number;
  typeList?: MagnetType[];
}) {
  const res = await axios.get('/magnet', {
    params: {
      page: params?.page ?? 1,
      size: params?.size ?? 10,
      typeList: params?.typeList,
    },
  });
  return userMagnetListResponseSchema.parse(res.data.data);
}

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

export const userMagnetListQueryOptions = ({
  typeList,
  programTypeList,
  pageable,
}: Omit<UserMagnetListQueryParams, 'enabled'>) => ({
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
});

export const useGetUserMagnetListQuery = ({
  enabled,
  ...params
}: UserMagnetListQueryParams) => {
  return useQuery({
    ...userMagnetListQueryOptions(params),
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

export const myMagnetListQueryOptions = ({
  typeList,
  pageable,
}: Omit<MyMagnetListQueryParams, 'enabled'>) => ({
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
});

export const useGetMyMagnetListQuery = ({
  enabled,
  ...params
}: MyMagnetListQueryParams) => {
  return useQuery({
    ...myMagnetListQueryOptions(params),
    enabled,
  });
};

// 마그넷 신청 폼 조회
const userMagnetQuestionsQueryKey = 'UserMagnetQuestionsQueryKey';

export const useGetUserMagnetQuestionsQuery = (
  magnetId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [userMagnetQuestionsQueryKey, magnetId],
    queryFn: async (): Promise<UserMagnetQuestionListResponse> => {
      const res = await axios.get(`/magnet/${magnetId}/questions`);
      return userMagnetQuestionListResponseSchema.parse(res.data.data);
    },
    enabled: options?.enabled,
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
  // 메인 신청과 함께 묶음으로 신청되는 추가 마그넷이면 true.
  // 메인 마그넷일 경우 생략 (또는 false). BE 가 묶음 단위 후처리(예: 알림톡 dedupe)에 사용.
  isExtra?: boolean;
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

// 마그넷 신청취소 (출시알림 등)
export const useDeleteMagnetApplicationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (magnetId: number) => {
      const res = await axios.delete(`/magnet-application/${magnetId}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [mypageMagnetListQueryKey],
      });
    },
  });
};

// 마이페이지 MY 마그넷 신청현황 조회
export const mypageMagnetListQueryOptions = (typeList?: MagnetType[]) => ({
  queryKey: [mypageMagnetListQueryKey, typeList] as const,
  queryFn: async (): Promise<MypageMagnetListResponse> => {
    const res = await axios.get('/magnet/mypage', {
      params: { typeList },
    });
    return mypageMagnetListResponseSchema.parse(res.data.data);
  },
});

export const useGetMypageMagnetListQuery = ({
  typeList,
  enabled,
}: {
  typeList?: MagnetType[];
  enabled?: boolean;
}) => {
  return useQuery({
    ...mypageMagnetListQueryOptions(typeList),
    enabled,
  });
};
