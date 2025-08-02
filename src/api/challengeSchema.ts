import dayjs from '@/lib/dayjs';
import {
  AttendanceResultEnum,
  AttendanceStatusEnum,
  ChallengePricePlanEnum,
  MissionStatusEnum,
} from '@/schema';
import { z } from 'zod';

export const challengeGoalSchema = z.object({
  goal: z.string().nullable(),
});

export const challengeUserInfoSchema = z.object({
  pass: z.boolean().nullable(),
});

export const challengeValidUserSchema = z.object({
  isAccessible: z.boolean().nullable(),
});

export const challengeMissionFeedbackListSchema = z.object({
  missionList: z.array(
    z.object({
      id: z.number(),
      title: z.string().nullish(),
      th: z.number(),
      startDate: z.string().datetime({ local: true }),
      endDate: z.string().datetime({ local: true }),
      challengeOptionCode: z.string().nullish(),
      challengeOptionTitle: z.string().nullish(),
    }),
  ),
});

export type ChallengeMissionFeedbackList = z.infer<
  typeof challengeMissionFeedbackListSchema
>;

export const FeedbackStatusEnum = z.enum([
  'WAITING', // 진행전
  'IN_PROGRESS', // 진행중
  'COMPLETED', // 진행완료
  'CONFIRMED', // 확인완료
]);

export type FeedbackStatus = z.infer<typeof FeedbackStatusEnum>;

export const FeedbackStatusMapping: Record<FeedbackStatus, string> = {
  WAITING: '진행전',
  IN_PROGRESS: '진행중',
  COMPLETED: '진행완료',
  CONFIRMED: '확인완료',
};

export const challengeMissionFeedbackAttendanceListSchema = z.object({
  attendanceList: z.array(
    z.object({
      id: z.number(),
      mentorId: z.number().nullable(),
      mentorName: z.string().nullable(),
      name: z.string(),
      major: z.string().optional().nullable(),
      wishJob: z.string().optional().nullable(),
      wishCompany: z.string().optional().nullable(),
      link: z.string().optional().nullable(),
      status: AttendanceStatusEnum.default('ABSENT'), // 제출현황: 미제출
      result: AttendanceResultEnum.default('WAITING'), // 확인여부: 확인중
      challengePricePlanType: ChallengePricePlanEnum.default('BASIC'),
      feedbackStatus: FeedbackStatusEnum.nullable().default('WAITING'), // 피드백 진행 상태: 진행전
    }),
  ),
});

/** 챌린지 나의 기록장 미션 피드백 */
export const challengeMissionFeedbackSchema = z.object({
  missionInfo: z.object({
    id: z.number(),
    th: z.number().nullish(),
    title: z.string().nullish(),
  }),
  attendanceInfo: z
    .object({
      link: z.string(),
      feedbackStatus: FeedbackStatusEnum.nullable().default('WAITING'),
      feedback: z.string().nullish(),
      mentorName: z.string().nullish(),
    })
    .nullish(),
});

export const feedbackAttendanceSchema = z.object({
  attendanceDetailVo: z.object({
    feedback: z.string().nullish(),
  }),
});

// GET /api/v1/challenge/{challengeId}/missions/{missionId} 나의 기록장 미션 상세
export const userChallengeMissionDetail = z
  .object({
    missionInfo: z.object({
      id: z.number(),
      th: z.number().nullable(),
      title: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      essentialContentsList: z.array(
        z.object({
          id: z.number(),
          title: z.string().nullable(),
          link: z.string().nullable(),
        }),
      ),
      additionalContentsList: z.array(
        z.object({
          id: z.number(),
          title: z.string().nullable(),
          link: z.string().nullable(),
        }),
      ),
      status: MissionStatusEnum,
      missionTag: z.string(),
      description: z.string(),
      guide: z.string(),
      templateLink: z.string(),
    }),
    attendanceInfo: z
      .object({
        submitted: z.boolean().default(false),
        id: z.number(),
        link: z.string().nullish(),
        comments: z.string().nullish(),
        status: z.string().nullish(),
        result: z.string().nullish(),
        feedbackStatus: FeedbackStatusEnum,
        review: z.string().nullish(),
        accountType: z.string().nullish(),
        accountNum: z.string().nullish(),
      })
      .nullish(),
  })
  .transform((data) => {
    return {
      missionInfo: {
        ...data.missionInfo,
        startDate: dayjs(data.missionInfo.startDate),
        endDate: dayjs(data.missionInfo.endDate),
      },
    };
  });

export type UserChallengeMissionDetail = z.infer<
  typeof userChallengeMissionDetail
>['missionInfo'];
