import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ADMIN_LIVE_MENTORING_QUERY_KEY } from './liveMentoring';
import {
  adminLiveMentoringDetailPageSchema,
  type AdminLiveMentoringDetailPageUpdate,
} from './liveMentoringDetailPageSchema';

const detailPagePath = (mentorId: number) =>
  `/admin/live-mentoring/mentors/${mentorId}/detail-page`;

export const adminLiveMentoringDetailPageQueryKey = (mentorId: number) =>
  ['adminLiveMentoring', 'detailPage', mentorId] as const;

/** GET /admin/live-mentoring/mentors/{mentorId}/detail-page — 멘토의 1:1 상세페이지 */
export const useAdminLiveMentoringDetailPageQuery = (mentorId: number) =>
  useQuery({
    queryKey: adminLiveMentoringDetailPageQueryKey(mentorId),
    queryFn: async () => {
      const res = await axios.get(detailPagePath(mentorId));
      return adminLiveMentoringDetailPageSchema.parse(res.data.data);
    },
    enabled: mentorId > 0,
    refetchOnWindowFocus: false,
    // 멘토가 아닌 id 같은 4xx 는 다시 불러도 같다
    retry: (failureCount, error) => {
      const status = (error as { status?: number } | null)?.status;
      if (status != null && status >= 400 && status < 500) return false;
      return failureCount < 3;
    },
  });

/**
 * PUT /admin/live-mentoring/mentors/{mentorId}/detail-page — 전체 교체 저장.
 * 다른 곳(멘토 앱 등)에서 먼저 저장했으면 서버가 409 를 돌려준다.
 */
export const useUpdateAdminLiveMentoringDetailPageMutation = (
  mentorId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: AdminLiveMentoringDetailPageUpdate) => {
      const res = await axios.put(detailPagePath(mentorId), body);
      return adminLiveMentoringDetailPageSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminLiveMentoringDetailPageQueryKey(mentorId),
      });
      // 상품 목록의 「상세 있음/없음」 이 바뀔 수 있다
      queryClient.invalidateQueries({
        queryKey: ADMIN_LIVE_MENTORING_QUERY_KEY,
      });
    },
  });
};
