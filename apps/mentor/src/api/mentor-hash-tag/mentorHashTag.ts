import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  mentorHashTagListSchema,
  type PutMyMentorHashTagReq,
} from './mentorHashTagSchema';

export const MentorHashTagQueryKey = 'mentorHashTagQueryKey';
export const MyMentorHashTagQueryKey = 'myMentorHashTagQueryKey';

/** GET /mentor-hash-tag — 멘토 해시태그 전체 목록 조회 */
export const useMentorHashTagListQuery = () => {
  return useQuery({
    queryKey: [MentorHashTagQueryKey],
    queryFn: async () => {
      const res = await axios.get('/mentor-hash-tag');
      return mentorHashTagListSchema.parse(res.data.data).mentorHashTagList;
    },
  });
};

/** GET /mentor-hash-tag/my — 나의 멘토 해시태그 조회 */
export const useMyMentorHashTagListQuery = () => {
  return useQuery({
    queryKey: [MyMentorHashTagQueryKey],
    queryFn: async () => {
      const res = await axios.get('/mentor-hash-tag/my');
      return mentorHashTagListSchema.parse(res.data.data).mentorHashTagList;
    },
  });
};

/** PUT /mentor-hash-tag/my — 나의 멘토 해시태그 수정 (전달한 목록이 최종 목록이 됨) */
export const usePutMyMentorHashTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: PutMyMentorHashTagReq) => {
      await axios.put('/mentor-hash-tag/my', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MyMentorHashTagQueryKey] });
    },
  });
};
