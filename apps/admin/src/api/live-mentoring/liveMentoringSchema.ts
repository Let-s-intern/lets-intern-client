import { z } from 'zod';

/**
 * 1대1 라이브 멘토링 관리자 zod 스키마.
 *
 * 서버 `AdminLiveMentoringVo` / `GetAdminLiveMentoringsResponseDto` 를 파싱한다.
 * 상품(`liveMentoring`)과 개설(`opening`)은 서로 다른 상태 축이라 enum 도 분리해 둔다.
 */

export const liveMentoringCategorySchema = z.enum([
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
]);
export type LiveMentoringCategory = z.infer<typeof liveMentoringCategorySchema>;

/** 상품 상태 — 서버 `LiveMentoringStatus`. */
export const liveMentoringStatusSchema = z.enum([
  'DRAFT',
  'APPROVED',
  'INACTIVE',
]);
export type LiveMentoringStatus = z.infer<typeof liveMentoringStatusSchema>;

/** 개설 상태 — 서버 `LiveMentoringOpeningStatus`. */
export const liveMentoringOpeningStatusSchema = z.enum(['OPEN', 'CLOSED']);

/** 개설 종료 사유 — 서버 `LiveMentoringCloseReason`. */
export const liveMentoringCloseReasonSchema = z.enum([
  'PERIOD_EXPIRED',
  'ADMIN_FORCED',
  'MENTOR_CANCELED',
]);
export type LiveMentoringCloseReason = z.infer<
  typeof liveMentoringCloseReasonSchema
>;

/** 현재 개설. 상태가 `OPEN` 인 개설만 담긴다. */
export const adminCurrentOpeningSchema = z.object({
  openingId: z.number(),
  status: liveMentoringOpeningStatusSchema,
  durationPrices: z.array(
    z.object({ duration: z.number(), price: z.number() }),
  ),
  openedAt: z.string(),
  closedAt: z.string().nullable(),
  closeReason: liveMentoringCloseReasonSchema.nullable(),
  closedByUserId: z.number().nullable(),
  createDate: z.string(),
  lastModifiedDate: z.string(),
});
export type AdminCurrentOpening = z.infer<typeof adminCurrentOpeningSchema>;

export const adminLiveMentoringSchema = z.object({
  liveMentoringId: z.number(),
  mentorId: z.number(),
  mentorNickname: z.string().nullable(),
  mentorProfileImage: z.string().nullable(),
  title: z.string().nullable(),
  status: liveMentoringStatusSchema,
  categories: z.array(liveMentoringCategorySchema),
  /** 상세 페이지 저장 여부. 정상 제출 상품은 서버가 기본 골격을 만들어 두므로 true 다. */
  hasDetailPage: z.boolean(),
  createDate: z.string(),
  lastModifiedDate: z.string(),
  /** 활성 개설이 없거나 이미 종료됐으면 null. */
  currentOpening: adminCurrentOpeningSchema.nullable(),
});
export type AdminLiveMentoring = z.infer<typeof adminLiveMentoringSchema>;

/** 서버 `PageInfo`. `pageNum` 은 0-based 다(요청 `page` 는 1-based). */
export const liveMentoringPageInfoSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const adminLiveMentoringListSchema = z.object({
  liveMentoringList: z.array(adminLiveMentoringSchema),
  pageInfo: liveMentoringPageInfoSchema,
});
export type AdminLiveMentoringList = z.infer<
  typeof adminLiveMentoringListSchema
>;

/** 신청 상태 — 서버 `LiveMentoringApplicationStatus`. */
export const liveMentoringApplicationStatusSchema = z.enum([
  'PAYMENT_PENDING',
  'EXPIRED',
  'CANCELED',
  'CONFIRMED',
]);
export type LiveMentoringApplicationStatus = z.infer<
  typeof liveMentoringApplicationStatusSchema
>;

/**
 * 어드민 예약 관리 표가 쓰는 1대1 예약 한 건 — 서버 `AdminLiveMentoringReservationVo`.
 *
 * `reservationStartAt`/`reservationEndAt` 은 신청이 점유한 슬롯의 시작과 끝이다.
 * 60분 플랜은 연속한 슬롯 두 개를 한 구간으로 합쳐 내려오고, 점유한 슬롯이 없으면 null 이다.
 * `contactEmail` 은 신청서에 적은 연락용 이메일이라 계정 이메일(`menteeEmail`)과 다를 수 있다.
 */
