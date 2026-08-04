import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

import { mentorHashTagListSchema } from './mentorSchema';

export const MENTOR_HASH_TAG_QUERY_KEY = ['mentorHashTag', 'list'] as const;

/** GET /mentor-hash-tag — 공개 멘토 해시태그(필터링 옵션) 전체 목록 조회 */
export const useMentorHashTagListQuery = () => {
  return useQuery({
    queryKey: MENTOR_HASH_TAG_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get('/mentor-hash-tag');
      return mentorHashTagListSchema.parse(res.data.data).mentorHashTagList;
    },
  });
};
