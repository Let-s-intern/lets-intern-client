import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type CreateFeedbackSlotRequest,
  type FeedbackAttendanceStatus,
  type FeedbackSlotStatus,
  type FeedbackStatus,
  getFeedbackDetailResponseSchema,
  getMentorFeedbackDetailResponseSchema,
  getMentorFeedbacksResponseSchema,
  getMentorFeedbackSlotsResponseSchema,
} from './feedbackSchema';

const FEEDBACK_MENTOR_SLOT_PATH = '/feedback/mentor/slot';
const FEEDBACK_DETAIL_PATH = '/feedback';
const FEEDBACK_MENTOR_PATH = '/feedback/mentor';

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
export const useFeedbackDetailQuery = (
  feedbackId: number | null | undefined,
) => {
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

/**
 * 멘토 피드백 query key prefix.
 * 목록/상세 모두 이 prefix를 공유하므로 PATCH 성공 시 한 번에 invalidate 가능하다.
 */
export const FEEDBACK_MENTOR_QUERY_KEY = ['feedback', 'mentor'] as const;

export interface UseFeedbackMentorListQueryParams {
  /** ISO 문자열. BE 조회 시작 일시 */
  startDate?: string;
  /** ISO 문자열. BE 조회 종료 일시 */
  endDate?: string;
  /** RESERVED / COMPLETED / CANCELED 다중 필터. 미지정 시 BE는 전체 반환 */
  statusList?: FeedbackStatus[];
  /** false면 query 실행 안 함 */
  enabled?: boolean;
}

/**
 * GET /feedback/mentor — 멘토 본인 라이브 피드백 목록 조회.
 *
 * Query key: `['feedback','mentor','list', { startDate, endDate, statusList }]`
 * - 응답 `feedbackList`만 추출해 반환한다 (caller가 한 단계 덜 파야 한다).
 * - Push 2(대시보드 그룹핑)에서도 이 훅을 재사용한다.
 */
export const useFeedbackMentorListQuery = (
  params: UseFeedbackMentorListQueryParams = {},
) => {
  const { startDate, endDate, statusList, enabled = true } = params;
  return useQuery({
    queryKey: [
      ...FEEDBACK_MENTOR_QUERY_KEY,
      'list',
      { startDate, endDate, statusList },
    ],
    queryFn: async () => {
      const res = await axios.get(FEEDBACK_MENTOR_PATH, {
        params: {
          startDate,
          endDate,
          // axios는 배열 파라미터를 `statusList=RESERVED&statusList=COMPLETED` 형태로 직렬화한다.
          statusList,
        },
      });
      const parsed = getMentorFeedbacksResponseSchema.parse(res.data.data);
      return parsed.feedbackList;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * GET /feedback/mentor/{feedbackId} — 멘토 라이브 피드백 단건 상세 조회.
 *
 * Query key: `['feedback','mentor','detail', { feedbackId }]`
 * - `feedbackId`가 falsy(undefined/null/0)면 query를 실행하지 않는다.
 * - 응답 `feedbackInfo`만 추출해 반환한다.
 */
export const useFeedbackMentorDetailQuery = (
  feedbackId: number | null | undefined,
) => {
  return useQuery({
    queryKey: [...FEEDBACK_MENTOR_QUERY_KEY, 'detail', { feedbackId }],
    queryFn: async () => {
      const res = await axios.get(`${FEEDBACK_MENTOR_PATH}/${feedbackId}`);
      const parsed = getMentorFeedbackDetailResponseSchema.parse(res.data.data);
      return parsed.feedbackInfo;
    },
    enabled: !!feedbackId,
    refetchOnWindowFocus: false,
  });
};

export interface UpdateFeedbackByMentorVariables {
  feedbackId: number;
  /** 멘토는 멘티 출석 상태만 수정할 수 있다. */
  menteeStatus: FeedbackAttendanceStatus;
}

/**
 * PATCH /api/v1/feedback/{feedbackId}/meeting-url — 회의실 URL 업데이트.
 *
 * 멘토 FE 가 Jitsi 도메인 헬스체크 후 healthy URL 을 보내면,
 * BE 가 `jitsiUrl + meetingRoom` 으로 meetingUrl 을 합성·저장한다.
 * 성공 시 멘토 피드백 캐시 전체를 invalidate.
 */
export const useUpdateFeedbackMeetingUrlMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      feedbackId,
      meetingUrl,
    }: {
      feedbackId: number;
      meetingUrl: string;
    }) => {
      await axios.patch(`${FEEDBACK_DETAIL_PATH}/${feedbackId}/meeting-url`, {
        meetingUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_MENTOR_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FEEDBACK_DETAIL_QUERY_KEY });
    },
  });
};

/**
 * PATCH /feedback/mentor/{feedbackId} — 멘티 출석 상태 수정.
 * 멘토는 `menteeStatus`만 적용 가능. 성공 시 멘토 피드백 캐시 전체를 invalidate.
 */
export const useUpdateFeedbackByMentorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      feedbackId,
      menteeStatus,
    }: UpdateFeedbackByMentorVariables) => {
      // BE는 200 빈 본문을 반환한다.
      await axios.patch(`${FEEDBACK_MENTOR_PATH}/${feedbackId}`, {
        menteeStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_MENTOR_QUERY_KEY,
      });
    },
  });
};
