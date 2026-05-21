import axios from '@/utils/axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  type CreateFeedbackSlotRequest,
  type FeedbackSlotStatus,
  getFeedbackDetailResponseSchema,
  getMentorFeedbackSlotsResponseSchema,
} from './feedbackSchema';

const FEEDBACK_MENTOR_SLOT_PATH = '/feedback/mentor/slot';
const FEEDBACK_DETAIL_PATH = '/feedback';

/**
 * 피드백 단건 상세 query key prefix.
 * 단건 상세 캐시는 `feedbackId` 단위로 분리한다.
 */
export const FEEDBACK_DETAIL_QUERY_KEY = ['feedback', 'detail'] as const;

/**
 * 멘토 슬롯 query key prefix.
 * 모든 멘토 슬롯 query는 이 prefix를 공유하므로 mutation 성공 시 한 번에 invalidate 가능하다.
 */
export const FEEDBACK_MENTOR_SLOT_QUERY_KEY = [
  'feedback',
  'mentor',
  'slot',
] as const;

export interface UseFeedbackMentorSlotsQueryParams {
  /** ISO 문자열. BE는 `startDate ≤ FeedbackSlot.startDate` 조건으로 사용 */
  startDate?: string;
  /** ISO 문자열. BE는 `FeedbackSlot.startDate ≤ endDate` 조건으로 사용 */
  endDate?: string;
  /** OPEN / RESERVED 다중 필터. 미지정 시 BE는 전체 반환 */
  statusList?: FeedbackSlotStatus[];
  /** false면 query 실행 안 함 */
  enabled?: boolean;
}

/**
 * GET /api/v1/feedback/mentor/slot — 본인 슬롯 목록 조회.
 *
 * Query key 컨벤션: `['feedback', 'mentor', 'slot', params]`
 */
export const useFeedbackMentorSlotsQuery = (
  params: UseFeedbackMentorSlotsQueryParams = {},
) => {
  const { startDate, endDate, statusList, enabled = true } = params;
  return useQuery({
    queryKey: [
      ...FEEDBACK_MENTOR_SLOT_QUERY_KEY,
      { startDate, endDate, statusList },
    ],
    queryFn: async () => {
      const res = await axios.get(FEEDBACK_MENTOR_SLOT_PATH, {
        params: {
          startDate,
          endDate,
          // axios는 배열 파라미터를 `statusList=OPEN&statusList=RESERVED` 형태로 직렬화한다.
          statusList,
        },
      });
      return getMentorFeedbackSlotsResponseSchema.parse(res.data.data);
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * POST /api/v1/feedback/mentor/slot — 슬롯 다건 일괄 생성.
 * 성공 시 멘토 슬롯 캐시 전체를 invalidate.
 */
export const useCreateFeedbackMentorSlotsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slots: CreateFeedbackSlotRequest[]) => {
      // BE는 응답 본문이 비어 있다 (201 Created)
      await axios.post(FEEDBACK_MENTOR_SLOT_PATH, slots);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_MENTOR_SLOT_QUERY_KEY,
      });
    },
  });
};

/**
 * DELETE /api/v1/feedback/mentor/slot — 슬롯 다건 일괄 삭제.
 * Body로 `number[]`를 보낸다. (axios.delete의 두 번째 인자 `data` 사용)
 * 성공 시 멘토 슬롯 캐시 전체를 invalidate.
 */
export const useDeleteFeedbackMentorSlotsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedbackSlotIdList: number[]) => {
      await axios.delete(FEEDBACK_MENTOR_SLOT_PATH, {
        data: feedbackSlotIdList,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_MENTOR_SLOT_QUERY_KEY,
      });
    },
  });
};

/**
 * GET /api/v1/feedback/{feedbackId} — 피드백 단건 상세 조회.
 *
 * Query key 컨벤션: `['feedback','detail', { feedbackId }]`
 * - `feedbackId`가 falsy(undefined/null/0)면 query를 실행하지 않는다.
 * - 응답 `feedbackInfo`만 추출해서 반환한다 (caller가 한 단계 덜 파야 한다).
 */
export const useFeedbackDetailQuery = (feedbackId: number | null | undefined) => {
  return useQuery({
    queryKey: [...FEEDBACK_DETAIL_QUERY_KEY, { feedbackId }],
    queryFn: async () => {
      const res = await axios.get(`${FEEDBACK_DETAIL_PATH}/${feedbackId}`);
      const parsed = getFeedbackDetailResponseSchema.parse(res.data.data);
      return parsed.feedbackInfo;
    },
    enabled: !!feedbackId,
    refetchOnWindowFocus: false,
  });
};
