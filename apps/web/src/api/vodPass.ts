import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const UseVodPassQueryKey = 'useVodPassQueryKey';

const KNOWN_VOD_PASS_STATUS = [
  'UNACTIVATED',
  'SCHEDULED',
  'ACTIVE',
  'EXPIRED',
  'CANCELED',
] as const;

/**
 * 이용권 상태.
 * 서버가 새 상태를 추가해도 목록 파싱 전체가 실패하지 않도록 모르는 값은 `UNKNOWN` 으로 받는다.
 */
export const vodPassStatusSchema = z.union([
  z.enum(KNOWN_VOD_PASS_STATUS),
  z.string().transform(() => 'UNKNOWN' as const),
]);

export type VodPassStatus = z.infer<typeof vodPassStatusSchema>;

export const vodPassSchema = z.object({
  applicationId: z.number(),
  paymentId: z.number().nullable().optional(),
  startsAt: z.string().nullable().optional(), // 이전 모델의 미활성(UNACTIVATED) 구매는 null
  endsAt: z.string().nullable().optional(), // 이전 모델의 미활성(UNACTIVATED) 구매는 null
  status: vodPassStatusSchema,
  paidAmount: z.number().nullable().optional(),
  // 서버가 내려주는 값만 믿는다. 없으면 환불할 수 없는 것으로 본다
  refundable: z
    .boolean()
    .nullable()
    .optional()
    .transform((value) => value === true),
  durationDays: z.number().nullable().optional(),
  // 구매 당시 선택한 개월 수. 개월 선택이 생기기 전 구매는 null 이다
  purchasedMonths: z.number().nullable().optional(),
});

export type VodPass = z.infer<typeof vodPassSchema>;

export const vodPassListSchema = z.object({
  passes: z.array(vodPassSchema),
});

export const vodPassListQueryOptions = {
  queryKey: [UseVodPassQueryKey],
  queryFn: async () => {
    const res = await axios.get('/vod-pass');
    return vodPassListSchema.parse(res.data.data);
  },
};

/** 내 이용권 목록 전체. 다른 이용권과의 선후 관계를 볼 때 쓴다. */
export const useVodPassListQuery = (enabled = true) =>
  useQuery({ ...vodPassListQueryOptions, enabled });

/**
 * `applicationId` 의 이용권 한 건. 목록에 없으면 `data` 는 `undefined` 다.
 * 이용권 조회가 실패해도 호출한 화면이 깨지지 않도록 `isError` 로 갈라 쓴다.
 */
export const useVodPassQuery = (
  applicationId: number | null | undefined,
  enabled = true,
) =>
  useQuery({
    ...vodPassListQueryOptions,
    enabled: enabled && typeof applicationId === 'number',
    select: (list) =>
      list.passes.find((pass) => pass.applicationId === applicationId),
  });
