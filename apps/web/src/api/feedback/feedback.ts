import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { liveFeedbackListSchema } from './feedbackSchema';

/** GET /api/v1/challenge/{challengeId}/feedback/live 라이브 피드백 목록 조회 */
export const useLiveFeedbackListQuery = (challengeId?: number | string) => {
  return useQuery({
    queryKey: ['liveFeedbackList', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/feedback/live`);
      return liveFeedbackListSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};
