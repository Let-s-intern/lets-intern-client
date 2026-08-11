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

/**
 * 현재 개설. 상태가 `OPEN` 인 개설만 담긴다.
 *
 * 기간이 지났어도 상태가 `OPEN` 이면 그대로 들어온다 — 만료 자동 종료 배치가
 * 아직 서버에 배선되어 있지 않기 때문이다. 목록에서 만료 여부를 따로 계산해 표시한다.
 */
export const adminCurrentOpeningSchema = z.object({
  openingId: z.number(),
  status: liveMentoringOpeningStatusSchema,
  durationPrices: z.array(
    z.object({ duration: z.number(), price: z.number() }),
  ),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
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

export const adminLiveMentoringListSchema = z.object({
  liveMentoringList: z.array(adminLiveMentoringSchema),
  pageInfo: z.object({
    /** 서버 `PageInfo` 는 0-based 다(요청 `page` 는 1-based). */
    pageNum: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});
export type AdminLiveMentoringList = z.infer<
  typeof adminLiveMentoringListSchema
>;
