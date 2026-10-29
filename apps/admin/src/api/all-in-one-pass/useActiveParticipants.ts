// 참여중 유저 목록·기간 내역 조회.
// 목록=GET /admin/membership/application(서버 페이지네이션), 기간=/{id}/period.
import {
  ActivePassParticipant,
  PassParticipationPeriod,
} from '@/domain/all-in-one-pass/types';
import axios from '@/utils/axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const activeParticipantListQueryKey =
  'allInOnePassActiveParticipantList';
export const participationPeriodsQueryKey = 'allInOnePassParticipationPeriods';

// ── 참여중 목록 ──────
const adminVoSchema = z.object({
  membershipApplicationId: z.number(),
  userName: z.string().nullish(),
  contactEmail: z.string().nullish(),
  planTitle: z.string().nullish(),
  membershipTitle: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  orderId: z.string().nullish(),
});

const activeItemSchema = z.object({
  membershipApplication: adminVoSchema,
  totalPaymentAmount: z.number().nullish(),
  extensionCount: z.number().nullish(),
  totalDays: z.number().nullish(),
});

const activeListSchema = z.object({
  membershipApplicationList: z.array(activeItemSchema).default([]),
  pageInfo: z.object({ totalElements: z.number() }),
});

const toParticipant = (
  item: z.infer<typeof activeItemSchema>,
): ActivePassParticipant => ({
  id: item.membershipApplication.membershipApplicationId,
  orderId: item.membershipApplication.orderId ?? '',
  name: item.membershipApplication.userName ?? '',
  email: item.membershipApplication.contactEmail ?? '',
  passTitle:
    item.membershipApplication.membershipTitle ??
    item.membershipApplication.planTitle ??
    '',
  startDate: item.membershipApplication.startDate ?? '',
  endDate: item.membershipApplication.endDate ?? '',
  totalDays: item.totalDays ?? 0,
  totalPayment: item.totalPaymentAmount ?? 0,
  extensionCount: item.extensionCount ?? 0,
});

/** 참여중 멤버십 유저 목록 (서버 페이지네이션) */
export const useGetActivePassParticipantsQuery = (params: {
  page: number;
  size: number;
}) =>
  useQuery({
    queryKey: [activeParticipantListQueryKey, params.page, params.size],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await axios.get('/admin/membership/application', {
        params: { page: params.page, size: params.size },
      });
      const parsed = activeListSchema.parse(res.data.data);
      return {
        list: parsed.membershipApplicationList.map(toParticipant),
        totalElements: parsed.pageInfo.totalElements,
      };
    },
  });

// ── 참여 기간 내역 (모달) ──────
const periodItemSchema = z.object({
  type: z.string(),
  title: z.string().nullish(),
  orderId: z.string().nullish(),
  paymentDate: z.string().nullish(),
  finalPrice: z.number().nullish(),
  days: z.number().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  isRefunded: z.boolean().nullish(),
});

const periodListSchema = z.object({
  periodList: z.array(periodItemSchema).default([]),
});

const toPeriod = (
  dto: z.infer<typeof periodItemSchema>,
): PassParticipationPeriod => ({
  type: dto.type,
  title: dto.title ?? '',
  orderId: dto.orderId ?? '',
  paidAt: dto.paymentDate ?? '',
  finalPrice: dto.finalPrice ?? 0,
  days: dto.days ?? 0,
  startDate: dto.startDate ?? '',
  endDate: dto.endDate ?? '',
  isRefunded: dto.isRefunded ?? false,
});

/** 특정 신청의 참여 기간 내역 (패스 기간 + 연장 건) */
export const useGetParticipationPeriodsQuery = (applicationId?: number) =>
  useQuery({
    queryKey: [participationPeriodsQueryKey, applicationId],
    enabled: applicationId != null,
    queryFn: async () => {
      const res = await axios.get(
        `/admin/membership/application/${applicationId}/period`,
      );
      return periodListSchema.parse(res.data.data).periodList.map(toPeriod);
    },
  });
