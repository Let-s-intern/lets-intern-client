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
  startsAt: z.string().nullable().optional(), // 활성화 전에는 null
  endsAt: z.string().nullable().optional(), // 활성화 전에는 null
  status: vodPassStatusSchema,
  paidAmount: z.number().nullable().optional(),
  // 서버가 내려주는 값만 믿는다. 없으면 환불할 수 없는 것으로 본다
  refundable: z
    .boolean()
    .nullable()
    .optional()
    .transform((value) => value === true),
  durationDays: z.number().nullable().optional(),
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
