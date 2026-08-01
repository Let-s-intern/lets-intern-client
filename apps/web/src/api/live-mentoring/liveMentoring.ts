import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

import {
  type LiveMentoringCategory,
  liveMentorDetailSchema,
  liveMentoringOpeningListSchema,
} from './liveMentoringSchema';

/** 리스트 페이지 크기 — S1 4×3 그리드 = 12 (PRD §5). */
export const LIVE_MENTOR_LIST_SIZE = 12;

/**
 * 리스트 정렬 옵션 — 백엔드 `sortType` 파라미터 값.
 * 평점순·후기순은 응답에 평점/후기 필드 자체가 없어 아직 지원되지 않는다.
 */
export type LiveMentorSort = 'LATEST' | 'FEEDBACK_START_DATE';

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
 * GET /live-mentoring/{liveMentoringId} — 공개 라이브 멘토링 상세(+reviews) 조회.
 *
 * 서버는 멘토 기준 경로(`/live-mentoring/mentors/{mentorId}`)를 호환용으로 남겨 두었지만
 * 정식 경로는 상품 기준이다. `상품 1 : 개설 N` 분리로 한 멘토가 여러 상품을 가질 수 있어서다.
 *
 * `liveMentoringId`가 falsy면 query를 실행하지 않는다.
 */
export const useLiveMentoringDetailQuery = (
  liveMentoringId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: [...LIVE_MENTOR_DETAIL_QUERY_KEY, { liveMentoringId }],
    queryFn: async () => {
      const res = await axios.get(`/live-mentoring/${liveMentoringId}`);
      return liveMentorDetailSchema.parse(res.data.data);
    },
    enabled: !!liveMentoringId,
  });
};
