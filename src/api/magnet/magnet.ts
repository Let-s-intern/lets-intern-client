import {
  CreateMagnetReqBody,
  MagnetTypeKey,
} from '@/domain/admin/blog/magnet/types';
import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MagnetDetailResponse,
  MagnetListResponse,
  magnetDetailResponseSchema,
  magnetListResponseSchema,
} from './magnetSchema';

const magnetListQueryKey = 'MagnetListQueryKey';
const magnetDetailQueryKey = 'MagnetDetailQueryKey';

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

export const useGetMagnetDetailQuery = (magnetId: number) => {
  return useQuery(magnetDetailQueryOptions(magnetId));
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
