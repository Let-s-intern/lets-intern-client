import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  activeChallengeResponse,
  AttendanceResult,
  AttendanceStatus,
  ChallengeIdPrimitive,
  challengeTitleSchema,
  ChallengeType,
  faqSchema,
  getChallengeIdPrimitiveSchema,
  getChallengeIdSchema,
  reviewTotalSchema,
} from '../schema';
import axios from '../utils/axios';
import {
  challengeGoalSchema,
  challengeUserInfoSchema,
  challengeValidUserSchema,
} from './challengeSchema';
import { getAdminProgramReviewQueryKey } from './review';

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

export const fetchChallengeData = async (
  challengeId: string,
): Promise<ChallengeIdPrimitive> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API}/challenge/${challengeId}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch challenge data');
  }

  const data = await res.json();
  return getChallengeIdPrimitiveSchema.parse(data.data);
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

const getTotalReviewQueryKey = (
  type: string,
  programTitle?: string | null,
  createdDate?: string | null,
) => {
  return ['useGetTotalReview', type, programTitle, createdDate];
};

export const useGetTotalReview = ({
  type,
  programTitle,
  createdDate,
}: {
  type: 'CHALLENGE' | 'LIVE' | 'VOD' | 'REPORT';
  programTitle?: string | null;
  createdDate?: string | null;
}) => {
  return useQuery({
    queryKey: getTotalReviewQueryKey(type, programTitle, createdDate),
    queryFn: async () => {
      const sortParams: string[] = [];

      if (programTitle) {
        sortParams.push(
          `programTitle;${programTitle === 'ASCENDING' ? 'ASC' : 'DESC'}`,
        );
      }

      if (createdDate) {
        sortParams.push(
          `createDate;${createdDate === 'ASCENDING' ? 'ASC' : 'DESC'}`,
        );
      }

      const res = await axios.get('/review', {
        params: {
          type,
          sort: sortParams.join('&'),
        },
      });
      return reviewTotalSchema.parse(res.data.data);
    },
    refetchOnWindowFocus: false,
  });
};

export const useEditReviewVisible = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      type,
      programTitle,
      createDate,
      reviewId,
      isVisible,
    }: {
      type: string;
      programTitle?: string | null;
      createDate?: string | null;
      reviewId: number;
      isVisible: boolean;
    }) => {
      const res = await axios.patch(
        `/review/${reviewId}/status`,
        {},
        {
          params: {
            isVisible,
          },
        },
      );
      return { data: res.data, type, programTitle, createDate };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getTotalReviewQueryKey(
          data.type,
          data.programTitle,
          data.createDate,
        ),
      });
    },
  });
};

// 모집 중인 챌린지 조회
export const useGetActiveChallenge = (type: ChallengeType) => {
  return useQuery({
    queryKey: ['useGetSameTypeChallenge', type],
    queryFn: async () => {
      const res = await axios.get('/challenge/active', {
        params: {
          type,
        },
      });
      return activeChallengeResponse.parse(res.data.data);
    },
  });
};

export const getChallengeGoalQueryKey = (challengeId: string | undefined) => {
  return ['useGetChallengeGoal', challengeId];
};

export const useGetChallengeGoal = (challengeId: string | undefined) => {
  return useQuery({
    queryKey: getChallengeGoalQueryKey(challengeId),
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/goal`);
      return challengeGoalSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};

export const usePostChallengeGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      challengeId,
      goal,
    }: {
      challengeId: string;
      goal: string;
    }) => {
      const res = await axios.patch(`/challenge/${challengeId}/goal`, {
        goal,
      });
      return { data: res.data, challengeId };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getChallengeGoalQueryKey(data.challengeId),
      });
    },
  });
};

export const useGetUserChallengeInfo = () => {
  return useQuery({
    queryKey: ['user', 'challenge-info'],
    queryFn: async () => {
      const res = await axios.get('/user/challenge-info');
      return challengeUserInfoSchema.parse(res.data.data);
    },
  });
};

export const useGetChallengeValideUser = (challengeId: string | undefined) => {
  return useQuery({
    queryKey: ['challenge', challengeId, 'access'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/access`);
      return challengeValidUserSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};

export const usePostChallengeAttendance = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      missionId,
      link,
      review,
    }: {
      missionId: number;
      link: string;
      review: string;
    }) => {
      const res = await axios.post(`/attendance/${missionId}`, {
        link,
        review,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenge'],
      });
      return successCallback && successCallback();
    },
    onError: () => {
      return errorCallback && errorCallback();
    },
  });
};

export const usePatchChallengeAttendance = ({
  successCallback,
  errorCallback,
}: {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      attendanceId,
      link,
      status,
      result,
      comments,
      review,
      reviewIsVisible,
    }: {
      attendanceId: number;
      link?: string;
      status?: AttendanceStatus | null;
      result?: AttendanceResult | null;
      comments?: string;
      review?: string;
      reviewIsVisible?: boolean;
    }) => {
      const res = await axios.patch(`/attendance/${attendanceId}`, {
        link,
        status,
        result,
        comments,
        review,
        reviewIsVisible,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenge'],
      });
      queryClient.invalidateQueries({
        queryKey: getAdminProgramReviewQueryKey('MISSION_REVIEW'),
      });
      return successCallback && successCallback();
    },
    onError: (e) => {
      return errorCallback && errorCallback(e);
    },
  });
};

const reviewStatusSchema = z.object({
  reviewId: z.number().nullable(),
});

export const getChallengeReviewStatusQueryKey = (
  challengeId: number | undefined,
) => {
  return ['challenge', challengeId, 'review-status'];
};

// 챌린지 리뷰 작성 여부 조회
export const useGetChallengeReviewStatus = (
  challengeId: number | undefined,
) => {
  return useQuery({
    queryKey: getChallengeReviewStatusQueryKey(challengeId),
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/my/review-status`);
      return reviewStatusSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};
