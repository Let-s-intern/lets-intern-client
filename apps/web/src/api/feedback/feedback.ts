import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import {
  feedbackDetailSchema,
  liveFeedbackListSchema,
  mentorDetailSchema,
} from './feedbackSchema';

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

/** GET /api/v1/challenge/{challengeId}/feedback/mentor 나의 멘토 상세 조회 */
export const useMentorDetailQuery = (challengeId?: number | string) => {
  return useQuery({
    queryKey: ['feedbackMentor', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/feedback/mentor`);
      return mentorDetailSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};

/** GET /api/v1/feedback/{feedbackId} 피드백 상세 조회 */
export const useFeedbackDetailQuery = (feedbackId?: number | null) => {
  return useQuery({
    queryKey: ['feedbackDetail', feedbackId],
    queryFn: async () => {
      const res = await axios.get(`/feedback/${feedbackId}`);
      return feedbackDetailSchema.parse(res.data.data);
    },
    enabled: !!feedbackId,
  });
};
