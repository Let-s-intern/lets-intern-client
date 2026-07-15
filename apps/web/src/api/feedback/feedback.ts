import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type FeedbackAttendanceStatus,
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

/**
 * 라이브 입장 전용 상세 조회.
 *
 * 입장 화면용 추가 필드(programTitle/미션회차/상대방 이름/myRole 등)는 BE 미정이라
 * 현재는 기본 상세(GET /feedback/{id})를 그대로 사용한다. BE 가 entry 전용 엔드포인트를
 * 확정하면 이 별칭만 교체한다.
 */
// TODO(BE): GET /feedback/{id}/entry 확정 시 entry 전용 쿼리로 교체.
export const useLiveFeedbackEntryQuery = useFeedbackDetailQuery;

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

/** PATCH /api/v1/feedback/{feedbackId}/meeting-url 회의실 URL 업데이트 */
export const usePatchFeedbackMeetingUrl = (feedbackId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ meetingUrl }: { meetingUrl: string }) =>
      axios.patch(`/feedback/${feedbackId}/meeting-url`, { meetingUrl }),
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
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['liveFeedbackList', challengeId],
      });
    },
  });
};

/**
 * PATCH /api/v1/feedback/mentor/{feedbackId} 멘토용 출석 상태 업데이트.
 *
 * - mentorStatus: 멘토 입장 성공 시 PRESENT 자동 기록.
 * - menteeStatus: 멘토가 멘티 출석을 기록(모달 닫힘/종료 시 일괄).
 * 정의된 필드만 전송한다. 실패는 입장을 막지 않는다(호출 측 swallow).
 */
export const usePatchMentorFeedbackStatus = (feedbackId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      mentorStatus?: FeedbackAttendanceStatus;
      menteeStatus?: FeedbackAttendanceStatus;
    }) => axios.patch(`/feedback/mentor/${feedbackId}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedbackDetail', feedbackId],
      });
    },
  });
};
