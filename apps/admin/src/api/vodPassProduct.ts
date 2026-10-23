import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * GET /api/v1/admin/vod-pass-product 응답. isActive 변경 API 는 BE 에 없어 읽기 전용이다.
 * additionalMonthPrice 는 추가 월 가격 도입 전 서버에는 없어 0 으로 받는다.
 * maxPurchaseMonths, maxTotalMonths 는 구매 개월 수 상한 도입 전 서버에는 없어 서버 기본값(3, 12)으로 받는다.
 */
export const vodPassProductSchema = z.object({
  vodPassProductId: z.number(),
  title: z.string(),
  price: z.number(),
  additionalMonthPrice: z.number().default(0),
  durationDays: z.number(),
  isActive: z.boolean(),
  maxPurchaseMonths: z.number().default(3),
  maxTotalMonths: z.number().default(12),
});
export type VodPassProduct = z.infer<typeof vodPassProductSchema>;

/**
 * PUT 요청. BE 는 기본 월 가격·이용일수가 1 미만이거나 추가 월 가격이 0 미만이면
 * 400 VOD_PASS_PRODUCT_SETTING_INVALID 를 준다. 추가 월 가격 0 은 허용한다.
 * 화면은 항상 다섯 값을 보낸다(BE 는 추가 월 가격과 두 상한을 생략하면 기존 값을 유지하지만 쓰지 않는다).
 * 1회 최대 개월 수는 1 이상, 누적 최대 개월 수는 1회 최대 이상 120 이하여야 하고 아니면
 * 400 VOD_PASS_MONTH_LIMIT_INVALID 를 준다.
 */
export const vodPassProductUpdateSchema = z.object({
  price: z.number().int().positive(),
  additionalMonthPrice: z.number().int().nonnegative(),
  durationDays: z.number().int().positive(),
  maxPurchaseMonths: z.number().int().positive(),
  maxTotalMonths: z.number().int().positive(),
});
export type VodPassProductUpdateReq = z.infer<
  typeof vodPassProductUpdateSchema
>;

/** 상품이 아직 만들어지지 않았을 때 BE 가 404 와 함께 주는 코드. */
export const VOD_PASS_PRODUCT_NOT_FOUND = 'VOD_PASS_PRODUCT_NOT_FOUND';

export const vodPassProductQueryKey = ['admin', 'vodPassProduct'];

const VOD_PASS_PRODUCT_PATH = '/admin/vod-pass-product';

/** 공용 axios 가 서버 문구를 ApiError.message 에 담는다. */
const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

/** GET /api/v1/admin/vod-pass-product */
export const useVodPassProductQuery = () =>
  useQuery({
    queryKey: vodPassProductQueryKey,
    queryFn: async () => {
      const res = await axios.get(VOD_PASS_PRODUCT_PATH);
      return vodPassProductSchema.parse(res.data.data);
    },
  });

/** PUT /api/v1/admin/vod-pass-product */
export const useUpdateVodPassProductMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: VodPassProductUpdateReq) => {
      const res = await axios.put(
        VOD_PASS_PRODUCT_PATH,
        vodPassProductUpdateSchema.parse(req),
      );
      return res.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vodPassProductQueryKey });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(toErrorMessage(error, '저장에 실패했습니다.'));
    },
  });
};
