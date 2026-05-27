import { z } from 'zod';

/**
 * BE FeedbackSlotStatus enum 1:1 매핑.
 * - OPEN: 멘토가 열어둔 슬롯, 멘티 예약 가능
 * - RESERVED: 멘티가 예약 완료한 슬롯, 멘토는 변경 불가
 */
export const feedbackSlotStatusSchema = z.enum(['OPEN', 'RESERVED']);
export type FeedbackSlotStatus = z.infer<typeof feedbackSlotStatusSchema>;

/**
 * BE FeedbackSlotVo (record) 1:1 매핑.
 * BE는 `LocalDateTime`을 ISO 문자열 형태로 직렬화한다.
 */
export const feedbackSlotSchema = z.object({
  feedbackSlotId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: feedbackSlotStatusSchema,
});
export type FeedbackSlot = z.infer<typeof feedbackSlotSchema>;

/**
 * BE GetMentorFeedbackSlotsResponseDto 응답 매핑.
 * 응답 키는 BE record 기반 camelCase이므로 axios 인터셉터의 snake→camel 변환이 필요 없다.
 */
export const getMentorFeedbackSlotsResponseSchema = z.object({
  feedbackSlotList: z.array(feedbackSlotSchema),
});
export type GetMentorFeedbackSlotsResponse = z.infer<
  typeof getMentorFeedbackSlotsResponseSchema
>;

/**
 * BE CreateFeedbackSlotRequestDto (record) 1:1 매핑.
 * POST 본문은 `Array<{startDate, endDate}>`로 다건 일괄 생성한다.
 */
export const createFeedbackSlotRequestSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});
export type CreateFeedbackSlotRequest = z.infer<
  typeof createFeedbackSlotRequestSchema
>;

/**
 * BE FeedbackStatus enum 1:1 매핑.
 * - RESERVED: 예약 완료, 시작 전 또는 진행 중
 * - COMPLETED: 진행 완료 (멘토/멘티 정상 참가)
 * - CANCELED: 취소 (멘토/멘티 불참 또는 명시적 취소)
 */
export const feedbackStatusSchema = z.enum([
  'RESERVED',
  'COMPLETED',
  'CANCELED',
]);
export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;

/**
 * BE FeedbackVo 1:1 매핑.
 * `meetingUrl`은 BE 미배포 영역으로 현재는 항상 null로 내려올 수 있음.
 */
export const feedbackSchema = z.object({
  feedbackId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  meetingUrl: z.string().nullable(),
  status: feedbackStatusSchema,
});
export type Feedback = z.infer<typeof feedbackSchema>;

/**
 * BE GetFeedbackDetailResponseDto 응답 매핑.
 * `GET /api/v1/feedback/{feedbackId}` 응답 구조.
 */
export const getFeedbackDetailResponseSchema = z.object({
  feedbackInfo: feedbackSchema,
});
export type GetFeedbackDetailResponse = z.infer<
  typeof getFeedbackDetailResponseSchema
>;

/**
 * BE AttendanceStatus enum 1:1 매핑 (서면 제출 상태).
 * - PRESENT: 제출 완료
 * - UPDATED: 제출 후 수정
 * - LATE: 지각 제출
 * - ABSENT: 미제출
 */
export const attendanceStatusSchema = z.enum([
  'PRESENT',
  'UPDATED',
  'LATE',
  'ABSENT',
]);
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;

/**
 * BE FeedbackAttendanceStatus enum 1:1 매핑 (라이브 출석, 신규).
 * 멘토/멘티 각각의 라이브 세션 참석 상태.
 * - PENDING: 대기 (아직 마킹 안 됨)
 * - PRESENT: 참석
 * - ABSENT: 불참
 */
export const feedbackAttendanceStatusSchema = z.enum([
  'PENDING',
  'PRESENT',
  'ABSENT',
]);
export type FeedbackAttendanceStatus = z.infer<
  typeof feedbackAttendanceStatusSchema
>;

/**
 * BE FeedbackMentorVo 1:1 매핑 (멘토 목록 item).
 * `GET /feedback/mentor` 의 `feedbackList` 원소.
 * - `meetingUrl`은 BE 미배포 영역으로 null 가능.
 * - enum 필드(mentorStatus/menteeStatus/status)는 BE가 항상 채운다.
 */
export const feedbackMentorSchema = z.object({
  feedbackId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  meetingUrl: z.string().nullable(),
  mentorStatus: feedbackAttendanceStatusSchema,
  menteeStatus: feedbackAttendanceStatusSchema,
  status: feedbackStatusSchema,
  programTitle: z.string(),
  menteeName: z.string(),
});
export type FeedbackMentor = z.infer<typeof feedbackMentorSchema>;

/**
 * BE GetMentorFeedbacksResponseDto 응답 매핑.
 * `GET /feedback/mentor` 응답 구조.
 */
export const getMentorFeedbacksResponseSchema = z.object({
  feedbackList: z.array(feedbackMentorSchema),
});
export type GetMentorFeedbacksResponse = z.infer<
  typeof getMentorFeedbacksResponseSchema
>;

/**
 * BE FeedbackDetailMentorVo 1:1 매핑 (멘토 상세).
 * `GET /feedback/mentor/{feedbackId}` 의 `feedbackInfo`.
 * 멘토 목록 VO의 상위집합 + 멘티 희망정보·사전질문·출석 URL 포함.
 */
export const feedbackDetailMentorSchema = z.object({
  feedbackId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  meetingUrl: z.string().nullable(),
  status: feedbackStatusSchema,
  programTitle: z.string(),
  attendanceUrl: z.string(),
  attendanceStatus: attendanceStatusSchema,
  menteeName: z.string(),
  menteeWishField: z.string().nullable(),
  menteeWishIndustry: z.string().nullable(),
  menteeWishCompany: z.string().nullable(),
  preQuestion: z.string().nullable(),
  mentorStatus: feedbackAttendanceStatusSchema,
  menteeStatus: feedbackAttendanceStatusSchema,
});
export type FeedbackDetailMentor = z.infer<typeof feedbackDetailMentorSchema>;

/**
 * BE GetMentorFeedbackDetailResponseDto 응답 매핑.
 * `GET /feedback/mentor/{feedbackId}` 응답 구조.
 */
export const getMentorFeedbackDetailResponseSchema = z.object({
  feedbackInfo: feedbackDetailMentorSchema,
});
export type GetMentorFeedbackDetailResponse = z.infer<
  typeof getMentorFeedbackDetailResponseSchema
>;

/**
 * 멘토 PATCH 요청 본문.
 * 멘토는 멘티 출석 상태(`menteeStatus`)만 수정할 수 있다.
 */
export const updateFeedbackByMentorRequestSchema = z.object({
  menteeStatus: feedbackAttendanceStatusSchema,
});
export type UpdateFeedbackByMentorRequest = z.infer<
  typeof updateFeedbackByMentorRequestSchema
>;
