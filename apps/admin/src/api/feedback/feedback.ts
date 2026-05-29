import axios from '@/utils/axios';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import {
  type AdminFeedbackListParams,
  type FeedbackAdminVo,
  type FeedbackDetailAdminVo,
  type FeedbackSlotVo,
  type MentorFeedbackSlotParams,
  getAdminFeedbackDetailResponseSchema,
  getAdminFeedbacksResponseSchema,
  getMentorFeedbackSlotsResponseSchema,
} from './feedbackSchema';

/**
 * LIVE 피드백(예약) API 훅.
 *
 * 모두 axios v1(`VITE_SERVER_API`) 기준. BE LC-3065-feat 계약을 따르며,
 * 병합 전까지는 MSW 핸들러(mocks/handlers/adminFeedback.ts)가 응답을 제공한다.
 */

const ADMIN_FEEDBACK_QUERY_KEY = 'adminFeedbackList';
const ADMIN_FEEDBACK_DETAIL_QUERY_KEY = 'adminFeedbackDetail';
const MENTOR_FEEDBACK_SLOTS_QUERY_KEY = 'mentorFeedbackSlots';

/** 빈 배열/undefined/빈 문자열 파라미터를 제거해 직렬화한다. */
export function serializeFeedbackListParams(
  params: AdminFeedbackListParams,
): Record<string, number[] | string> {
  const result: Record<string, number[] | string> = {};

  if (params.challengeIdList && params.challengeIdList.length > 0) {
    result.challengeIdList = params.challengeIdList;
  }
  if (params.mentorIdList && params.mentorIdList.length > 0) {
    result.mentorIdList = params.mentorIdList;
  }
  if (params.menteeIdList && params.menteeIdList.length > 0) {
    result.menteeIdList = params.menteeIdList;
  }
  if (params.feedbackStartDate) {
    result.feedbackStartDate = params.feedbackStartDate;
  }
  if (params.feedbackEndDate) {
    result.feedbackEndDate = params.feedbackEndDate;
  }
  if (params.createStartDate) {
    result.createStartDate = params.createStartDate;
  }
  if (params.createEndDate) {
    result.createEndDate = params.createEndDate;
  }

  return result;
}

/** 멘토 슬롯 조회 파라미터를 직렬화한다(빈 값 제거). */
export function serializeMentorSlotParams(
  params: MentorFeedbackSlotParams,
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  if (params.startDate) {
    result.startDate = params.startDate;
  }
  if (params.endDate) {
    result.endDate = params.endDate;
  }
  if (params.statusList && params.statusList.length > 0) {
    result.statusList = params.statusList;
  }

  return result;
}

/** GET /admin/feedback — 전체 예약 목록(필터) */
export const useAdminFeedbackListQuery = (
  params: AdminFeedbackListParams = {},
): UseQueryResult<FeedbackAdminVo[]> => {
  const queryParams = serializeFeedbackListParams(params);

  return useQuery({
    queryKey: [ADMIN_FEEDBACK_QUERY_KEY, queryParams],
    queryFn: async () => {
      const res = await axios.get('/admin/feedback', { params: queryParams });
      return getAdminFeedbacksResponseSchema.parse(res.data.data).feedbackList;
    },
  });
};

/** GET /admin/feedback/{feedbackId} — 예약 상세 */
export const useAdminFeedbackDetailQuery = (
  feedbackId?: number,
): UseQueryResult<FeedbackDetailAdminVo> => {
  return useQuery({
    queryKey: [ADMIN_FEEDBACK_DETAIL_QUERY_KEY, feedbackId],
    queryFn: async () => {
      const res = await axios.get(`/admin/feedback/${feedbackId}`);
      return getAdminFeedbackDetailResponseSchema.parse(res.data.data)
        .feedbackInfo;
    },
    enabled: feedbackId != null,
  });
};

/** GET /admin/feedback/slot/{mentorId} — 멘토 주간 슬롯 */
export const useMentorFeedbackSlotsQuery = (
  mentorId?: number,
  range: MentorFeedbackSlotParams = {},
): UseQueryResult<FeedbackSlotVo[]> => {
  const queryParams = serializeMentorSlotParams(range);

  return useQuery({
    queryKey: [MENTOR_FEEDBACK_SLOTS_QUERY_KEY, mentorId, queryParams],
    queryFn: async () => {
      const res = await axios.get(`/admin/feedback/slot/${mentorId}`, {
        params: queryParams,
      });
      return getMentorFeedbackSlotsResponseSchema.parse(res.data.data)
        .feedbackSlotList;
    },
    enabled: mentorId != null,
  });
};
