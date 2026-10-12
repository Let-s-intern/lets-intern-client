import axios from '@/utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/** GET /api/v1/admin/vod-pass-product 응답. isActive 변경 API 는 BE 에 없어 읽기 전용이다. */
export const vodPassProductSchema = z.object({
  vodPassProductId: z.number(),
  title: z.string(),
  price: z.number(),
  durationDays: z.number(),
  isActive: z.boolean(),
});
export type VodPassProduct = z.infer<typeof vodPassProductSchema>;

/** PUT 요청. BE 는 둘 다 1 이상이 아니면 400 VOD_PASS_PRODUCT_SETTING_INVALID 를 준다. */
export const vodPassProductUpdateSchema = z.object({
  price: z.number().int().positive(),
  durationDays: z.number().int().positive(),
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
