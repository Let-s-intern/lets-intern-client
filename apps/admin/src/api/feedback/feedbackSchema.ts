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
  /**
   * 예약을 다른 날로 옮긴 횟수.
   * BE 미제공(예약 변경 내역 자체가 LC-3065 미구현) → 목 전용. 실 API 에 없으면 undefined → 0 으로 본다.
   * BE 도입 시 list VO 또는 별도 집계로 대체.
   */
  rescheduleCount: z.number().optional(),
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
  /** 멘티 후기 점수(1~5). 미작성 시 null. (Phase 1 추가) */
  score: z.number().nullable().optional(),
  /** 멘티 후기 내용. 미작성 시 null. (Phase 1 추가) */
  review: z.string().nullable().optional(),
  /** 후기 공개 여부. (Phase 1 추가) */
  reviewIsVisible: z.boolean().nullable().optional(),
});
export type FeedbackDetailAdminVo = z.infer<typeof feedbackDetailAdminVoSchema>;

/** 예약 상세 응답 */
export const getAdminFeedbackDetailResponseSchema = z.object({
  feedbackInfo: feedbackDetailAdminVoSchema,
});
export type GetAdminFeedbackDetailResponse = z.infer<
  typeof getAdminFeedbackDetailResponseSchema
>;

/**
 * [어드민] 라이브 피드백 수정 요청 (PATCH /admin/feedback/{feedbackId}).
 * 모든 필드 optional — 보낸 필드만 갱신한다.
 * score·review 는 `null` 을 명시 전송하면 기존 값을 초기화(미선택/빈 값)한다.
 * (undefined 는 PATCH 특성상 기존 값 유지)
 */
export interface UpdateAdminFeedbackReq {
  feedbackId: number;
  mentorStatus?: FeedbackAttendanceStatus;
  menteeStatus?: FeedbackAttendanceStatus;
  score?: number | null;
  review?: string | null;
  reviewIsVisible?: boolean;
}

/**
 * 예약 변경(이동) 내역 항목 (GET /admin/feedback/{feedbackId}/history).
 * 예약을 다른 날로 옮긴 기록 — 옮기기 전(이전) 예약 일시를 보여준다.
 */
export const feedbackHistoryItemSchema = z.object({
  id: z.number(),
  /** 변경(이동)한 시각 (ISO) */
  changedAt: z.string(),
  /** 이전(옮기기 전) 예약 일시 */
  beforeStartDate: z.string(),
  beforeEndDate: z.string(),
});
export type FeedbackHistoryItem = z.infer<typeof feedbackHistoryItemSchema>;

/** 예약 변경 내역 응답 */
export const getAdminFeedbackHistoryResponseSchema = z.object({
  historyList: z.array(feedbackHistoryItemSchema),
});
export type GetAdminFeedbackHistoryResponse = z.infer<
  typeof getAdminFeedbackHistoryResponseSchema
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
