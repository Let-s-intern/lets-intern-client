// 랜딩(구매) 페이지 상품 상세. 공개 API GET /api/v1/membership/{membershipId}.
// BE 응답(planList/privilegeList/faqList)을 FE 타입(plans/privileges/faqs)으로 매퍼에서 변환한다.
import { useQuery } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { z } from 'zod';
import type {
  AllInOnePassLanding,
  PassPrivilegeType,
  PassProgramType,
} from '../types';

// programType·privilegeType 은 느슨하게 받는다 — 모르는 값이 와도 응답 전체가 터지지 않게
// (union 매칭에서 안 걸리면 그 탭/혜택이 안 나올 뿐). VOD_PASS 때 parse 전체가 터진 선례.
const privilegeSchema = z.object({
  membershipPlanPrivilegeId: z.number().nullish(),
  programType: z.string(),
  privilegeType: z.string(),
  programCount: z.number().nullish(),
});

const planSchema = z.object({
  membershipPlanId: z.number(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  price: z.number(),
  discount: z.number().nullish(),
  privilegeList: z.array(privilegeSchema).default([]),
});

const faqSchema = z.object({
  id: z.number(),
  question: z.string().nullish(),
  answer: z.string().nullish(),
  category: z.string().nullish(),
  faqProgramType: z.string().nullish(),
});

const membershipLandingSchema = z.object({
  membershipId: z.number(),
  title: z.string().nullish(),
  introduction: z.string().nullish(),
  landingDescription: z.string().nullish(),
  thumbnail: z.string().nullish(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
  periodDays: z.number().nullish(),
  planList: z.array(planSchema).default([]),
  faqList: z.array(faqSchema).default([]),
});

type MembershipLandingResponse = z.infer<typeof membershipLandingSchema>;

const toLanding = (d: MembershipLandingResponse): AllInOnePassLanding => ({
  id: d.membershipId,
  title: d.title ?? '',
  introduction: d.introduction ?? null,
  landingDescription: d.landingDescription ?? null,
  thumbnail: d.thumbnail ?? null,
  beginning: d.beginning ?? null,
  deadline: d.deadline ?? null,
  periodDays: d.periodDays ?? null,
  plans: d.planList.map((p) => ({
    id: p.membershipPlanId,
    title: p.title ?? '',
    description: p.description ?? null,
    price: p.price,
    discount: p.discount ?? null,
    privileges: p.privilegeList.map((pv) => ({
      programType: pv.programType as PassProgramType,
      privilegeType: pv.privilegeType as PassPrivilegeType,
    })),
  })),
  faqs: d.faqList.map((f) => ({
    id: f.id,
    question: f.question ?? '',
    answer: f.answer ?? '',
    category: f.category ?? null,
  })),
});

export const useGetAllInOnePassLanding = (id: number) =>
  useQuery({
    queryKey: ['allInOnePass', 'landing', id],
    queryFn: async (): Promise<AllInOnePassLanding> => {
      const res = await axios.get(`/membership/${id}`);
      return toLanding(membershipLandingSchema.parse(res.data.data));
    },
    enabled: Number.isFinite(id) && id > 0,
    refetchOnWindowFocus: false,
  });
