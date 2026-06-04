import axios from '@/utils/axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  type AdminFeedbackListParams,
  type ChangeAdminFeedbackSlotReq,
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
 * POST /admin/feedback/{feedbackId}/slot/{feedbackSlotId} — 예약 일시 변경.
 * 예약을 같은 멘토의 다른 OPEN 슬롯으로 옮긴다(바디 없음).
 * BE가 기존 슬롯을 RESERVED→OPEN 으로 자동 전환하므로 슬롯 쿼리도 invalidate.
 *
 * 성공 시 invalidate: 예약 목록 + 해당 상세 + 변경 내역(history) + 멘토 슬롯.
 */
export const useChangeAdminFeedbackSlotMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      feedbackId,
      feedbackSlotId,
    }: ChangeAdminFeedbackSlotReq) => {
      await axios.post(`/admin/feedback/${feedbackId}/slot/${feedbackSlotId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_FEEDBACK_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ADMIN_FEEDBACK_DETAIL_QUERY_KEY, variables.feedbackId],
      });
      queryClient.invalidateQueries({
        queryKey: [ADMIN_FEEDBACK_HISTORY_QUERY_KEY, variables.feedbackId],
      });
      queryClient.invalidateQueries({
        queryKey: [MENTOR_FEEDBACK_SLOTS_QUERY_KEY, variables.mentorId],
      });
    },
  });
};
