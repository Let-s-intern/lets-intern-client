import {
  activeChallengeResponse,
  attendances,
  ChallengeIdPrimitive,
  challengeListSchema,
  challengeTitleSchema,
  ChallengeType,
  faqSchema,
  getChallengeIdPrimitiveSchema,
  getChallengeIdSchema,
  missionAdmin,
  myDailyMission as myDailyMissionSchema,
  Pageable,
  ProgramClassification,
  ProgramStatus,
  reviewTotalSchema,
  userChallengeMissionWithAttendance,
} from '@/schema';
import axios from '@/utils/axios';
import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  challengeApplicationSchema,
  challengeGoalSchema,
  challengeMissionFeedbackAttendanceListSchema,
  challengeMissionFeedbackListSchema,
  challengeMissionFeedbackSchema,
  challengeUserInfoSchema,
  challengeValidUserSchema,
  feedbackAttendanceSchema,
} from './challengeSchema';

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

export const useGetChallengeTitle = (challengeId?: number | string) => {
  return useQuery({
    queryKey: ['useGetChallengeTitle', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/title`);
      return challengeTitleSchema.parse(res.data.data);
    },
    enabled: !!challengeId,
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

// 챌린지 목록 조회

export const useGetChallengeList = ({
  typeList,
  statusList,
  type,
  pageable,
}: {
  typeList?: ProgramClassification[];
  statusList?: ProgramStatus[];
  type?: ChallengeType;
  pageable?: Pageable;
}) => {
  return useQuery({
    queryKey: ['challenge', typeList, statusList, type, pageable],
    queryFn: async () => {
      const res = await axios.get('/challenge', {
        params: {
          typeList,
          statusList,
          type,
          ...pageable,
        },
      });
      return challengeListSchema.parse(res.data.data);
    },
  });
};

export type ChallengeList = z.infer<typeof challengeListSchema>;

// 챌린지 목록 조회-홈 (노출상태, 정렬: 모집중(모집마감빠른순)-모집마감-모집예정순)
export const useGetChallengeHome = ({
  typeList,
  statusList,
  type,
  pageable,
}: {
  typeList?: ProgramClassification[];
  statusList?: ProgramStatus[];
  type?: ChallengeType;
  pageable?: Pageable;
}) => {
  return useQuery({
    queryKey: ['challenge', 'home', typeList, statusList, type, pageable],
    queryFn: async () => {
      const res = await axios.get('/challenge/home', {
        params: {
          typeList,
          statusList,
          type,
          ...pageable,
        },
      });
      return challengeListSchema.parse(res.data.data);
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

export const usePatchChallengeGoal = () => {
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
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      missionId,
      link,
      review,
    }: {
      missionId: number;
      link?: string;
      review?: string;
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

export const getChallengeAttendancesQueryKey = (
  challengeId: number | undefined,
  missionId: number | undefined,
) => {
  return ['admin', 'challenge', challengeId, 'attendances', missionId];
};

export const useGetChallengeAttendances = ({
  challengeId,
  detailedMissionId,
}: {
  challengeId?: number;
  detailedMissionId?: number;
}) => {
  return useQuery({
    queryKey: getChallengeAttendancesQueryKey(challengeId, detailedMissionId),
    enabled: Boolean(challengeId) && Boolean(detailedMissionId),
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/mission/${detailedMissionId}/attendances`,
      );
      return attendances.parse(res.data.data).attendanceList ?? [];
    },
  });
};

export const getClickCopy = async (fromId: number, toId: number) => {
  const res = await axiosV2.get(
    `/admin/challenge/copy-dashboard/${fromId}/${toId}`,
  );
  return res.data.data;
};

/** [멘토용] 챌린지 피드백 미션 전체 목록 /api/v1/challenge/{challengeId}/mission/feedback */
export const useMentorMissionFeedbackListQuery = (
  challengeId?: number,
  { enabled }: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ['useChallengeMissionFeedbackQuery', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}/mission/feedback`);
      return challengeMissionFeedbackListSchema.parse(res.data.data);
    },
    enabled,
  });
};

/** 챌린지 목표 제출 /api/v1/challenge/{challengeId}/goal */
export const useSubmitChallengeGoal = () => {
  return useMutation({
    mutationFn: async ({
      challengeId,
      goal,
    }: {
      challengeId: string | number;
      goal: string;
    }) => {
      const res = await axios.patch(`/challenge/${challengeId}/goal`, { goal });
      return res.data;
    },
  });
};

/** [어드민용] 챌린지 피드백 미션 전체 목록 /api/v2/admin/challenge/{challengeId}/mission/feedback */
export const useChallengeMissionFeedbackListQuery = (
  challengeId?: number,
  { enabled }: { enabled?: boolean } = {},
) => {
  return useQuery({
    queryKey: ['useChallengeMissionFeedbackQuery', challengeId],
    queryFn: async () => {
      const res = await axiosV2.get(
        `/admin/challenge/${challengeId}/mission/feedback`,
      );
      return challengeMissionFeedbackListSchema.parse(res.data.data);
    },
    enabled,
  });
};

// 챌린지 신청폼 조회 /api/v1/challenge/{challengeId}/application
export const useChallengeApplicationQuery = (programId?: string | number) => {
  return useQuery({
    queryKey: ['challenge', programId, 'application'],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${programId}/application`);
      return challengeApplicationSchema.parse(res.data.data);
    },
    enabled: !!programId,
  });
};

