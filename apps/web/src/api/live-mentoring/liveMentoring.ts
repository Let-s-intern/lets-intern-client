import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type ConfirmLiveMentoringPaymentRequest,
  type CreateLiveMentoringApplicationRequest,
  type UpdateLiveMentoringQuestionRequest,
  type LiveMentoringCategory,
  confirmLiveMentoringPaymentResponseSchema,
  createLiveMentoringApplicationResponseSchema,
  liveMentorDetailSchema,
  liveMentoringOpeningListSchema,
  liveMentoringQuestionSchema,
  liveMentoringRefundPreviewSchema,
  liveMentoringSlotListSchema,
  myLiveMentoringApplicationListSchema,
} from './liveMentoringSchema';

/** 리스트 페이지 크기 — S1 4×3 그리드 = 12 (PRD §5). */
export const LIVE_MENTOR_LIST_SIZE = 12;

/**
 * 리스트 정렬 옵션 — 백엔드 `sortType` 파라미터 값.
 *
 * 서버 `LiveMentoringSortType` enum 에는 `LATEST` 하나만 있다. 슬롯 오픈(LC-3206)으로
 * 개설에서 모집 기간이 사라지면서 `FEEDBACK_START_DATE` 도 함께 없어졌다 — 보내면 400 이다.
 * 평점순·후기순은 응답에 평점/후기 필드 자체가 없어 아직 지원되지 않는다.
 */
export type LiveMentorSort = 'LATEST';

export interface UseLiveMentorListQueryParams {
  /** 1-based 페이지 번호. 기본 1 (서버가 `one-indexed-parameters: true`). */
  page?: number;
  /** 카테고리 필터(다중 선택). 비어 있으면 전체. */
  categories?: LiveMentoringCategory[];
  /** 정렬 기준. 미지정이면 서버 기본 순서. */
  sort?: LiveMentorSort;
}

/** 멘토 리스트 query key prefix. */
export const LIVE_MENTOR_LIST_QUERY_KEY = ['liveMentoring', 'list'] as const;
/** 멘토 상세 query key prefix. */
export const LIVE_MENTOR_DETAIL_QUERY_KEY = [
  'liveMentoring',
  'detail',
] as const;
/** 멘토 예약 가능 슬롯 query key prefix. */
export const LIVE_MENTOR_SLOTS_QUERY_KEY = ['liveMentoring', 'slots'] as const;

/**
 * GET /live-mentoring — 공개 라이브 멘토링 개설 목록(서버 페이징) 조회.
 *
 * 서버는 `categories`를 **배열**로 받는다. 선택이 없으면 파라미터를 아예 보내지 않아
 * 전체가 조회된다.
 * TanStack Query `UseQueryResult`를 그대로 반환한다.
 */
export const useLiveMentorListQuery = (
  params: UseLiveMentorListQueryParams = {},
) => {
  const { page = 1, categories = [], sort } = params;
  return useQuery({
    queryKey: [...LIVE_MENTOR_LIST_QUERY_KEY, { page, categories, sort }],
    queryFn: async () => {
      const res = await axios.get('/live-mentoring', {
        params: {
          page,
          size: LIVE_MENTOR_LIST_SIZE,
          categories: categories.length > 0 ? categories : undefined,
          sortType: sort,
        },
        // axios 기본 직렬화는 배열을 `categories[]=X` 로 보내는데 Spring 은
        // `categories=X` 반복 형태만 바인딩한다. indexes:null 로 대괄호를 없앤다.
        paramsSerializer: { indexes: null },
      });
      return liveMentoringOpeningListSchema.parse(res.data.data);
    },
  });
};

/**
 * GET /live-mentoring/mentors/{mentorId} — 공개 멘토 상세(+reviews) 조회.
 *
 * `mentorId`가 falsy면 query를 실행하지 않는다.
 */
export const useLiveMentorDetailQuery = (
  mentorId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: [...LIVE_MENTOR_DETAIL_QUERY_KEY, { mentorId }],
    queryFn: async () => {
      const res = await axios.get(`/live-mentoring/mentors/${mentorId}`);
      return liveMentorDetailSchema.parse(res.data.data);
    },
    enabled: !!mentorId,
  });
};

