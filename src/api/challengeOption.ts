import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  challengeOptionsSchema,
  PatchChallengeOptionReq,
  PostChallengeOptionReq,
} from './challengeOptionSchema';

const challengeOptionsQueryKey = 'challengeOptionsQueryKey';

// GET 챌린지 옵션 전체 목록 조회
export const useGetChallengeOptions = () => {
  return useQuery({
    queryKey: [challengeOptionsQueryKey],
    queryFn: async () => {
      const res = await axios.get('/admin/challenge-option');
      return challengeOptionsSchema.parse(res.data.data);
    },
    retry: 1,
  });
};

// POST 챌린지 옵션 생성
export const usePostChallengeOption = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (req: PostChallengeOptionReq) => {
      const res = await axios.post('/admin/challenge-option', req);
      return res.data.data;
    },
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: [challengeOptionsQueryKey],
      }),
    onError: (error) => console.error('POST 챌린지 옵션 생성:', error),
  });
};

// DELETE 챌린지 옵션 삭제
export const useDeleteChallengeOption = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (optionId: number | string) => {
      const res = await axios.delete(`/admin/challenge-option/${optionId}`);
      return res.data.data;
    },
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: [challengeOptionsQueryKey],
      }),
    onError: (error) => console.error('DELETE 챌린지 옵션 삭제:', error),
  });
};

// PATCH 챌린지 옵션 수정
export const usePatchChallengeOption = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (req: PatchChallengeOptionReq) => {
      const { challengeOptionId, ...body } = req;
      const res = await axios.post(
        `/admin/challenge-option/${challengeOptionId}`,
        body,
      );
      return res.data.data;
    },
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: [challengeOptionsQueryKey],
      }),
    onError: (error) => console.error('PATCH 챌린지 옵션 수정:', error),
  });
};
