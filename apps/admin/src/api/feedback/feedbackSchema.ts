import { z } from 'zod';

/**
 * LIVE 피드백(예약) 관련 Zod 스키마.
 *
 * BE 계약: lets-career-server `LC-3065-feat` (base `/api/v1`, origin/main 미병합).
 * 병합 전까지 MSW 목으로 동작시키며, 병합 후 VITE_ENABLE_MSW 를 끄면 실 API 로 전환된다.
 */

/** 피드백 예약 상태 */
export const feedbackStatusSchema = z.enum([
  'RESERVED',
  'COMPLETED',
  'CANCELED',
]);
export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;

/** 멘토/멘티 출석 상태 */
export const feedbackAttendanceStatusSchema = z.enum([
  'PENDING',
  'PRESENT',
  'ABSENT',
]);
export type FeedbackAttendanceStatus = z.infer<
  typeof feedbackAttendanceStatusSchema
>;

/** 멘토 슬롯 상태 */
export const feedbackSlotStatusSchema = z.enum(['OPEN', 'RESERVED']);
export type FeedbackSlotStatus = z.infer<typeof feedbackSlotStatusSchema>;

/** 예약 목록 행 (GET /admin/feedback) */
export const feedbackAdminVoSchema = z.object({
  feedbackId: z.number(),
  programTitle: z.string().default(''),
  mentorName: z.string(),
  menteeName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  createDate: z.string(),
  mentorStatus: feedbackAttendanceStatusSchema,
  menteeStatus: feedbackAttendanceStatusSchema,
  status: feedbackStatusSchema,
});
export type FeedbackAdminVo = z.infer<typeof feedbackAdminVoSchema>;

/** 예약 목록 응답 */
export const getAdminFeedbacksResponseSchema = z.object({
  feedbackList: z.array(feedbackAdminVoSchema),
});
export type GetAdminFeedbacksResponse = z.infer<
  typeof getAdminFeedbacksResponseSchema
>;

/** 예약 상세 (GET /admin/feedback/{feedbackId}) */
export const feedbackDetailAdminVoSchema = z.object({
  feedbackId: z.number(),
  programTitle: z.string().default(''),
  mentorName: z.string(),
  mentorEmail: z.string().nullable(),
  menteeName: z.string(),
  menteeEmail: z.string().nullable(),
  menteePhoneNum: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  createDate: z.string(),
  preQuestion: z.string().nullable(),
  meetingUrl: z.string().nullable(),
  mentorStatus: feedbackAttendanceStatusSchema,
  menteeStatus: feedbackAttendanceStatusSchema,
});
export type FeedbackDetailAdminVo = z.infer<typeof feedbackDetailAdminVoSchema>;

/** 예약 상세 응답 */
export const getAdminFeedbackDetailResponseSchema = z.object({
  feedbackInfo: feedbackDetailAdminVoSchema,
});
export type GetAdminFeedbackDetailResponse = z.infer<
  typeof getAdminFeedbackDetailResponseSchema
>;

/** 멘토 슬롯 (GET /admin/feedback/slot/{mentorId}) */
export const feedbackSlotVoSchema = z.object({
  feedbackSlotId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: feedbackSlotStatusSchema,
});
export type FeedbackSlotVo = z.infer<typeof feedbackSlotVoSchema>;

/** 멘토 슬롯 응답 */
export const getMentorFeedbackSlotsResponseSchema = z.object({
  feedbackSlotList: z.array(feedbackSlotVoSchema),
});
export type GetMentorFeedbackSlotsResponse = z.infer<
  typeof getMentorFeedbackSlotsResponseSchema
>;

/** 예약 목록 필터 (GET /admin/feedback query) — 모두 optional, 빈 값은 생략 */
export interface AdminFeedbackListParams {
  challengeIdList?: number[];
  mentorIdList?: number[];
  menteeIdList?: number[];
  /** 예약 날짜 범위 시작 (LocalDateTime ISO) */
  feedbackStartDate?: string;
  /** 예약 날짜 범위 끝 */
  feedbackEndDate?: string;
  /** 신청 날짜 범위 시작 */
  createStartDate?: string;
  /** 신청 날짜 범위 끝 */
  createEndDate?: string;
}

/** 멘토 슬롯 조회 범위 (GET /admin/feedback/slot/{mentorId} query) — optional */
export interface MentorFeedbackSlotParams {
  startDate?: string;
  endDate?: string;
  statusList?: FeedbackSlotStatus[];
}
