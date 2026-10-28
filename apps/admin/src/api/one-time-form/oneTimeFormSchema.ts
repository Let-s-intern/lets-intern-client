import { z } from 'zod';

/**
 * 일회성 폼 어드민 API 스키마.
 *
 * 계약 `.claude/tasks/memos/일회성-폼-결제-API계약.md` 9절(A1~A8)과 1:1 이다.
 * 이름은 계약 13.1 표를 따른다.
 * 요청 스키마의 길이·형식 제한은 계약 5.6 의 서버 `@Valid` 조건과 같다.
 */

/** 계약 5.3. 저장된 질문의 형식은 바꿀 수 없다(A6 `ONE_TIME_FORM_QUESTION_TYPE_LOCKED`). */
export const oneTimeFormQuestionTypeSchema = z.enum([
  'SHORT_TEXT',
  'LONG_TEXT',
  'RADIO',
  'DROPDOWN',
  'CHECKBOX',
  'DATE',
  'NUMBER',
  'URL',
  'IMAGE',
  'FILE',
]);
export type OneTimeFormQuestionType = z.infer<
  typeof oneTimeFormQuestionTypeSchema
>;

/** 선택지가 있어야 하는 형식. 나머지 형식의 `choices` 는 서버가 null 로 저장한다. */
export const CHOICE_QUESTION_TYPES: readonly OneTimeFormQuestionType[] = [
  'RADIO',
  'DROPDOWN',
  'CHECKBOX',
];

/** 계약 5.4. SINGLE 은 하나만, MULTIPLE 은 여러 개. */
export const oneTimeFormOptionSelectTypeSchema = z.enum(['SINGLE', 'MULTIPLE']);
export type OneTimeFormOptionSelectType = z.infer<
  typeof oneTimeFormOptionSelectTypeSchema
>;

/** 계약 5.6. 소문자·숫자를 하이픈 하나로 잇는다. */
export const ONE_TIME_FORM_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const priceSchema = z.number().int().nonnegative();

/* ---------- A1 목록 ---------- */

export const adminOneTimeFormListItemSchema = z.object({
  formId: z.number(),
  title: z.string(),
  slug: z.string(),
  isVisible: z.boolean(),
  isPaid: z.boolean(),
  basePrice: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  /** 취소 포함 전체 신청 수 */
  applicationCount: z.number(),
  createDate: z.string(),
});
export type AdminOneTimeFormListItem = z.infer<
  typeof adminOneTimeFormListItemSchema
>;

export const adminOneTimeFormListSchema = z.object({
  forms: z.array(adminOneTimeFormListItemSchema),
});
export type AdminOneTimeFormList = z.infer<typeof adminOneTimeFormListSchema>;

/* ---------- A3 상세 ---------- */

export const adminOneTimeFormSchema = z.object({
  formId: z.number(),
  title: z.string(),
  slug: z.string(),
  categoryText: z.string().nullable(),
  scheduleText: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  isVisible: z.boolean(),
  startDate: z.string(),
  endDate: z.string(),
  /** 저장된 값 그대로. null 이면 신청 마감까지 취소할 수 있다 */
  cancelDeadline: z.string().nullable(),
  isPaid: z.boolean(),
  basePrice: z.number(),
  paymentProductName: z.string().nullable(),
  completionMessage: z.string().nullable(),
  applicationCount: z.number(),
  /** 공개 중이거나 신청이 있으면 true. slug 를 바꿀 수 없다 */
  isSlugLocked: z.boolean(),
  createDate: z.string(),
});
export type AdminOneTimeForm = z.infer<typeof adminOneTimeFormSchema>;

export const adminOneTimeFormQuestionSchema = z.object({
  questionId: z.number(),
  type: oneTimeFormQuestionTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  isRequired: z.boolean(),
  /** 선택형(RADIO, DROPDOWN, CHECKBOX)이면 배열, 아니면 null */
  choices: z.array(z.string()).nullable(),
  sortOrder: z.number(),
});
export type AdminOneTimeFormQuestion = z.infer<
  typeof adminOneTimeFormQuestionSchema
>;

export const adminOneTimeFormOptionSchema = z.object({
  optionId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  additionalPrice: z.number(),
  badge: z.string().nullable(),
  isVisible: z.boolean(),
  sortOrder: z.number(),
});
export type AdminOneTimeFormOption = z.infer<
  typeof adminOneTimeFormOptionSchema
>;

export const adminOneTimeFormOptionGroupSchema = z.object({
  optionGroupId: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  selectType: oneTimeFormOptionSelectTypeSchema,
  isRequired: z.boolean(),
  sortOrder: z.number(),
  options: z.array(adminOneTimeFormOptionSchema),
});
export type AdminOneTimeFormOptionGroup = z.infer<
  typeof adminOneTimeFormOptionGroupSchema
>;

