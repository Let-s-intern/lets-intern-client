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

/** 백엔드 `LiveMentoringDuration` enum(`MINUTES_30(30)`, `MINUTES_60(60)`) 기준 — 50이 아니라 60이다. */
export const liveMentoringDurationSchema = z.union([
  z.literal(30),
  z.literal(60),
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

/**
 * 오픈 설정 화면에서 보여주는 경력 1건 — 백엔드 `UserCareerVo` 형태를 그대로 따른다.
 * 상세 페이지 템플릿용 `liveMentoringCareerSchema`(company/position/period/visible)와는 다른 타입:
 * 이 필드들은 프로필(UserCareer) 도메인 소유라 오픈 설정 화면에서는 조회만 되고 수정할 수 없다.
 */
export const liveMentoringSettingsCareerSchema = z.object({
  id: z.number(),
  company: z.string().nullable(),
  field: z.string().nullable(),
  job: z.string().nullable(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  employmentType: z.string().nullable(),
  /** YearMonth 형식, 예: "2020-01" */
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isAddedByAdmin: z.boolean(),
});
export type LiveMentoringSettingsCareer = z.infer<
  typeof liveMentoringSettingsCareerSchema
>;

/**
 * 오픈 설정(메타) (PRD §5 S3-a).
 * `nickname/profileImage/introduction/careers`는 프로필 도메인에서 참조만 해오는 읽기 전용 필드다 —
 * PUT 요청 바디에는 포함되지 않는다(`liveMentoringSettingsUpdateSchema` 참고).
 */
export const liveMentoringSettingsSchema = z.object({
  nickname: z.string().nullable(),
  profileImage: z.string().nullable(),
  introduction: z.string().nullable(),
  careers: z.array(liveMentoringSettingsCareerSchema),
  /** 1대1 멘토링 타이틀(상품명). 한 번도 오픈한 적 없으면 null. */
  title: z.string().nullable(),
  /** 현재 오픈 중인지. 오픈 중에는 수정 불가. */
  isOpen: z.boolean(),
  /** 오픈한 타입(다중). */
  categories: z.array(liveMentoringCategorySchema),
  /** 오픈한 진행시간(다중). */
  durations: z.array(liveMentoringDurationSchema),
  /** 피드백 진행 일정(오픈 기간) 시작·종료일. 한 번도 오픈한 적 없으면 null. */
  feedbackStartDate: z.string().nullable(),
  feedbackEndDate: z.string().nullable(),
});
export type LiveMentoringSettings = z.infer<typeof liveMentoringSettingsSchema>;

/** PUT /mentor/live-mentoring/settings 요청 바디 — 백엔드가 실제로 받는 6개 필드뿐. */
export const liveMentoringSettingsUpdateSchema = z.object({
  title: z.string(),
  isOpen: z.boolean(),
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
});
export type LiveMentoringSettingsUpdate = z.infer<
  typeof liveMentoringSettingsUpdateSchema
>;

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
  title: z.string(),
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
