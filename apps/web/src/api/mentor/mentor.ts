import axios from '@/utils/axios';

import {
  mentorDetailSchema,
  mentorHashTagListSchema,
  mentorListSchema,
  mentorStatsSchema,
} from './mentorSchema';

export const MENTOR_HASH_TAG_QUERY_KEY = ['mentorHashTag', 'list'] as const;

/** GET /mentor-hash-tag — 공개 멘토 해시태그(필터링 옵션) 전체 목록 조회 */
export const mentorHashTagListQueryOptions = () => ({
  queryKey: MENTOR_HASH_TAG_QUERY_KEY,
  queryFn: async () => {
    const res = await axios.get('/mentor-hash-tag');
    return mentorHashTagListSchema.parse(res.data.data).mentorHashTagList;
  },
});

export interface UseMentorListQueryParams {
  /** 해시태그 필터(다중 선택). 비어 있으면 전체. */
  hashTagIdList?: number[];
  page?: number;
  size?: number;
}

export const MENTOR_LIST_QUERY_KEY = ['mentor', 'list'] as const;

/** GET /mentor — 멘토 전체 목록 조회 */
export const mentorListQueryOptions = (
  params: UseMentorListQueryParams = {},
) => {
  const { hashTagIdList = [], page = 1, size = 100 } = params;
  return {
    queryKey: [...MENTOR_LIST_QUERY_KEY, { hashTagIdList, page, size }],
    queryFn: async () => {
      const res = await axios.get('/mentor', {
        params: {
          hashTagIdList: hashTagIdList.length > 0 ? hashTagIdList : undefined,
          page,
          size,
        },
        paramsSerializer: { indexes: null },
      });
      return mentorListSchema.parse(res.data.data);
    },
  };
};

export const MENTOR_DETAIL_QUERY_KEY = ['mentor', 'detail'] as const;

/** GET /mentor/{mentorId} — 멘토 상세 조회 */
export const mentorDetailQueryOptions = (mentorId: number | string) => ({
  queryKey: [...MENTOR_DETAIL_QUERY_KEY, mentorId],
  queryFn: async () => {
    const res = await axios.get(`/mentor/${mentorId}`);
    return mentorDetailSchema.parse(res.data.data);
  },
});

export const MENTOR_STATS_QUERY_KEY = ['mentor', 'stats'] as const;

/** GET /mentor/{mentorId}/stats — 멘토 피드백/리뷰 통계 조회 */
export const mentorStatsQueryOptions = (mentorId: number | string) => ({
  queryKey: [...MENTOR_STATS_QUERY_KEY, mentorId],
  queryFn: async () => {
    const res = await axios.get(`/mentor/${mentorId}/stats`);
    return mentorStatsSchema.parse(res.data.data);
  },
});
