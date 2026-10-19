import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import axios from '@/utils/axios';

export const vodPassStatusSchema = z.enum([
  'UNACTIVATED',
  'SCHEDULED',
  'ACTIVE',
  'EXPIRED',
  'CANCELED',
]);

export type VodPassStatus = z.infer<typeof vodPassStatusSchema>;

/**
 * GET /api/v1/admin/vod-pass/applications 응답.
 *
 * 결제 없이 만든 기간 레코드나 탈퇴한 회원은 일부 필드가 null 이다.
 */
export const vodPassApplicationsSchema = z.object({
  passes: z.array(
    z.object({
      applicationId: z.number(),
      userId: z.number().nullable().optional(),
      name: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      phoneNum: z.string().nullable().optional(),
      orderId: z.string().nullable().optional(),
      purchasedMonths: z.number().nullable().optional(),
      startsAt: z.string().nullable().optional(),
      endsAt: z.string().nullable().optional(),
      status: vodPassStatusSchema,
      paidAmount: z.number().nullable().optional(),
      createDate: z.string().nullable().optional(),
    }),
  ),
});

export type VodPassApplication = z.infer<
  typeof vodPassApplicationsSchema
>['passes'][number];

export const vodPassApplicationsQueryKey = ['admin', 'vodPassApplications'];

/** GET /api/v1/admin/vod-pass/applications */
export const useVodPassApplicationsQuery = () =>
  useQuery({
    queryKey: vodPassApplicationsQueryKey,
    queryFn: async () => {
      const res = await axios.get('/admin/vod-pass/applications');
      return vodPassApplicationsSchema.parse(res.data.data).passes;
    },
  });
