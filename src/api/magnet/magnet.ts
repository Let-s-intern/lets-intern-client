import {
  CreateMagnetReqBody,
  MagnetTypeKey,
} from '@/domain/admin/blog/magnet/types';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MagnetDetailResponse,
  MagnetListResponse,
  MagnetType,
  ProgramType,
  UserMagnetDetailResponse,
  UserMagnetListResponse,
  magnetDetailResponseSchema,
  magnetListResponseSchema,
  userMagnetDetailResponseSchema,
  userMagnetListResponseSchema,
} from './magnetSchema';

const magnetListQueryKey = 'MagnetListQueryKey';
const magnetDetailQueryKey = 'MagnetDetailQueryKey';
const userMagnetListQueryKey = 'UserMagnetListQueryKey';
const myMagnetListQueryKey = 'MyMagnetListQueryKey';

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
  title?: string;
  description?: string;
  previewContents?: string;
  mainContents?: string;
  desktopThumbnail?: string;
  mobileThumbnail?: string;
  startDate?: string | null;
  endDate?: string | null;
  isVisible?: boolean;
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
      await queryClient.invalidateQueries({ queryKey: [magnetListQueryKey] });
      successCallback?.();
    },
    onError: (error) => {
      console.error(error);
      errorCallback?.();
    },
  });
};

// 유저용 마그넷 상세 조회
const userMagnetDetailQueryKey = 'UserMagnetDetailQueryKey';

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
      const now = new Date().toISOString();
      const oneMonthLater = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const res = await axios.post('/admin/magnet', {
        type: body.type,
        title: body.title,
        description: '',
        previewContents: '',
        mainContents: '',
        desktopThumbnail: '',
        mobileThumbnail: '',
        startDate: now,
        endDate: oneMonthLater,
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