export const adminOneTimeFormDetailSchema = z.object({
  form: adminOneTimeFormSchema,
  questions: z.array(adminOneTimeFormQuestionSchema),
  optionGroups: z.array(adminOneTimeFormOptionGroupSchema),
});
export type AdminOneTimeFormDetail = z.infer<
  typeof adminOneTimeFormDetailSchema
>;

/* ---------- A2 생성 / A4 수정 ---------- */

/** A2·A4 본문. A4 는 보낸 값으로 모두 덮어쓴다. `thumbnailUrl: null` 은 썸네일 삭제 */
export const saveOneTimeFormRequestSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(3).max(50).regex(ONE_TIME_FORM_SLUG_PATTERN),
  categoryText: z.string().max(30).nullable(),
  scheduleText: z.string().max(50).nullable(),
  thumbnailUrl: z.string().max(500).nullable(),
  isVisible: z.boolean(),
  startDate: z.string(),
  endDate: z.string(),
  cancelDeadline: z.string().nullable(),
  isPaid: z.boolean(),
  basePrice: priceSchema,
  paymentProductName: z.string().max(100).nullable(),
  completionMessage: z.string().max(1000).nullable(),
});
export type SaveOneTimeFormRequest = z.infer<
  typeof saveOneTimeFormRequestSchema
>;

export const createOneTimeFormResponseSchema = z.object({
  formId: z.number(),
});
export type CreateOneTimeFormResponse = z.infer<
  typeof createOneTimeFormResponseSchema
>;

/* ---------- A6 질문 일괄 저장 ---------- */

/** `questionId: null` 은 생성. 배열 순서가 `sortOrder` 다 */
export const saveOneTimeFormQuestionSchema = z.object({
  questionId: z.number().nullable(),
  type: oneTimeFormQuestionTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  isRequired: z.boolean(),
  choices: z.array(z.string().max(100)).max(50).nullable(),
});
export type SaveOneTimeFormQuestion = z.infer<
  typeof saveOneTimeFormQuestionSchema
>;

export const saveOneTimeFormQuestionsRequestSchema = z.object({
  questions: z.array(saveOneTimeFormQuestionSchema),
});
export type SaveOneTimeFormQuestionsRequest = z.infer<
  typeof saveOneTimeFormQuestionsRequestSchema
>;

export const adminOneTimeFormQuestionsSchema = z.object({
  questions: z.array(adminOneTimeFormQuestionSchema),
});
export type AdminOneTimeFormQuestions = z.infer<
  typeof adminOneTimeFormQuestionsSchema
>;

/* ---------- A7 옵션 그룹 일괄 저장 ---------- */

export const saveOneTimeFormOptionSchema = z.object({
  optionId: z.number().nullable(),
  name: z.string().min(1).max(100),
  description: z.string().max(200).nullable(),
  additionalPrice: priceSchema,
  badge: z.string().max(20).nullable(),
  isVisible: z.boolean(),
});
export type SaveOneTimeFormOption = z.infer<typeof saveOneTimeFormOptionSchema>;

/** id 규칙은 A6 과 같다. 그룹 배열 순서와 그룹 안 옵션 배열 순서가 각각 `sortOrder` 다 */
export const saveOneTimeFormOptionGroupSchema = z.object({
  optionGroupId: z.number().nullable(),
  title: z.string().min(1).max(100),
  description: z.string().max(300).nullable(),
  selectType: oneTimeFormOptionSelectTypeSchema,
  isRequired: z.boolean(),
  options: z.array(saveOneTimeFormOptionSchema),
});
export type SaveOneTimeFormOptionGroup = z.infer<
  typeof saveOneTimeFormOptionGroupSchema
>;

export const saveOneTimeFormOptionGroupsRequestSchema = z.object({
  optionGroups: z.array(saveOneTimeFormOptionGroupSchema),
});
export type SaveOneTimeFormOptionGroupsRequest = z.infer<
  typeof saveOneTimeFormOptionGroupsRequestSchema
>;

export const adminOneTimeFormOptionGroupsSchema = z.object({
  optionGroups: z.array(adminOneTimeFormOptionGroupSchema),
});
export type AdminOneTimeFormOptionGroups = z.infer<
  typeof adminOneTimeFormOptionGroupsSchema
>;

/* ---------- 신청 공통(계약 6절) ---------- */

/** 계약 6.1. 문자열(단답·장문·라디오·드롭다운·날짜·URL), 문자열 배열(체크박스), 숫자, 첨부 `{ key, name }` */
export const oneTimeFormAnswerValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.number(),
  z.object({ key: z.string(), name: z.string() }),
]);
export type OneTimeFormAnswerValue = z.infer<
  typeof oneTimeFormAnswerValueSchema
>;

/** 질문 ID(문자열)를 키로 하는 답 객체 */
export const oneTimeFormAnswersSchema = z.record(
  z.string(),
  oneTimeFormAnswerValueSchema,
);
export type OneTimeFormAnswers = z.infer<typeof oneTimeFormAnswersSchema>;

