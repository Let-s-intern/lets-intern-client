import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
// ADMIN
export const curationLocationSchema = z.enum([
  'UNDER_BANNER',
  'UNDER_REVIEW',
  'UNDER_BLOG',
]);
export type CurationLocationType = z.infer<typeof curationLocationSchema>;
export const CurationLocationTypeValues = curationLocationSchema._def.values;

// ADMIN-SCHEMA
export const curationListItemSchema = z.object({
  curationId: z.number(),
  locationType: curationLocationSchema,
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isVisible: z.boolean(),
});

export type CurationListItemType = z.infer<typeof curationListItemSchema>;

export const curationListSchema = z.object({
  curationList: z.array(curationListItemSchema),
});

export const curationInfoSchema = z.object({
  curationId: z.number(),
  locationType: curationLocationSchema,
  title: z.string(),
  subTitle: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string(),
  listSize: z.number(),
  content: z.string().nullable().optional(),
  isVisible: z.boolean(),
});

export type CurationInfoType = z.infer<typeof curationInfoSchema>;

export const curationDetailSchema = z.object({
  curationInfo: curationInfoSchema,
});

export type CurationBodyType = {
  title: string;
  subTitle?: string;
  listSize: number;
  content?: string;
  startDate: string;
  endDate: string;
};

export type CurationEditBodyType = {
  title?: string;
  subTitle?: string;
  listSize?: number;
  content?: string;
  startDate?: string;
  endDate?: string;
  locationType?: CurationLocationType;
  isVisible?: boolean;
};

export const curationTypeSchema = z.enum([
  'CHALLENGE',
  'LIVE',
  'VOD',
  'REPORT',
  'BLOG',
  'ETC',
]);
export type CurationType = z.infer<typeof curationTypeSchema>;
export const CurationTypeValues = curationTypeSchema._def.values;

export type CurationItemType = {
  id: number;
  curationType: CurationType;
  itemId?: number;
  thumbnail?: string;
  title?: string;
  url?: string;
};

// ADMIN-API
export const useGetAdminCurationList = (
  locationType?: CurationLocationType,
) => {
  return useQuery({
    queryKey: ['admin-curation', 'list', locationType],
    queryFn: async () => {
      const res = await axios.get(`/admin/curation`, {
        params: {
          locationType,
        },
      });
      return curationListSchema.parse(res.data.data);
    },
  });
};

export const useGetAdminCurationDetail = (id: number) => {
  return useQuery({
    queryKey: ['admin-curation', 'detail', id],
    queryFn: async () => {
      const res = await axios.get(`/admin/curation/${id}`);
      return curationDetailSchema.parse(res.data.data);
    },
  });
};

export const usePostAdminCuration = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      locationType,
      body,
    }: {
      locationType: CurationLocationType;
      body: CurationBodyType;
    }) => {
      const res = await axios.post(`/admin/curation/${locationType}`, body);
      return res.data;
    },
    // curation, admin-curation를 포함하는 쿼리키 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey.includes('curation') ||
            query.queryKey.includes('admin-curation')
          );
        },
      });
      successCallback?.();
    },
    onError: () => {
      errorCallback?.();
    },
  });
};

export const usePatchAdminCuration = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: CurationEditBodyType;
    }) => {
      const res = await axios.patch(`/admin/curation/${id}`, body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey.includes('curation') ||
            query.queryKey.includes('admin-curation')
          );
        },
      });
      successCallback?.();
    },
    onError: () => {
      errorCallback?.();
    },
  });
};

export const useDeleteAdminCuration = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/admin/curation/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey.includes('curation') ||
            query.queryKey.includes('admin-curation')
          );
        },
      });
      successCallback?.();
    },
    onError: () => {
      errorCallback?.();
    },
  });
};

// USER
