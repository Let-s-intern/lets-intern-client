import { z } from 'zod';

const magnetTypeSchema = z.enum([
  'MATERIAL',
  'VOD',
  'FREE_TEMPLATE',
  'LAUNCH_ALERT',
  'EVENT',
]);

const programTypeSchema = z.enum([
  'CHALLENGE',
  'LIVE',
  'VOD',
  'REPORT',
  'GUIDEBOOK',
]);

const magnetListItemSchema = z.object({
  magnetId: z.number(),
  type: magnetTypeSchema,
  programType: z.string().nullable(),
  challengeType: z.string().nullable(),
  title: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isVisible: z.boolean(),
  // 접속 가능 여부 — BE 백필 전(기존 행 NULL)에도 안전하도록 null/undefined → false.
  isAccessible: z
    .boolean()
    .nullish()
    .transform((v) => v ?? false),
  applicationCount: z.number(),
});

export const magnetListResponseSchema = z.object({
  magnetList: z.array(magnetListItemSchema),
});

export type MagnetListResponse = z.infer<typeof magnetListResponseSchema>;

const challengeTypeSchema = z.enum([
  'CAREER_START',
  'PERSONAL_STATEMENT',
  'PORTFOLIO',
  'PERSONAL_STATEMENT_LARGE_CORP',
]);

const magnetInfoSchema = z.object({
  magnetId: z.number(),
  type: magnetTypeSchema,
  programType: z.string().nullable(),
  challengeType: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  previewContents: z.string().nullable(),
  mainContents: z.string().nullable(),
  desktopThumbnail: z.string().nullable(),
  mobileThumbnail: z.string().nullable(),
  useBaseQuestion: z.boolean(),
  useLaunchAlert: z.boolean(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isVisible: z.boolean(),
  isAccessible: z
    .boolean()
    .nullish()
    .transform((v) => v ?? false),
});

const magnetQuestionSchema = z.object({
  magnetQuestionId: z.number(),
  type: z.string(),
  question: z.string(),
  description: z.string().nullable(),
  isRequired: z.boolean(),
  answerType: z.enum(['TEXT', 'CHOICE']),
  // 주관식(TEXT)일 때 BE 가 null 을 내려주므로 nullable 처리.
  choiceType: z.enum(['SINGLE', 'MULTIPLE']).nullable(),
  options: z.string().nullable(),
  isVisible: z.boolean().optional(),
});

export const magnetDetailResponseSchema = z.object({
  magnetInfo: magnetInfoSchema,
  magnetQuestionInfo: z.array(magnetQuestionSchema),
});

export const baseQuestionListResponseSchema = z.object({
  magnetQuestionInfo: z.array(magnetQuestionSchema),
});

export type MagnetDetailResponse = z.infer<typeof magnetDetailResponseSchema>;
export type MagnetDetailQuestion = z.infer<typeof magnetQuestionSchema>;

// --- User-facing magnet detail ---

const userMagnetInfoSchema = z.object({
  magnetId: z.number(),
  type: magnetTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  previewContents: z.string().nullable(),
  mainContents: z.string().nullable(),
  desktopThumbnail: z.string().nullable(),
  mobileThumbnail: z.string().nullable(),
  useLaunchAlert: z.boolean().optional().default(false),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  likes: z.number().nullable().optional(),
});

export const userMagnetDetailResponseSchema = z.object({
  magnetInfo: userMagnetInfoSchema,
  viewDate: z.string().nullable().optional(),
});

export type UserMagnetDetailResponse = z.infer<
  typeof userMagnetDetailResponseSchema
>;
export type UserMagnetInfo = z.infer<typeof userMagnetInfoSchema>;

const userMagnetListItemSchema = z.object({
  magnetId: z.number(),
  type: magnetTypeSchema,
  title: z.string(),
  desktopThumbnail: z.string().nullable(),
  mobileThumbnail: z.string().nullable(),
  appliedLaunchAlert: z.boolean().nullable().optional().default(null),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

const pageInfoSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const userMagnetListResponseSchema = z.object({
  magnetList: z.array(userMagnetListItemSchema),
  pageInfo: pageInfoSchema,
});

export type UserMagnetListResponse = z.infer<
  typeof userMagnetListResponseSchema
>;
export type UserMagnetListItem = z.infer<typeof userMagnetListItemSchema>;
export type MagnetType = z.infer<typeof magnetTypeSchema>;
export type ProgramType = z.infer<typeof programTypeSchema>;

export type BaseQuestionListResponse = z.infer<
  typeof baseQuestionListResponseSchema
>;

// --- User-facing magnet questions ---
const userMagnetQuestionItemSchema = z.object({
  magnetQuestionId: z.number(),
  type: z.string(),
  question: z.string(),
  description: z.string().nullable(),
  isRequired: z.boolean(),
  answerType: z.enum(['CHOICE', 'TEXT']),
  // 주관식(TEXT)일 때 BE 가 null 을 내려주므로 nullable 처리.
  choiceType: z.enum(['SINGLE', 'MULTIPLE']).nullable(),
  options: z.string().nullable(),
});

export const userMagnetQuestionListResponseSchema = z.object({
  magnetQuestionList: z.array(userMagnetQuestionItemSchema),
});

export type UserMagnetQuestionListResponse = z.infer<
  typeof userMagnetQuestionListResponseSchema
>;

// --- Mypage magnet (신청현황) ---
const mypageMagnetListItemSchema = z.object({
  magnetId: z.number(),
  type: magnetTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  desktopThumbnail: z.string().nullable(),
  mobileThumbnail: z.string().nullable(),
  applicationCreateDate: z.string().nullable(),
});

export const mypageMagnetListResponseSchema = z.object({
  magnetList: z.array(mypageMagnetListItemSchema),
});

export type MypageMagnetListItem = z.infer<typeof mypageMagnetListItemSchema>;
export type MypageMagnetListResponse = z.infer<
  typeof mypageMagnetListResponseSchema
>;

// --- Launch Alert ---
export const launchAlertResponseSchema = z.object({
  magnetId: z.number(),
  appliedLaunchAlert: z.boolean(),
});

export type LaunchAlertResponse = z.infer<typeof launchAlertResponseSchema>;
