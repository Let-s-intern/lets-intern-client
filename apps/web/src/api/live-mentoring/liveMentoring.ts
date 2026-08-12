import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

import {
  type LiveMentoringCategory,
  liveMentorDetailSchema,
  liveMentoringOpeningListSchema,
  liveMentoringSlotListSchema,
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
      const res = await axios.get(
        `/live-mentoring/mentors/${mentorId}/slots`,
      );
      return liveMentoringSlotListSchema.parse(res.data.data);
    },
    enabled: !!mentorId,
  });
};
