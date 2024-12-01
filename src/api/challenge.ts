import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  challengeTitleSchema,
  faqSchema,
  getChallengeIdSchema,
  reviewTotalSchema,
} from '../schema';
import axios from '../utils/axios';

const useChallengeQueryKey = 'useChallengeQueryKey';

export const useChallengeQuery = ({
  challengeId,
  enabled = true,
}: {
  challengeId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: [useChallengeQueryKey, challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdSchema.parse(res.data.data);
    },
  });
};

export const usePatchChallengePayback = ({
  challengeId,
  setIsPaybackFinished,
  setPaybackModalClose,
  refetchList,
}: {
  challengeId: string;
  setIsPaybackFinished: () => void;
  setPaybackModalClose: () => void;
  refetchList: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      price,
      reason,
      applicationIdList,
    }: {
      price: number;
      reason?: string;
      applicationIdList: number[];
    }) => {
      const res = await axios.patch(
        `/challenge/${challengeId}/applications/payback`,
        {
          price,
          applicationIdList,
          ...(reason && { reason }),
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [challengeId, 'challenge'],
      });
      alert('페이백이 완료되었습니다.');
      refetchList();
      setPaybackModalClose();
      setIsPaybackFinished();
    },
    onError: (error) => {
      alert('페이백에 실패했습니다.');
      setPaybackModalClose();
      console.error(error);
    },
  });
};

export const useGetChallengeTitle = (challengeId: number | string) => {
  return useQuery({
    queryKey: ['useGetChallengeTitle', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/title`);
      return challengeTitleSchema.parse(res.data.data);
    },
  });
};

export const useGetChallengeFaq = (challengeId: number | string) => {
  return useQuery({
    queryKey: ['useGetChallengeFaq', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/faqs`);
      return faqSchema.parse(res.data.data);
    },
  });
};

export const useGetTotalReview = (
  type: 'CHALLENGE' | 'LIVE' | 'VOD' | 'REPORT',
) => {
  return useQuery({
    queryKey: ['useGetTotalReview', type],
    queryFn: async () => {
      const res = await axios.get('/review', {
        params: {
          type,
        },
      });
      return reviewTotalSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};
