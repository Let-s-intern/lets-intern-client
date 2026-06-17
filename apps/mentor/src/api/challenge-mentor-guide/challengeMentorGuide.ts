/* eslint-disable no-console */

import axios from '@/utils/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  challengeMentorGuideListSchema,
  type CreateChallengeMentorGuideReq,
  type UpdateChallengeMentorGuideReq,
} from './challengeMentorGuideSchema';

export const ChallengeMentorGuideQueryKey = 'challengeMentorGuideList';

/** GET /api/v1/challenge-mentor-guide 멘토용 가이드 목록 (파라미터 없음) */
export const useMentorGuideListQuery = (options?: {
  refetchInterval?: number;
}) => {
  return useQuery({
    queryKey: [ChallengeMentorGuideQueryKey],
    queryFn: async () => {
      const res = await axios.get('/challenge-mentor-guide');
      return challengeMentorGuideListSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const AdminChallengeMentorGuideQueryKey =
  'adminChallengeMentorGuideList';

/** GET /api/v1/admin/challenge-mentor-guide 어드민용 전체 가이드 목록 */
export const useAdminChallengeMentorGuideAllQuery = () => {
  return useQuery({
    queryKey: [AdminChallengeMentorGuideQueryKey],
    queryFn: async () => {
      const res = await axios.get('/admin/challenge-mentor-guide');
      return challengeMentorGuideListSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

/** @deprecated Push 2에서 useAdminChallengeMentorGuideAllQuery로 교체 예정 */
export const useAdminChallengeMentorGuideListQuery = (
  challengeMentorId?: string | number,
) => {
  return useQuery({
    queryKey: [AdminChallengeMentorGuideQueryKey, challengeMentorId],
    queryFn: async () => {
      const res = await axios.get(
        `/admin/challenge-mentor-guide/${challengeMentorId}`,
      );
      return challengeMentorGuideListSchema.parse(res.data.data);
    },
    enabled: !!challengeMentorId,
    refetchOnWindowFocus: false,
  });
};

/** POST /api/v1/admin/challenge-mentor-guide 가이드 생성 */
export const usePostAdminChallengeMentorGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      body: CreateChallengeMentorGuideReq & { challengeMentorId?: number },
    ) => {
      const res = await axios.post('/admin/challenge-mentor-guide', body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AdminChallengeMentorGuideQueryKey],
      });
    },
    onError: (error) => {
      console.error(error);
      alert(`문제가 발생했습니다: ${error}`);
    },
  });
};

/** PATCH /api/v1/admin/challenge-mentor-guide/{challengeMentorGuideId} 가이드 수정 */
export const usePatchAdminChallengeMentorGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      challengeMentorGuideId,
      ...body
    }: UpdateChallengeMentorGuideReq & { challengeMentorGuideId: number }) => {
      const res = await axios.patch(
        `/admin/challenge-mentor-guide/${challengeMentorGuideId}`,
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AdminChallengeMentorGuideQueryKey],
      });
    },
    onError: (error) => {
      console.error(error);
      alert(`문제가 발생했습니다: ${error}`);
    },
  });
};

/** DELETE /api/v1/admin/challenge-mentor-guide/{challengeMentorGuideId} 가이드 삭제 */
export const useDeleteAdminChallengeMentorGuide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeMentorGuideId: number) => {
      return axios.delete(
        `/admin/challenge-mentor-guide/${challengeMentorGuideId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AdminChallengeMentorGuideQueryKey],
      });
    },
    onError: (error) => {
      console.error(error);
      alert(`문제가 발생했습니다: ${error}`);
    },
  });
};
