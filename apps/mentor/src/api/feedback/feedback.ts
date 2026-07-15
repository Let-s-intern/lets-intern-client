import axios from '@/utils/axios';
import { useMemo } from 'react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  type CreateFeedbackSlotRequest,
  type FeedbackAttendanceStatus,
  type FeedbackMentorWithAttendance,
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
 * 멘토 단건 상세 query key 빌더.
 * 단건 훅(`useFeedbackMentorDetailQuery`)과 목록+상세 병합 훅
 * (`useFeedbackMentorListWithAttendance`)이 동일 키를 써 캐시를 공유한다.
 */
const mentorDetailQueryKey = (feedbackId: number | null | undefined) =>
  [...FEEDBACK_MENTOR_QUERY_KEY, 'detail', { feedbackId }] as const;

/**
 * GET /feedback/mentor/{feedbackId} — 멘토 라이브 피드백 단건 상세 fetcher.
 * 단건 훅·병합 훅이 동일 queryFn을 공유해 응답 파싱·캐시 정합을 보장한다.
 */
async function fetchMentorFeedbackDetail(feedbackId: number) {
  const res = await axios.get(`${FEEDBACK_MENTOR_PATH}/${feedbackId}`);
  const parsed = getMentorFeedbackDetailResponseSchema.parse(res.data.data);
  return parsed.feedbackInfo;
}

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
    queryKey: mentorDetailQueryKey(feedbackId),
    queryFn: () => fetchMentorFeedbackDetail(feedbackId as number),
    enabled: !!feedbackId,
    refetchOnWindowFocus: false,
  });
};

/**
 * 목록 + 상세 병합 훅 — 목록 각 `feedbackId`의 `attendanceStatus`(경험정리 제출 상태)를
 * 상세 API N+1 조회로 보강한다.
 *
 * 배경(PRD §6-1): 목록 VO(`FeedbackMentorVo`)엔 `attendanceStatus`가 없고 상세 VO에만 있다.
 * "멘티 미제출(`ABSENT`/`LATE`) → 미진행" 판정에 필요해, 목록 각 건을
 * `useFeedbackMentorDetailQuery`와 **동일 queryKey/queryFn**으로 `useQueries` 병렬 조회해
 * `attendanceStatus`만 머지한다.
 * (⚠️ `status=CANCELED` 재사용 금지 — 취소는 별도 용도. 미제출은 `attendanceStatus`로만 판정.)
 *
 * 캐시: `feedbackId`별 상세 쿼리키를 단건 훅·모달과 공유하므로, 상세 모달을 열어도
 * 이미 병합 훅이 채운 캐시를 재사용해 중복 호출이 없다.
 *
 * N+1 호출 범위(성능 가드, PRD §8): 현재는 목록 **전체**를 대상으로 상세를 조회한다.
 *  - 멘토 목록은 본인 예약분이라 규모가 자연히 제한적이라 전체 조회 부담이 작다.
 *  - 뷰포트/탭 단위 지연 조회는 IntersectionObserver 등 추가 복잡도가 크고,
 *    근본 해결(목록 VO에 `attendanceStatus` 추가)은 BE 별건이다.
 *  - 목록이 커지면 지연/조건부 조회 또는 BE 목록필드 추가로 전환한다.
 *
 * 실패 처리: 상세 조회 실패는 목록을 깨지 않는다(`isError`는 목록 기준). 실패 건은
 * `attendanceStatus`가 `undefined`로 남아 리졸버가 기존(시각·출석) 로직을 따른다(하위 호환).
 */
export const useFeedbackMentorListWithAttendance = (
  params: UseFeedbackMentorListQueryParams = {},
) => {
  const listQuery = useFeedbackMentorListQuery(params);
  const list = listQuery.data;
  const enabled = params.enabled ?? true;

  const detailQueries = useQueries({
    queries: (list ?? []).map((item) => ({
      queryKey: mentorDetailQueryKey(item.feedbackId),
      queryFn: () => fetchMentorFeedbackDetail(item.feedbackId),
      enabled,
      refetchOnWindowFocus: false,
    })),
  });

  // detailQueries 배열 참조는 매 렌더 변동 → 병합 대상 값만 안정 키로 뽑아 재계산 제어.
  const detailKey = detailQueries
    .map(
      (q) =>
        `${q.data?.attendanceStatus ?? ''}~${q.data?.missionStartDate ?? ''}~${q.data?.missionEndDate ?? ''}`,
    )
    .join('|');

  const data = useMemo<FeedbackMentorWithAttendance[] | undefined>(
    () =>
      list?.map((item, index) => ({
        ...item,
        attendanceStatus: detailQueries[index]?.data?.attendanceStatus,
        missionStartDate: detailQueries[index]?.data?.missionStartDate,
        missionEndDate: detailQueries[index]?.data?.missionEndDate,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, detailKey],
  );

  const isDetailLoading =
    !!list && list.length > 0 && detailQueries.some((q) => q.isLoading);

  return {
    data,
    isLoading: listQuery.isLoading || isDetailLoading,
    isError: listQuery.isError,
  };
};

export interface UpdateFeedbackByMentorVariables {
  feedbackId: number;
  /** 멘티 출석 상태. 멘토가 멘티 참여 여부를 마킹할 때 사용. */
  menteeStatus?: FeedbackAttendanceStatus;
  /** 멘토 본인 출석 상태. 멘토 입장 시 mentorStatus=PRESENT 자동기록용. */
  mentorStatus?: FeedbackAttendanceStatus;
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
 * PATCH /feedback/mentor/{feedbackId} — 멘토/멘티 출석 상태 수정.
 * `menteeStatus`(멘티 출석)와 `mentorStatus`(멘토 본인 출석) 중 전달된 것만 본문에 담는다.
 * (BE `PATCH /feedback/mentor/{id}`는 둘 다 수용하며, 미포함 필드는 그대로 유지한다.)
 * 성공 시 멘토 피드백 캐시 전체를 invalidate.
 */
export const useUpdateFeedbackByMentorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      feedbackId,
      menteeStatus,
      mentorStatus,
    }: UpdateFeedbackByMentorVariables) => {
      // 정의된 상태만 payload에 포함 — 기존 menteeStatus 단독 호출부는 무영향.
      const payload: {
        menteeStatus?: FeedbackAttendanceStatus;
        mentorStatus?: FeedbackAttendanceStatus;
      } = {};
      if (menteeStatus !== undefined) payload.menteeStatus = menteeStatus;
      if (mentorStatus !== undefined) payload.mentorStatus = mentorStatus;
      // BE는 200 빈 본문을 반환한다.
      await axios.patch(`${FEEDBACK_MENTOR_PATH}/${feedbackId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FEEDBACK_MENTOR_QUERY_KEY,
      });
    },
  });
};
