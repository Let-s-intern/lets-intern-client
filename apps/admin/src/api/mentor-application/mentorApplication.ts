import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminMentorApplicationDetailSchema,
  adminMentorApplicationListSchema,
  type MentorApplicationStatus,
} from './mentorApplicationSchema';

export const AdminMentorApplicationListQueryKey =
  'adminMentorApplicationListQuery';
export const AdminMentorApplicationDetailQueryKey =
  'adminMentorApplicationDetailQuery';

/** GET 멘토 합류 신청 목록 /api/v1/admin/mentor-application */
export const useAdminMentorApplicationListQuery = () => {
  return useQuery({
    queryKey: [AdminMentorApplicationListQueryKey],
    queryFn: async () => {
      const res = await axios.get('/admin/mentor-application');
      return adminMentorApplicationListSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

/** GET 멘토 합류 신청서 상세 /api/v1/admin/mentor-application/{id} */
export const useAdminMentorApplicationDetailQuery = (id: number) => {
  return useQuery({
    queryKey: [AdminMentorApplicationDetailQueryKey, id],
    queryFn: async () => {
      const res = await axios.get(`/admin/mentor-application/${id}`);
      return adminMentorApplicationDetailSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

/** PATCH 신청 상태 변경 /api/v1/admin/mentor-application/{id}/status */
export const usePatchAdminMentorApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: MentorApplicationStatus;
    }) => {
      return axios.patch(`/admin/mentor-application/${id}/status`, { status });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey[0] === AdminMentorApplicationListQueryKey ||
          queryKey[0] === AdminMentorApplicationDetailQueryKey,
      });
    },
  });
};

/** PATCH 운영 메모 저장 /api/v1/admin/mentor-application/{id}/memo */
export const usePatchAdminMentorApplicationMemo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, memo }: { id: number; memo: string }) => {
      return axios.patch(`/admin/mentor-application/${id}/memo`, { memo });
    },
    // 다시 불러올 때까지 기다려야 저장 직후 입력값과 저장값이 어긋나지 않는다
    onSuccess: (_, { id }) => {
      return queryClient.invalidateQueries({
        queryKey: [AdminMentorApplicationDetailQueryKey, id],
      });
    },
  });
};

/** DELETE 신청서 삭제 /api/v1/admin/mentor-application/{id} */
export const useDeleteAdminMentorApplication = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`/admin/mentor-application/${id}`);
    },
  });
};
