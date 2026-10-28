import { z } from 'zod';

// 계약: .claude/tasks/memos/일회성-폼-결제-API계약.md 5절, 6절, 8절(U1~U4), 13.1절

// --- 공통 값 (계약 5.3 ~ 5.5) ---

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

export const oneTimeFormOptionSelectTypeSchema = z.enum(['SINGLE', 'MULTIPLE']);

export const oneTimeFormApplyStatusSchema = z.enum([
  'BEFORE',
  'OPEN',
  'CLOSED',
]);

// --- 답 JSON (계약 6.1) ---

const oneTimeFormAttachmentAnswerSchema = z.object({
  key: z.string(),
  name: z.string(),
});

export const oneTimeFormAnswerValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.number(),
  oneTimeFormAttachmentAnswerSchema,
]);

export const oneTimeFormAnswersSchema = z.record(
  z.string(),
  oneTimeFormAnswerValueSchema,
);

// --- 옵션 스냅샷 (계약 6.2) ---

export const oneTimeFormSelectedOptionSchema = z.object({
  optionGroupId: z.number(),
  groupTitle: z.string(),
  optionId: z.number(),
  optionName: z.string(),
  additionalPrice: z.number(),
});

// --- U1 폼 조회 ---

const oneTimeFormInfoSchema = z.object({
  formId: z.number(),
  slug: z.string(),
  title: z.string(),
  categoryText: z.string(),
  scheduleText: z.string(),
  thumbnailUrl: z.string().nullable(),
  isPaid: z.boolean(),
  basePrice: z.number(),
  paymentProductName: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  cancelDeadline: z.string(),
  applyStatus: oneTimeFormApplyStatusSchema,
  completionMessage: z.string().nullable(),
});

const oneTimeFormOptionSchema = z.object({
  optionId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  additionalPrice: z.number(),
  badge: z.string().nullable(),
  sortOrder: z.number(),
});

const oneTimeFormOptionGroupSchema = z.object({
  optionGroupId: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  selectType: oneTimeFormOptionSelectTypeSchema,
  isRequired: z.boolean(),
  sortOrder: z.number(),
  options: z.array(oneTimeFormOptionSchema),
});

const oneTimeFormQuestionSchema = z.object({
  questionId: z.number(),
  type: oneTimeFormQuestionTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  isRequired: z.boolean(),
  choices: z.array(z.string()).nullable(),
  sortOrder: z.number(),
});

export const oneTimeFormSchema = z.object({
  form: oneTimeFormInfoSchema,
  optionGroups: z.array(oneTimeFormOptionGroupSchema),
  questions: z.array(oneTimeFormQuestionSchema),
});

// --- U2 내 신청 (없으면 data: null) ---

const oneTimeFormAnswerItemSchema = z.object({
  questionId: z.number(),
  type: oneTimeFormQuestionTypeSchema,
  title: z.string(),
  isDeleted: z.boolean(),
  value: oneTimeFormAnswerValueSchema,
});

export const myOneTimeFormApplicationSchema = z
  .object({
    applicationId: z.number(),
    createDate: z.string(),
    isCanceled: z.boolean(),
    canceledAt: z.string().nullable(),
    isCancelable: z.boolean(),
    cancelDeadline: z.string(),
    name: z.string(),
    email: z.string(),
    phoneNum: z.string(),
    selectedOptions: z.array(oneTimeFormSelectedOptionSchema),
    payment: z
      .object({
        paidAmount: z.number(),
        refundAmount: z.number(),
        paymentMethod: z.string().nullable(),
      })
      .nullable(),
    answerItems: z.array(oneTimeFormAnswerItemSchema),
  })
  .nullable();

// --- U3 신청 생성 ---

export const createOneTimeFormApplicationRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phoneNum: z.string(),
  selectedOptionIds: z.array(z.number()),
  answers: oneTimeFormAnswersSchema,
  utmSource: z.string().nullish(),
  utmMedium: z.string().nullish(),
  utmCampaign: z.string().nullish(),
  utmContent: z.string().nullish(),
  utmTerm: z.string().nullish(),
  referrer: z.string().nullish(),
  // 무료 폼은 null(생략도 같음). 유료 0원은 paymentKey null (계약 7절)
  payment: z
    .object({
      paymentKey: z.string().nullable(),
      orderId: z.string(),
      amount: z.number(),
    })
    .nullish(),
});

export const createOneTimeFormApplicationResponseSchema = z.object({
  applicationId: z.number(),
  // 무료 폼이면 null, 0원이면 0
  paidAmount: z.number().nullable(),
  createDate: z.string(),
});

// --- U4 첨부 업로드 URL ---

export const oneTimeFormUploadUrlSchema = z.object({
  uploadUrl: z.string(),
  key: z.string(),
});

// --- 타입 ---

export type OneTimeFormQuestionType = z.infer<
  typeof oneTimeFormQuestionTypeSchema
>;
export type OneTimeFormOptionSelectType = z.infer<
  typeof oneTimeFormOptionSelectTypeSchema
>;
export type OneTimeFormApplyStatus = z.infer<
  typeof oneTimeFormApplyStatusSchema
>;
export type OneTimeFormAttachmentAnswer = z.infer<
  typeof oneTimeFormAttachmentAnswerSchema
>;
export type OneTimeFormAnswerValue = z.infer<
  typeof oneTimeFormAnswerValueSchema
>;
export type OneTimeFormAnswers = z.infer<typeof oneTimeFormAnswersSchema>;
export type OneTimeFormSelectedOption = z.infer<
  typeof oneTimeFormSelectedOptionSchema
>;
export type OneTimeForm = z.infer<typeof oneTimeFormSchema>;
export type OneTimeFormInfo = z.infer<typeof oneTimeFormInfoSchema>;
export type OneTimeFormOptionGroup = z.infer<
  typeof oneTimeFormOptionGroupSchema
>;
export type OneTimeFormOption = z.infer<typeof oneTimeFormOptionSchema>;
export type OneTimeFormQuestion = z.infer<typeof oneTimeFormQuestionSchema>;
export type MyOneTimeFormApplication = z.infer<
  typeof myOneTimeFormApplicationSchema
>;
export type OneTimeFormAnswerItem = z.infer<typeof oneTimeFormAnswerItemSchema>;
export type CreateOneTimeFormApplicationRequest = z.infer<
  typeof createOneTimeFormApplicationRequestSchema
>;
export type CreateOneTimeFormApplicationResponse = z.infer<
  typeof createOneTimeFormApplicationResponseSchema
>;
export type OneTimeFormUploadUrl = z.infer<typeof oneTimeFormUploadUrlSchema>;
