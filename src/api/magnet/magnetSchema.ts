import { z } from 'zod';

const magnetTypeSchema = z.enum([
  'MATERIAL',
  'VOD',
  'FREE_TEMPLATE',
  'LAUNCH_ALERT',
  'EVENT',
]);

const magnetListItemSchema = z.object({
  magnetId: z.number(),
  type: magnetTypeSchema,
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
  title: z.string(),
  description: z.string().nullable(),
  previewContents: z.string().nullable(),
  mainContents: z.string().nullable(),
  desktopThumbnail: z.string().nullable(),
  mobileThumbnail: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isVisible: z.boolean(),
});

const magnetQuestionItemSchema = z.object({
  itemId: z.number(),
  value: z.string(),
  isOther: z.boolean(),
});

const magnetQuestionSchema = z.object({
  questionId: z.number(),
  questionType: z.string(),
  isRequired: z.string(),
  question: z.string(),
  description: z.string().nullable(),
  selectionMethod: z.string(),
  items: z.array(magnetQuestionItemSchema),
});

export const magnetDetailResponseSchema = z.object({
  magnetInfo: magnetInfoSchema,
  magnetQuestionInfo: z.array(magnetQuestionSchema),
});

export type MagnetDetailResponse = z.infer<typeof magnetDetailResponseSchema>;