/**
 * GET /live-mentoring/mentors/{mentorId}/slots — 공개 예약 가능 슬롯 조회.
 *
 * 서버가 이미 걸러서 내려준다 — 활성 개설이 있고, `status === 'OPEN'` 이고, 시작이
 * 현재보다 미래인 슬롯만. 활성 개설이 없으면 빈 배열이다. 프론트는 개설 상태와
 * 슬롯 상태를 조합하지 않고 받은 목록만 쓴다.
 *
 * `mentorId`가 falsy면 query를 실행하지 않는다.
 */
export const useLiveMentorSlotsQuery = (
  mentorId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: [...LIVE_MENTOR_SLOTS_QUERY_KEY, { mentorId }],
    queryFn: async () => {
      const res = await axios.get(`/live-mentoring/mentors/${mentorId}/slots`);
      return liveMentoringSlotListSchema.parse(res.data.data);
    },
    enabled: !!mentorId,
  });
};

/**
 * POST /live-mentoring/openings/{openingId}/applications — 결제 대기 신청 생성.
 *
 * 성공하면 슬롯이 **10분간 선점**된다(`reservation.expiresAt`). 그 안에 결제 승인이
 * 끝나지 않으면 서버가 슬롯을 되돌린다. 응답의 `payment.orderId` 를 Toss 에 넘긴다.
 *
 * 실패는 그대로 던진다. 서버 `LiveMentoringErrorCode` 를 사용자 문구로 바꾸는 일은
 * 화면의 몫이다 — 여기서 만들면 같은 코드에 화면마다 다른 문구가 붙는다.
 *
 * 여기서는 쿼리를 무효화하지 않는다. 선점은 아직 예약이 아니고, 슬롯 목록은
 * 결제가 승인될 때 바뀐다(`useConfirmLiveMentoringPaymentMutation`).
 */
export const useCreateLiveMentoringApplicationMutation = (
  openingId: number | string,
) => {
  return useMutation({
    mutationFn: async (body: CreateLiveMentoringApplicationRequest) => {
      const res = await axios.post(
        `/live-mentoring/openings/${openingId}/applications`,
        body,
      );
      return createLiveMentoringApplicationResponseSchema.parse(res.data.data);
    },
  });
};

/**
 * POST /live-mentoring/applications/{applicationId}/payment/confirm — 결제 승인.
 *
 * 승인이 끝나면 선점이 확정 예약으로 바뀌므로 **슬롯 목록을 반드시 무효화한다.**
 * 남겨 두면 방금 잡은 시간이 여전히 예약 가능한 것처럼 보이고, 다시 누르면
 * 서버에서 중복 예약으로 떨어진다.
 *
 * 요청의 `amount` 는 문자열이다. 응답에서는 숫자로 돌아온다 —
 * `confirmLiveMentoringPaymentRequestSchema` 주석 참고.
 */
export const useConfirmLiveMentoringPaymentMutation = (
  applicationId: number | string,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: ConfirmLiveMentoringPaymentRequest) => {
      const res = await axios.post(
        `/live-mentoring/applications/${applicationId}/payment/confirm`,
        body,
      );
      return confirmLiveMentoringPaymentResponseSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIVE_MENTOR_SLOTS_QUERY_KEY });
    },
  });
};

/** 마이페이지 신청현황 멘토링 탭 query key. */
export const MY_LIVE_MENTORING_APPLICATIONS_QUERY_KEY = [
  'liveMentoring',
  'myApplications',
] as const;
/** 멘토링 질문 query key prefix. */
export const LIVE_MENTORING_QUESTION_QUERY_KEY = [
  'liveMentoring',
  'question',
] as const;

/**
 * GET /live-mentoring/applications/my — 내 라이브 멘토링 신청 목록.
 *
 * 서버가 결제까지 끝난 신청만 내려준다. 프론트는 상태로 다시 거르지 않고
 * 예약 시각으로 참여 예정·중·종료만 나눈다.
 */
export const useMyLiveMentoringApplicationsQuery = () => {
  return useQuery({
    queryKey: MY_LIVE_MENTORING_APPLICATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get('/live-mentoring/applications/my');
      return myLiveMentoringApplicationListSchema.parse(res.data.data);
    },
  });
};

/**
 * GET /live-mentoring/applications/{applicationId}/question — 질문 조회.
 *
 * 응답의 `editable` 을 그대로 쓴다. 화면에서 48시간을 다시 계산하면 서버와 시계가
 * 어긋나 저장 시점에 거부된다.
 */
