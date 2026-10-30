// 올인원패스 구매(멤버십 신청) API — GET 신청폼 조회 + POST 신청 생성(토스 승인 포함).
import type { VodPassRequestFields } from '@/domain/program/vodPassPurchase';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const privilegeSchema = z.object({
  membershipPlanPrivilegeId: z.number().nullish(),
  programType: z.string(),
  privilegeType: z.string(),
  programCount: z.number().nullish(),
});

const planSchema = z.object({
  membershipPlanId: z.number(),
  title: z.string(),
  description: z.string().nullish(),
  price: z.number().nullish(),
  discount: z.number().nullish(),
  privilegeList: z.array(privilegeSchema).default([]),
});

// 함께 결제하는 VOD 이용권 상품 (LC-3533). 판매가 꺼졌거나 서버 배포 전이면 null·누락이다.
// 챌린지 신청폼과 같은 VodPassProductSummaryResponseDto 다.
const vodPassProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  additionalMonthPrice: z.number().nullish(),
  durationDays: z.number(),
  maxPurchaseMonths: z.number().nullish(),
  maxTotalMonths: z.number().nullish(),
  // 이 사용자가 지금 살 수 있는 최대 개월 수. 0 이면 더 살 수 없다
  availableMonths: z.number().nullish(),
});

export const applicationFormSchema = z.object({
  applied: z.boolean().nullish(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  contactEmail: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  title: z.string().nullish(),
  thumbnail: z.string().nullish(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
  periodDays: z.number().nullish(),
  statusType: z.string().nullish(),
  hasActiveMembership: z.boolean().nullish(), // 이미 보유한 유효 멤버십 존재 여부. true면 랜딩 CTA 비활성
  planList: z.array(planSchema).default([]),
  vodPassProduct: vodPassProductSchema.nullish(),
});

export type MembershipApplicationForm = z.infer<typeof applicationFormSchema>;
export type MembershipPlanForm = z.infer<typeof planSchema>;
export type MembershipVodPassProduct = z.infer<typeof vodPassProductSchema>;

/** 최종 결제액 = max(정가 - 할인액, 0) (쿠폰 미적용) */
export const getPlanFinalAmount = (plan: MembershipPlanForm): number =>
  Math.max((plan.price ?? 0) - (plan.discount ?? 0), 0);

export const useGetMembershipApplicationForm = (membershipId: number) =>
  useQuery({
    queryKey: ['membershipApplicationForm', membershipId],
    queryFn: async (): Promise<MembershipApplicationForm> => {
      const res = await axios.get(`/membership/${membershipId}/application`);
      return applicationFormSchema.parse(res.data.data);
    },
    enabled: Number.isFinite(membershipId) && membershipId > 0,
    refetchOnWindowFocus: false,
  });

// VOD 이용권 필드는 미선택이면 넷 다 보내지 않는다 (toVodPassRequestFields)
export interface CreateMembershipApplicationBody extends Partial<VodPassRequestFields> {
  membershipPlanId: number;
  couponCode?: string | null;
  paymentKey?: string | null;
  orderId: string;
  amount: string;
  contactEmail?: string | null;
}

export const postMembershipApplication = (
  membershipId: number,
  body: CreateMembershipApplicationBody,
) => axios.post(`/membership-application/${membershipId}`, body);

export interface CreateMembershipExtensionBody {
  membershipOptionId: number;
  couponCode?: string | null;
  paymentKey?: string | null;
  orderId: string;
  amount: string;
}

export const postMembershipExtension = (
  applicationId: number,
  body: CreateMembershipExtensionBody,
) => axios.post(`/membership-application/${applicationId}/extension`, body);
