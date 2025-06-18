import { z } from 'zod';
import {
  AttendanceStatusEnum,
  ChallengePricePlanEnum,
  MissionStatusEnum,
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
  'WAITING',
  'IN_PROGRESS',
  'COMPLETED',
  'CONFIRMED',
]);

export type FeedbackStatus = z.infer<typeof FeedbackStatusEnum>;

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
      status: AttendanceStatusEnum,
      result: MissionStatusEnum,
      challengePricePlanType: ChallengePricePlanEnum,
      feedbackStatus: FeedbackStatusEnum.default('IN_PROGRESS'),
    }),
  ),
});
