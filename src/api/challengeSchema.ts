import { z } from 'zod';
import {
  AttendanceResultEnum,
  AttendanceStatusEnum,
  ChallengePricePlanEnum,
} from './../schema';

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
      title: z.string().optional().nullable(),
      th: z.number(),
      startDate: z.string().datetime({ local: true }),
      endDate: z.string().datetime({ local: true }),
      challengeOptionCode: z.string().optional().nullable(),
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
  attendanceInfo: z.object({
    link: z.string(),
    feedbackStatus: FeedbackStatusEnum.nullable().default('WAITING'),
    feedback: z.string().nullish(),
    mentorName: z.string().nullish(),
  }),
});

export const feedbackAttendanceSchema = z.object({
  attendanceDetailVo: z.object({
    feedback: z.string().nullish(),
  }),
});