export const useLiveMentoringQuestionQuery = (applicationId: number | null) => {
  return useQuery({
    queryKey: [...LIVE_MENTORING_QUESTION_QUERY_KEY, { applicationId }],
    queryFn: async () => {
      const res = await axios.get(
        `/live-mentoring/applications/${applicationId}/question`,
      );
      return liveMentoringQuestionSchema.parse(res.data.data);
    },
    enabled: applicationId !== null,
  });
};

/**
 * PATCH /live-mentoring/applications/{applicationId}/question — 질문 수정.
 *
 * 성공하면 질문 자체와 **신청 목록을 함께 무효화한다.** 목록의 `questionWritten` 이
 * 카드 버튼을 `작성` / `수정` 으로 가르기 때문에, 목록을 남겨 두면 방금 쓴 질문인데도
 * 카드에는 여전히 `멘토링 질문 작성` 이 남는다.
 */
export const useUpdateLiveMentoringQuestionMutation = (
  applicationId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateLiveMentoringQuestionRequest) => {
      const res = await axios.patch(
        `/live-mentoring/applications/${applicationId}/question`,
        body,
      );
      return liveMentoringQuestionSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_QUESTION_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: MY_LIVE_MENTORING_APPLICATIONS_QUERY_KEY,
      });
    },
  });
};

/** 예정 환불금액 query key prefix. */
export const LIVE_MENTORING_REFUND_PREVIEW_QUERY_KEY = [
  'liveMentoring',
  'refundPreview',
] as const;

/**
 * GET /live-mentoring/applications/{applicationId}/refund-preview — 예정 환불금액.
 *
 * 수수료율·수수료·환불액을 서버가 계산해 준다. 화면은 계산하지 않고 그리기만 한다.
 */
export const useLiveMentoringRefundPreviewQuery = (
  applicationId: number | null,
) => {
  return useQuery({
    queryKey: [...LIVE_MENTORING_REFUND_PREVIEW_QUERY_KEY, { applicationId }],
    queryFn: async () => {
      const res = await axios.get(
        `/live-mentoring/applications/${applicationId}/refund-preview`,
      );
      return liveMentoringRefundPreviewSchema.parse(res.data.data);
    },
    enabled: applicationId !== null,
    /*
      수수료는 시간이 지나면 구간이 바뀐다. 캐시된 값을 그대로 보여주면 화면의
      환불액과 실제 취소 금액이 어긋나므로 화면에 들어올 때마다 다시 받는다.
    */
    staleTime: 0,
  });
};

/**
 * POST /live-mentoring/applications/{applicationId}/cancel — 결제 취소.
 *
 * 서버가 Toss 부분 취소를 부르고 슬롯을 되돌린다. 그래서 성공하면
 * **슬롯 목록과 신청현황을 함께 무효화한다** — 남겨 두면 방금 풀린 시간이 여전히
 * 예약 불가로 보이고, 마이페이지에는 취소된 신청이 남는다.
 *
 * 되돌릴 수 없는 요청이라 재시도를 켜지 않는다. 실패가 정말 실패인지 알 수 없는
 * 상태에서 자동으로 한 번 더 부르면 이중 취소가 될 수 있다.
 */
export const useCancelLiveMentoringApplicationMutation = (
  applicationId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async () => {
      const res = await axios.post(
        `/live-mentoring/applications/${applicationId}/cancel`,
      );
      return liveMentoringRefundPreviewSchema.parse(res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIVE_MENTOR_SLOTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: MY_LIVE_MENTORING_APPLICATIONS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: LIVE_MENTORING_REFUND_PREVIEW_QUERY_KEY,
      });
    },
  });
};

/**
 * GET /coupon — 쿠폰 코드를 검증하고 할인값을 받아 온다.
 *
 * 신청 생성과 **같은** 검증(`couponService.applyCoupon`)을 태우므로, 여기서 통과한
 * 쿠폰은 결제에서도 통과한다. 등록 시점에 판정해야 사용자가 사유를 바로 알고
 * 할인 금액도 화면에 뜬다.
 *
 * `discount` 가 `-1` 이면 전액 할인이다(서버 `calculatePrice` 규칙).
 * 실제 청구액은 신청 생성 응답의 `payment.finalAmount` 가 정한다.
 */
export const applyLiveMentoringCoupon = async (code: string) => {
  const res = await axios.get('/coupon', {
    params: { code, programType: 'LIVE_MENTORING' },
  });
  return res.data.data as { couponId: number; discount: number };
};
