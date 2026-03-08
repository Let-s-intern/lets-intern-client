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
  applicationCount: z.number(),
});

export const magnetListResponseSchema = z.object({
  magnetList: z.array(magnetListItemSchema),
});

export type MagnetListResponse = z.infer<typeof magnetListResponseSchema>;

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
});

const magnetQuestionSchema = z.object({
  magnetQuestionId: z.number(),
  type: z.string(),
  question: z.string(),
  description: z.string().nullable(),
  isRequired: z.boolean(),
  answerType: z.enum(['TEXT', 'CHOICE']),
  choiceType: z.enum(['SINGLE', 'MULTIPLE']),
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

const userMagnetListItemSchema = z.object({
  magnetId: z.number(),
  type: magnetTypeSchema,
  title: z.string(),
  desktopThumbnail: z.string().nullable(),
  mobileThumbnail: z.string().nullable(),
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
