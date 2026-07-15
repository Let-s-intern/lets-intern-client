import { AttendanceResultEnum } from '@/schema';
import { z } from 'zod';

export const feedbackStatusSchema = z.enum(['RESERVED', 'COMPLETED']);

export const attendanceStatusSchema = z.enum([
  'PRESENT',
  'UPDATED',
  'LATE',
  'ABSENT',
]);

// 멘토/멘티 피드백 참여 상태
export const feedbackAttendanceStatusSchema = z.enum([
  'PENDING',
  'PRESENT',
  'ABSENT',
]);

export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;
export type FeedbackAttendanceStatus = z.infer<
  typeof feedbackAttendanceStatusSchema
>;

export const challengeMentorInfoSchema = z.object({
  nickname: z
    .string()
    .nullish()
    .transform((val) => val ?? '멘토명'),
  introduction: z
    .string()
    .nullish()
    .transform((val) => val ?? '등록된 멘토 소개글이 없습니다.'),
  profileImgUrl: z
    .string()
    .nullish()
    .transform((val) => val ?? ''),
});

export type ChallengeMentorInfo = z.infer<typeof challengeMentorInfoSchema>;

export const liveFeedbackItemSchema = z.object({
  thumbnail: z.string(),
  desktopThumbnail: z.string(),
  missionTitle: z.string(),
  missionId: z.number(),
  missionTh: z.number(),
  missionStartDate: z.string(),
  missionEndDate: z.string(),
  feedbackId: z.number().nullable(),
  feedbackStartDate: z.string().nullable(),
  feedbackEndDate: z.string().nullable(),
  feedbackStatus: feedbackStatusSchema.nullable(),
  attendanceStatus: attendanceStatusSchema.nullable(),
  attendanceResult: AttendanceResultEnum.nullable(),
  mentorStatus: feedbackAttendanceStatusSchema.nullable(),
  menteeStatus: feedbackAttendanceStatusSchema.nullable(),
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
    mentorStatus: feedbackAttendanceStatusSchema.nullable(),
    menteeStatus: feedbackAttendanceStatusSchema.nullable(),
    score: z.number().nullable(),
    review: z.string().nullable(),
    // 입장 페이지/모달 표시용(선택) — 일정 요약·상대방·자료.
    // BE 입장 응답 확정 전까지 optional.
    programTitle: z.string().nullish(),
    missionTh: z.number().nullish(),
    menteeName: z.string().nullish(),
    mentorName: z.string().nullish(),
    preQuestion: z.string().nullish(),
    attendanceUrl: z.string().nullish(),
  }),
});

export type FeedbackDetail = z.infer<typeof feedbackDetailSchema>;
export type FeedbackInfo = FeedbackDetail['feedbackInfo'];

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

export const writtenFeedbackItemSchema = z.object({
  thumbnail: z.string(),
  desktopThumbnail: z.string(),
  attendanceId: z.number(),
  missionId: z.number(),
  attendanceStatus: attendanceStatusSchema.nullable(),
  attendanceResult: z.string().nullable(),
  feedbackStatus: z
    .enum(['IN_PROGRESS', 'WAITING', 'CONFIRMED', 'COMPLETED'])
    .nullable(),
  attendanceLink: z.string().nullable(),
  missionTitle: z.string(),
  missionTh: z.number(),
  missionStartDate: z.string(),
  missionEndDate: z.string(),
});

export type WrittenFeedbackItem = z.infer<typeof writtenFeedbackItemSchema>;

export const writtenFeedbackListSchema = z.object({
  writtenFeedbackList: z.array(writtenFeedbackItemSchema),
});