/** [어드민용] 챌린지 피드백 미션별 제출자 조회 /api/v2/admin/challenge/{challengeId}/mission/{missionId}/feedback/attendances */
export const ChallengeMissionFeedbackAttendanceQueryKey =
  'useChallengeMissionFeedbackAttendanceQuery';

export const useChallengeMissionFeedbackAttendanceQuery = ({
  challengeId,
  missionId,
  enabled,
}: {
  challengeId?: number | string;
  missionId?: number | string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [
      ChallengeMissionFeedbackAttendanceQueryKey,
      challengeId,
      missionId,
    ],
    queryFn: async () => {
      const res = await axiosV2.get(
        `/admin/challenge/${challengeId}/mission/${missionId}/feedback/attendances`,
      );
      return challengeMissionFeedbackAttendanceListSchema.parse(res.data.data);
    },
    enabled,
  });
};

/** [멘토용] 챌린지 피드백 미션별 제출자 조회 /api/v1/challenge/{challengeId}/mission/{missionId}/feedback/attendances */
export const MentorMissionFeedbackAttendanceQueryKey =
  'useMentorMissionFeedbackAttendanceQuery';

export const useMentorMissionFeedbackAttendanceQuery = ({
  challengeId,
  missionId,
  enabled,
}: {
  challengeId?: number | string;
  missionId?: number | string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [MentorMissionFeedbackAttendanceQueryKey, challengeId, missionId],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/mission/${missionId}/feedback/attendances`,
      );
      return challengeMissionFeedbackAttendanceListSchema.parse(res.data.data);
    },
    enabled,
  });
};

/** 챌린지 미션 전체 목록 /api/v2/admin/challenge/{challengeId}/mission */
export const useChallengeMissionListQuery = (challengeId?: string | number) => {
  return useQuery({
    queryKey: ['useChallengeMissionListQuery', challengeId],
    queryFn: async () => {
      const res = await axiosV2.get(`/admin/challenge/${challengeId}/mission`);
      return missionAdmin.parse(res.data.data);
    },
    enabled: !!challengeId,
  });
};

/** 챌린지 미션 attendanceInfo 조회 /api/v1/challenge/{challengeId}/missions/{missionId} */
export const ChallengeMissionQueryKey = 'useChallengeMissionAttendanceInfo';
export const useChallengeMissionAttendanceInfoQuery = ({
  challengeId,
  missionId,
  enabled = true,
}: {
  challengeId?: string | number;
  missionId?: string | number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [ChallengeMissionQueryKey, challengeId, missionId],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/missions/${missionId}`,
      );
      return userChallengeMissionWithAttendance.parse(res.data.data);
    },
    enabled: !!challengeId && !!missionId && enabled,
  });
};

/** 챌린지 나의 기록장 미션 피드백 조회 /api/v1/challenge/{challengeId}/missions/{missionId}/feedback */
export const useChallengeMissionFeedbackQuery = ({
  challengeId,
  missionId,
}: {
  challengeId: string | number;
  missionId: string | number;
}) => {
  return useQuery({
    queryKey: ['useChallengeMissionFeedback', challengeId, missionId],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/missions/${missionId}/feedback`,
      );
      return challengeMissionFeedbackSchema.parse(res.data.data);
    },
    enabled: !!challengeId && !!missionId,
  });
};

/** [멘토용] 챌린지 피드백 미션별 제출자 상세 조회 /api/v1/challenge/{challengeId}/mission/{missionId}/feedback/attendances/{attendanceId} */
export const FeedbackAttendanceQueryKey = 'useFeedbackAttendanceQuery';

export const useFeedbackAttendanceQuery = ({
  challengeId,
  missionId,
  attendanceId,
}: {
  challengeId?: string | number;
  missionId?: string | number;
  attendanceId?: string | number;
}) => {
  return useQuery({
    queryKey: [
      FeedbackAttendanceQueryKey,
      challengeId,
      missionId,
      attendanceId,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/mission/${missionId}/feedback/attendances/${attendanceId}`,
      );
      return feedbackAttendanceSchema.parse(res.data.data);
    },
    enabled: !!challengeId && !!missionId && !!attendanceId,
  });
};

/** GET 챌린지 나의 기록장 데일리 미션 /api/v1/challenge/{challengeId}/my/daily-mission */
export const useChallengeMyDailyMission = (
  programId?: string | number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    enabled: !!programId && options?.enabled,
    queryKey: ['useChallengeDailyMission', programId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${programId}/my/daily-mission`);
      return myDailyMissionSchema.parse(res.data.data);
    },
  });
};
