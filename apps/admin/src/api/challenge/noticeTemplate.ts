import axios from '@/utils/axios';
import {
  AdminNoticeType,
  CreateAdminNoticeReq,
  UpdateAdminNoticeReq,
  adminNoticeDetailSchema,
  adminNoticeListSchema,
} from '@/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const QUERY_KEY = 'admin-notice';

export const useGetAdminNotices = (
  type?: AdminNoticeType,
  page = 0,
  size = 20,
) => {
  return useQuery({
    queryKey: [QUERY_KEY, type, page, size],
    queryFn: async () => {
      const res = await axios.get('/admin/notice', {
        params: { ...(type && { type }), page, size },
      });
      return adminNoticeListSchema.parse(res.data.data);
    },
  });
};

export const useGetAdminNoticeDetail = (id: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: async () => {
      const res = await axios.get(`/admin/notice/${id}`);
      return adminNoticeDetailSchema.parse(res.data.data);
    },
    enabled: id !== null,
  });
};

export const useCreateAdminNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateAdminNoticeReq) => {
      await axios.post('/admin/notice', req);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateAdminNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...req
    }: UpdateAdminNoticeReq & { id: number }) => {
      await axios.patch(`/admin/notice/${id}`, req);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export type NoticeChallengeItem = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  isVisible: boolean;
};

export const useGetNoticeChallenges = (noticeId: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'challenge', noticeId],
    queryFn: async () => {
      const res = await axios.get(`/admin/notice/${noticeId}/challenge`);
      return res.data.data as { challengeList: NoticeChallengeItem[] };
    },
    enabled: noticeId !== null,
  });
};

export const useUpdateNoticeChallengeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      noticeId,
      challengeIdList,
    }: {
      noticeId: number;
      challengeIdList: number[];
    }) => {
      await axios.patch(`/admin/notice/${noticeId}/challenge`, {
        challengeIdList,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteAdminNoticeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/admin/notice/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
