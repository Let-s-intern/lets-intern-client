import { z } from 'zod';

/**
 * 1대1 라이브 멘토링 멘토 설정 zod 스키마.
 *
 * 공유 목 데이터(`@letscareer/mocks`)가 서빙하는 MSW 응답을 파싱한다.
 * 공개 앱(`apps/web/src/api/live-mentoring/liveMentoringSchema.ts`)과
 * 겹치는 타입(카테고리·진행시간·이력·체크리스트·템플릿)은 **동일 형태**를 유지한다.
 */

export const liveMentoringCategorySchema = z.enum([
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
]);
export type LiveMentoringCategory = z.infer<typeof liveMentoringCategorySchema>;

export const liveMentoringDurationSchema = z.union([
  z.literal(30),
  z.literal(50),
]);
export type LiveMentoringDuration = z.infer<typeof liveMentoringDurationSchema>;

/** 멘토 이력 1건 (노출 선택 가능) — web과 동일 형태. */
export const liveMentoringCareerSchema = z.object({
  company: z.string(),
  position: z.string(),
  period: z.string(),
  visible: z.boolean(),
});
export type LiveMentoringCareer = z.infer<typeof liveMentoringCareerSchema>;

/** 멘티 제출물 체크리스트 항목 (PRD §4.4) — web과 동일 형태. */
export const checklistItemSchema = z.object({
  id: z.number(),
  label: z.string(),
  mode: z.enum(['SHOWN', 'HIDDEN', 'CUSTOM']),
  customText: z.string().optional(),
});
export type ChecklistItem = z.infer<typeof checklistItemSchema>;

/** 타입별 기본 + 멘토 편집분 템플릿 (PRD §4.4) — web과 동일 형태. */
export const liveMentoringTemplateSchema = z.object({
  category: liveMentoringCategorySchema,
  // 편집 불가
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
  process: z.array(
    z.object({ step: z.number(), title: z.string(), desc: z.string() }),
  ),
  submissionSpec: z.object({ title: z.string(), desc: z.string() }),
  // 편집 가능
  introduction: z.string(),
  careers: z.array(liveMentoringCareerSchema),
  mentoringPoints: z.string(),
  reviews: z.object({
    visible: z.boolean(),
    selectedReviewIds: z.array(z.number()),
  }),
  checklist: z.array(checklistItemSchema),
});
export type LiveMentoringTemplate = z.infer<typeof liveMentoringTemplateSchema>;

/** 오픈 설정(메타) (PRD §5 S3-a). */
export const liveMentoringSettingsSchema = z.object({
  profileVisible: z.boolean(),
  mosaicEnabled: z.boolean(),
  mosaicBlur: z.number(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  introduction: z.string(),
  careers: z.array(liveMentoringCareerSchema),
  /** 오픈한 타입(다중). */
  categories: z.array(liveMentoringCategorySchema),
  /** 오픈한 진행시간(다중). */
  durations: z.array(liveMentoringDurationSchema),
  /** 피드백 진행 일정(오픈 기간) 시작·종료일. */
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
});
export type LiveMentoringSettings = z.infer<typeof liveMentoringSettingsSchema>;

/** 정산 현황 행 (PRD §4.6, read-only). */
export const settlementRowSchema = z.object({
  period: z.string(),
  completedCount: z.number(),
  grossAmount: z.number(),
  status: z.enum(['PENDING', 'PAID']),
});
export type SettlementRow = z.infer<typeof settlementRowSchema>;

/** 개별 정산 내역 항목 (완료 건별). */
export const settlementItemSchema = z.object({
  settlementId: z.number(),
  date: z.string(),
  menteeName: z.string(),
  category: liveMentoringCategorySchema,
  durationMin: liveMentoringDurationSchema,
  amount: z.number(),
  status: z.enum(['PENDING', 'PAID']),
});
export type SettlementItem = z.infer<typeof settlementItemSchema>;

export const settlementListResponseSchema = z.object({
  settlementList: z.array(settlementRowSchema),
  itemList: z.array(settlementItemSchema),
});
export type SettlementListResponse = z.infer<
  typeof settlementListResponseSchema
>;

/** 오픈 현황 행 (PRD §4.7, read-only). */
export const openStatusRowSchema = z.object({
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
  price: z.number(),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
  status: z.enum(['OPEN', 'CLOSED']),
  reservationCount: z.number(),
});
export type OpenStatusRow = z.infer<typeof openStatusRowSchema>;

export const openStatusListResponseSchema = z.object({
  openStatusList: z.array(openStatusRowSchema),
});
export type OpenStatusListResponse = z.infer<
  typeof openStatusListResponseSchema
>;
