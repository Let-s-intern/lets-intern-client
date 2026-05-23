import { z } from 'zod';

export const feedbackStatusSchema = z.enum(['RESERVED', 'COMPLETED']);

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

export const mentorDetailSchema = z.object({
  challengeMentorInfo: challengeMentorInfoSchema,
});

export type MentorDetail = z.infer<typeof mentorDetailSchema>;

export const feedbackDetailSchema = z.object({
  feedbackInfo: z.object({
    feedbackId: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    meetingUrl: z.string().nullable(),
    status: feedbackStatusSchema,
  }),
});

export type FeedbackDetail = z.infer<typeof feedbackDetailSchema>;

export const feedbackSlotStatusSchema = z.enum(['OPEN', 'CLOSED', 'BOOKED']);

export const feedbackSlotSchema = z.object({
  feedbackSlotId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: feedbackSlotStatusSchema,
});

export type FeedbackSlot = z.infer<typeof feedbackSlotSchema>;

export const feedbackSlotListSchema = z.object({
  feedbackSlotList: z.array(feedbackSlotSchema),
});