/** 계약 6.2. 신청 시점 옵션 스냅샷 항목 */
export const oneTimeFormSelectedOptionSchema = z.object({
  optionGroupId: z.number(),
  groupTitle: z.string(),
  optionId: z.number(),
  optionName: z.string(),
  additionalPrice: z.number(),
});
export type OneTimeFormSelectedOption = z.infer<
  typeof oneTimeFormSelectedOptionSchema
>;

/* ---------- A8 신청자 목록 ---------- */

export const adminOneTimeFormApplicationFormSchema = z.object({
  formId: z.number(),
  title: z.string(),
  slug: z.string(),
  isPaid: z.boolean(),
});

/** CSV 열 머리용. 삭제된 질문도 오고, `sortOrder` 는 삭제 직전 값이다 */
export const adminOneTimeFormApplicationQuestionSchema = z.object({
  questionId: z.number(),
  type: oneTimeFormQuestionTypeSchema,
  title: z.string(),
  sortOrder: z.number(),
  isDeleted: z.boolean(),
});
export type AdminOneTimeFormApplicationQuestion = z.infer<
  typeof adminOneTimeFormApplicationQuestionSchema
>;

export const adminOneTimeFormApplicationOptionGroupSchema = z.object({
  optionGroupId: z.number(),
  title: z.string(),
  sortOrder: z.number(),
  isDeleted: z.boolean(),
});

export const adminOneTimeFormApplicationPaymentSchema = z.object({
  paymentId: z.number(),
  orderId: z.string(),
  paidAmount: z.number(),
  refundAmount: z.number(),
});

/** 조회 시점의 계정 프로필. 프로필 필드는 비어 있으면 null */
export const adminOneTimeFormApplicationUserSchema = z.object({
  userId: z.number(),
  email: z.string().nullable(),
  university: z.string().nullable(),
  major: z.string().nullable(),
  grade: z.string().nullable(),
  wishField: z.string().nullable(),
  wishJob: z.string().nullable(),
  wishIndustry: z.string().nullable(),
  inflowPath: z.string().nullable(),
  marketingAgree: z.boolean(),
});

/** A8 `applications[]` 항목. A9 `application` 도 같은 형태다 */
export const adminOneTimeFormApplicationSchema = z.object({
  applicationId: z.number(),
  createDate: z.string(),
  isCanceled: z.boolean(),
  canceledAt: z.string().nullable(),
  name: z.string(),
  email: z.string(),
  phoneNum: z.string(),
  selectedOptions: z.array(oneTimeFormSelectedOptionSchema),
  /** 무료 폼이면 null */
  payment: adminOneTimeFormApplicationPaymentSchema.nullable(),
  /** 탈퇴 등으로 계정이 없으면 null */
  user: adminOneTimeFormApplicationUserSchema.nullable(),
  utmSource: z.string().nullable(),
  utmMedium: z.string().nullable(),
  utmCampaign: z.string().nullable(),
  utmContent: z.string().nullable(),
  utmTerm: z.string().nullable(),
  referrer: z.string().nullable(),
  answers: oneTimeFormAnswersSchema,
});
export type AdminOneTimeFormApplication = z.infer<
  typeof adminOneTimeFormApplicationSchema
>;

/** 취소 포함 전체, 신청일시 내림차순 */
export const adminOneTimeFormApplicationsSchema = z.object({
  form: adminOneTimeFormApplicationFormSchema,
  questions: z.array(adminOneTimeFormApplicationQuestionSchema),
  optionGroups: z.array(adminOneTimeFormApplicationOptionGroupSchema),
  applications: z.array(adminOneTimeFormApplicationSchema),
});
export type AdminOneTimeFormApplications = z.infer<
  typeof adminOneTimeFormApplicationsSchema
>;

/* ---------- A9 신청 상세 ---------- */

/** `questions`, `optionGroups` 는 A8 과 같이 삭제된 것까지 온다. `application` 은 A8 항목과 같은 형태 */
export const adminOneTimeFormApplicationDetailSchema = z.object({
  form: adminOneTimeFormApplicationFormSchema,
  questions: z.array(adminOneTimeFormApplicationQuestionSchema),
  optionGroups: z.array(adminOneTimeFormApplicationOptionGroupSchema),
  application: adminOneTimeFormApplicationSchema,
});
export type AdminOneTimeFormApplicationDetail = z.infer<
  typeof adminOneTimeFormApplicationDetailSchema
>;

/* ---------- A10 첨부 열람 ---------- */

/** 10분 만료 서명 URL. 이미지 미리보기도 이 URL 을 쓴다 */
export const oneTimeFormFileUrlSchema = z.object({
  url: z.string(),
});
export type OneTimeFormFileUrl = z.infer<typeof oneTimeFormFileUrlSchema>;
