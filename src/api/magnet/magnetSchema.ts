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
