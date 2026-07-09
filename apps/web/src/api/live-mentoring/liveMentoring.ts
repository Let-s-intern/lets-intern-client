import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

import {
  type LiveMentoringCategory,
  liveMentorDetailSchema,
  liveMentorListResponseSchema,
} from './liveMentoringSchema';

/** 리스트 페이지 크기 — S1 3×3 그리드 = 9 (PRD §5). */
export const LIVE_MENTOR_LIST_SIZE = 9;

/** 리스트 정렬 옵션 (PRD §5). */
export type LiveMentorSort = 'rating' | 'reviews' | 'latest';

/** 카테고리 필터 — 'ALL'이면 전체(쿼리 미전달). */
export type LiveMentorCategoryFilter = LiveMentoringCategory | 'ALL';

export interface UseLiveMentorListQueryParams {
  /** 0-based 페이지 번호. 기본 0. */
  page?: number;
  /** 카테고리 필터. 'ALL' 또는 미지정이면 전체. */
  category?: LiveMentorCategoryFilter;
  /** 정렬 기준. 미지정이면 기본 순서. */
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
 * GET /live-mentoring/mentors — 공개 멘토 리스트(서버 페이징) 조회.
 *
 * `page`/`category`/`sort`를 쿼리로 전달하고 응답을 zod 로 파싱한다.
 * TanStack Query `UseQueryResult`를 그대로 반환한다.
 */
export const useLiveMentorListQuery = (
  params: UseLiveMentorListQueryParams = {},
) => {
  const { page = 0, category = 'ALL', sort } = params;
  return useQuery({
    queryKey: [...LIVE_MENTOR_LIST_QUERY_KEY, { page, category, sort }],
    queryFn: async () => {
      const res = await axios.get('/live-mentoring/mentors', {
        params: {
          page,
          size: LIVE_MENTOR_LIST_SIZE,
          category: category === 'ALL' ? undefined : category,
          sort,
        },
      });
      return liveMentorListResponseSchema.parse(res.data.data);
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
