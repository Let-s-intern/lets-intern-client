import { z } from 'zod';

export const feedbackStatusSchema = z.enum([
  'RESERVED',
  'CANCELED',
  'CHANGED',
  'DONE',
  'EXPIRED',
]);

export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;

export const liveFeedbackItemSchema = z.object({
  thumbnail: z.string(),
  desktopThumbnail: z.string(),
  missionTitle: z.string(),
  missionTh: z.number(),
  missionStartDate: z.string(),
  missionEndDate: z.string(),
  feedbackId: z.number().nullable(),
  feedbackStatus: feedbackStatusSchema.nullable(),
});

export type LiveFeedbackItem = z.infer<typeof liveFeedbackItemSchema>;

export const liveFeedbackListSchema = z.object({
  liveFeedbackList: z.array(liveFeedbackItemSchema),
});
