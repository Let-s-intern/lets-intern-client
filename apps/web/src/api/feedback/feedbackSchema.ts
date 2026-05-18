import { z } from 'zod';

export const feedbackStatusSchema = z.enum([
  'RESERVED',
  'CANCELED',
  'CHANGED',
  'DONE',
  'EXPIRED',
]);

export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;

export const challengeMentorInfoSchema = z.object({
  nickname: z.string(),
  introduction: z.string(),
  profileImgUrl: z.string(),
});

export type ChallengeMentorInfo = z.infer<typeof challengeMentorInfoSchema>;

export const liveFeedbackItemSchema = z.object({
  thumbnail: z.string(),
  desktopThumbnail: z.string(),
  missionTitle: z.string(),
  missionTh: z.number(),
  missionStartDate: z.string(),
  missionEndDate: z.string(),
  feedbackId: z.number().nullable(),
  feedbackStatus: feedbackStatusSchema.nullable(),
  mentorInfo: challengeMentorInfoSchema.nullish(),
});

export type LiveFeedbackItem = z.infer<typeof liveFeedbackItemSchema>;

export const liveFeedbackListSchema = z.object({
  liveFeedbackList: z.array(liveFeedbackItemSchema),
});