/**
 * 출석 상태 — 서버 `FeedbackAttendanceStatus` 와 같은 값이다. 라이브 피드백
 * (`FeedbackAdminVo.mentorStatus`)과 같은 세 값을 쓴다.
 */
export const liveMentoringAttendanceStatusSchema = z.enum([
  'PENDING',
  'PRESENT',
  'ABSENT',
]);
export type LiveMentoringAttendanceStatus = z.infer<
  typeof liveMentoringAttendanceStatusSchema
>;

export const adminLiveMentoringReservationSchema = z.object({
  applicationId: z.number(),
  liveMentoringId: z.number(),
  productName: z.string().nullable(),
  mentorId: z.number(),
  mentorName: z.string().nullable(),
  mentorNickname: z.string().nullable(),
  mentorEmail: z.string().nullable(),
  menteeId: z.number(),
  menteeName: z.string().nullable(),
  menteeEmail: z.string().nullable(),
  menteePhoneNum: z.string().nullable(),
  contactEmail: z.string().nullable(),
  durationMinutes: z.number().nullable(),
  reservationStartAt: z.string().nullable(),
  reservationEndAt: z.string().nullable(),
  status: liveMentoringApplicationStatusSchema,
  createDate: z.string(),
  /** 사전 질문을 나중에 보내겠다고 미룬 신청. true 면 `questionContent` 는 비어 있다. */
  questionDeferred: z.boolean().nullable(),
  questionContent: z.string().nullable(),
  mentorStatus: liveMentoringAttendanceStatusSchema,
  menteeStatus: liveMentoringAttendanceStatusSchema,
});
export type AdminLiveMentoringReservation = z.infer<
  typeof adminLiveMentoringReservationSchema
>;

export const adminLiveMentoringReservationListSchema = z.object({
  reservationList: z.array(adminLiveMentoringReservationSchema),
  pageInfo: liveMentoringPageInfoSchema,
});
export type AdminLiveMentoringReservationList = z.infer<
  typeof adminLiveMentoringReservationListSchema
>;

/**
 * 어드민 참여자 탭이 쓰는 결제자 한 명 — 서버 `AdminLiveMentoringParticipantVo`.
 *
 * `paidAmount` 는 신청 시 확정된 결제 금액이라 환불해도 그대로다. 반대로 `refundAmount` 는
 * 결제 엔티티의 금액이라 환불 시 환불액으로 덮이므로 `refunded` 가 true 일 때만 환불액으로 읽는다.
 * 라이브 멘토링 환불은 `payment.isRefunded` 를 세우지 않아 환불 여부는 `refunded` 로만 판단한다.
 */
export const adminLiveMentoringParticipantSchema = z.object({
  applicationId: z.number(),
  paymentId: z.number().nullable(),
  liveMentoringId: z.number(),
  productName: z.string().nullable(),
  mentorId: z.number(),
  mentorName: z.string().nullable(),
  mentorNickname: z.string().nullable(),
  menteeId: z.number(),
  menteeName: z.string().nullable(),
  menteeEmail: z.string().nullable(),
  menteePhoneNum: z.string().nullable(),
  durationMinutes: z.number().nullable(),
  reservationStartAt: z.string().nullable(),
  reservationEndAt: z.string().nullable(),
  originalPrice: z.number().nullable(),
  productDiscount: z.number().nullable(),
  couponDiscount: z.number().nullable(),
  paidAmount: z.number().nullable(),
  couponId: z.number().nullable(),
  couponName: z.string().nullable(),
  status: liveMentoringApplicationStatusSchema,
  refunded: z.boolean().nullable(),
  refundAmount: z.number().nullable(),
  createDate: z.string(),
});
export type AdminLiveMentoringParticipant = z.infer<
  typeof adminLiveMentoringParticipantSchema
>;

export const adminLiveMentoringParticipantListSchema = z.object({
  participantList: z.array(adminLiveMentoringParticipantSchema),
  pageInfo: liveMentoringPageInfoSchema,
});
export type AdminLiveMentoringParticipantList = z.infer<
  typeof adminLiveMentoringParticipantListSchema
>;
