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
