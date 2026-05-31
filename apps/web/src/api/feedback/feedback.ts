import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  feedbackDetailSchema,
  feedbackSlotListSchema,
  liveFeedbackListSchema,
  mentorDetailSchema,
  writtenFeedbackListSchema,
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

/** GET /api/v1/challenge/{challengeId}/feedback/mentor/slot 멘토 피드백 슬롯 목록 조회 */
export const useFeedbackSlotListQuery = (
  challengeId?: number | string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['feedbackSlotList', challengeId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      const res = await axios.get(
        `/challenge/${challengeId}/feedback/mentor/slot?${params}`,
      );
      return feedbackSlotListSchema.parse(res.data.data);
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

/** GET /api/v1/challenge/{challengeId}/feedback/written 서면 피드백 목록 조회 */
export const useWrittenFeedbackListQuery = (challengeId?: number | string) => {
  return useQuery({
    queryKey: ['writtenFeedbackList', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/feedback/written`);
      return writtenFeedbackListSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};

/** PATCH /api/v1/feedback/{feedbackId} 라이브 피드백 후기 작성 */
export const usePatchFeedbackReview = (feedbackId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ score, review }: { score: number; review: string }) =>
      axios.patch(`/feedback/${feedbackId}`, { score, review }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedbackDetail', feedbackId],
      });
    },
  });
};

/** POST /api/v1/challenge/{challengeId}/{missionId}/feedback/{feedbackSlotId} LIVE 피드백 예약 */
export const usePostFeedbackReservation = (challengeId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      missionId,
      feedbackSlotId,
    }: {
      missionId: number;
      feedbackSlotId: number;
    }) =>
      axios.post(
        `/challenge/${challengeId}/${missionId}/feedback/${feedbackSlotId}`,
        { preQuestion: '' }, // BE에서 preQuestion 필드 제거 후 삭제
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['liveFeedbackList', challengeId],
      });
    },
  });
};
