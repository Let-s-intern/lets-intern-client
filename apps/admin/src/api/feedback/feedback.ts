import axios from '@/utils/axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  type AdminFeedbackListParams,
  type FeedbackAdminVo,
  type FeedbackDetailAdminVo,
  type FeedbackHistoryItem,
  type FeedbackSlotVo,
  type MentorFeedbackSlotParams,
  type UpdateAdminFeedbackReq,
  getAdminFeedbackDetailResponseSchema,
  getAdminFeedbackHistoryResponseSchema,
  getAdminFeedbacksResponseSchema,
  getMentorFeedbackSlotsResponseSchema,
  getMentorSlotCountsResponseSchema,
} from './feedbackSchema';

/**
 * LIVE 피드백(예약) API 훅.
 *
 * 모두 axios v1(`VITE_SERVER_API`) 기준. BE LC-3065-feat 계약을 따르며,
 * 병합 전까지는 MSW 핸들러(mocks/handlers/adminFeedback.ts)가 응답을 제공한다.
 */

const ADMIN_FEEDBACK_QUERY_KEY = 'adminFeedbackList';
const ADMIN_FEEDBACK_DETAIL_QUERY_KEY = 'adminFeedbackDetail';
const ADMIN_FEEDBACK_HISTORY_QUERY_KEY = 'adminFeedbackHistory';
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

/** GET /admin/feedback/{feedbackId}/history — 예약 변경 내역 (펼침 시 조회) */
export const useAdminFeedbackHistoryQuery = (
  feedbackId?: number,
  enabled = true,
): UseQueryResult<FeedbackHistoryItem[]> => {
  return useQuery({
    queryKey: [ADMIN_FEEDBACK_HISTORY_QUERY_KEY, feedbackId],
    queryFn: async () => {
      const res = await axios.get(`/admin/feedback/${feedbackId}/history`);
      return getAdminFeedbackHistoryResponseSchema.parse(res.data.data)
        .historyList;
    },
    enabled: feedbackId != null && enabled,
  });
};

/**
 * 멘토 슬롯 조회 쿼리 옵션 팩토리.
 * 단일 훅과 useQueries(멘토별 병렬 호출)에서 공유한다.
 */
export const mentorFeedbackSlotsQueryOptions = (
  mentorId: number,
  range: MentorFeedbackSlotParams = {},
) => {
  const queryParams = serializeMentorSlotParams(range);
  return {
    queryKey: [MENTOR_FEEDBACK_SLOTS_QUERY_KEY, mentorId, queryParams],
    queryFn: async (): Promise<FeedbackSlotVo[]> => {
      const res = await axios.get(`/admin/feedback/slot/${mentorId}`, {
        params: queryParams,
      });
      return getMentorFeedbackSlotsResponseSchema.parse(res.data.data)
        .feedbackSlotList;
    },
  };
};

/** GET /admin/feedback/slot/{mentorId} — 멘토 주간 슬롯 */
export const useMentorFeedbackSlotsQuery = (
  mentorId?: number,
  range: MentorFeedbackSlotParams = {},
): UseQueryResult<FeedbackSlotVo[]> => {
  return useQuery({
    ...mentorFeedbackSlotsQueryOptions(mentorId ?? 0, range),
    enabled: mentorId != null,
  });
};

/**
 * GET /admin/feedback/slot/count — 멘토별 오픈/예약 슬롯 건수 집계.
 * 멘토 태그의 "오픈 N" 표시에 쓴다(멘토 1명씩 조회하던 N+1을 1콜로 대체).
 * startDate 를 주면 그 시각 이후 슬롯만 집계한다(미래 오픈 슬롯).
 */
export const useAdminMentorSlotCountsQuery = (startDate?: string) => {
  return useQuery({
    queryKey: ['adminMentorSlotCounts', startDate],
    queryFn: async () => {
      const res = await axios.get('/admin/feedback/slot/count', {
        params: startDate ? { startDate } : {},
      });
      return getMentorSlotCountsResponseSchema.parse(res.data.data)
        .mentorSlotCountList;
    },
  });
};

/**
 * PATCH /admin/feedback/{feedbackId} — 라이브 피드백 1건 수정.
 * 멘토/멘티 출석 상태, 후기 점수/내용/공개여부를 수정한다.
 * 성공 시 해당 상세 + 목록 캐시를 invalidate.
 */
export const useUpdateAdminFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ feedbackId, ...body }: UpdateAdminFeedbackReq) => {
      await axios.patch(`/admin/feedback/${feedbackId}`, body);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_FEEDBACK_DETAIL_QUERY_KEY, variables.feedbackId],
      });
      queryClient.invalidateQueries({ queryKey: [ADMIN_FEEDBACK_QUERY_KEY] });
    },
  });
};

/**
 * POST /admin/feedback/{feedbackId}/slot/{feedbackSlotId} — 라이브 피드백 예약 일정 변경.
 * 기존 예약(feedbackId)을 멘토의 다른 OPEN 슬롯(feedbackSlotId)으로 옮긴다.
 * BE 는 path 파라미터만 받는다(요청 바디 없음). 성공 시 목록·상세·슬롯 캐시 invalidate.
 */
export const useRescheduleAdminFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      feedbackId,
      feedbackSlotId,
    }: {
      feedbackId: number;
      feedbackSlotId: number;
    }) => {
      await axios.post(`/admin/feedback/${feedbackId}/slot/${feedbackSlotId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_FEEDBACK_DETAIL_QUERY_KEY, variables.feedbackId],
      });
      queryClient.invalidateQueries({ queryKey: [ADMIN_FEEDBACK_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [MENTOR_FEEDBACK_SLOTS_QUERY_KEY],
      });
    },
  });
};
