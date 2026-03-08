import {
  CreateMagnetReqBody,
  MagnetTypeKey,
} from '@/domain/admin/blog/magnet/types';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BaseQuestionListResponse,
  MagnetDetailResponse,
  MagnetListResponse,
  baseQuestionListResponseSchema,
  magnetDetailResponseSchema,
  magnetListResponseSchema,
} from './magnetSchema';

const magnetListQueryKey = 'MagnetListQueryKey';
const magnetDetailQueryKey = 'MagnetDetailQueryKey';
const baseQuestionQueryKey = 'BaseQuestionQueryKey';

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
      const now = new Date().toISOString();
      const oneMonthLater = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
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
