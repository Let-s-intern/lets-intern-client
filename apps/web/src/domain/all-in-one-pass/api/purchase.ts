// 올인원패스 구매(멤버십 신청) API — GET 신청폼 조회 + POST 신청 생성(토스 승인 포함).
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

const applicationFormSchema = z.object({
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
});

export type MembershipApplicationForm = z.infer<typeof applicationFormSchema>;
export type MembershipPlanForm = z.infer<typeof planSchema>;

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

export interface CreateMembershipApplicationBody {
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
