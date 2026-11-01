import type { PostApplicationResult } from '@/api/application';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  additionalMonthPrice: z.number().nullish(),
  durationDays: z.number(),
  maxPurchaseMonths: z.number().nullish(),
  maxTotalMonths: z.number().nullish(),
  availableMonths: z.number().nullish(),
});

const standaloneProductSchema = z.object({
  // 판매가 꺼졌거나 상품이 비활성이면 null 이다
  product: productSchema.nullish(),
});

export type StandaloneVodPassProduct = z.infer<typeof productSchema>;

export const useStandaloneVodPassProductQuery = (enabled: boolean) =>
  useQuery({
    queryKey: ['standaloneVodPassProduct'],
    queryFn: async () => {
      const res = await axios.get('/vod-pass/product');
      return standaloneProductSchema.parse(res.data.data).product ?? null;
    },
    enabled,
    refetchOnWindowFocus: false,
  });

export interface VodPassPurchaseBody {
  vodPassProductId: number;
  vodPassMonths: number;
  vodPassExpectedPrice: number;
  vodPassExpectedDurationDays: number;
  paymentKey: string;
  orderId: string;
  amount: string;
}

export const postVodPassPurchase = (body: VodPassPurchaseBody) =>
  axios.post<{ data: PostApplicationResult }>('/vod-pass', body);
