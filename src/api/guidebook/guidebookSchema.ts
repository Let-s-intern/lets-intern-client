import { challengePriceType } from '@/schema';
import { z } from 'zod';

export const guidebookPriceSchema = z.object({
  priceId: z.number(),
  /** 금액 유형 */
  priceType: challengePriceType.optional().nullable(),
  /** 이용료 금액 */
  price: z.number().optional().nullable(),
  /** 할인 금액 */
  discount: z.number().optional().nullable(),
});

export type GuidebookPrice = z.infer<typeof guidebookPriceSchema>;

export const guidebookDataSchema = z.object({
  guidebook_id: z.number(),
  title: z.string(),
  /** 썸네일(모바일) */
  thumbnailMobile: z.string().nullable().optional(),
  /** 썸네일(데스크탑) */
  thumbnailDesktop: z.string().nullable().optional(),
  /** 자료 구성 — API 예시 확정 후 타입 정하기 */
  contentStructure: z.string().nullable().optional(),
  /** 열람 방식 */
  accessMethod: z.string().nullable().optional(),
  /** 추천 대상 */
  recommendedFor: z.string().nullable().optional(),
  /** 상세콘텐츠 */
  description: z.string().nullable().optional(),
  isVisible: z.boolean().nullable().optional(),
  /** 가격 (1:N) */
  priceInfo: z.array(guidebookPriceSchema).optional(),
});

export type GuidebookData = z.infer<typeof guidebookDataSchema>;
