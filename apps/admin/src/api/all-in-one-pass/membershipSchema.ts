import { z } from 'zod';

/** 프로그램 유형 (server ProgramType) */
export const membershipProgramTypeSchema = z.enum([
  'CHALLENGE',
  'LIVE',
  'VOD',
  'REPORT',
  'GUIDEBOOK',
  'LIVE_MENTORING',
]);
export type MembershipProgramType = z.infer<typeof membershipProgramTypeSchema>;

/** 권한 유형 (server MembershipPrivilegeType) */
export const membershipPrivilegeTypeSchema = z.enum([
  'ALL_IN_ONE',
  'LIMITED_COUNT',
]);
export type MembershipPrivilegeType = z.infer<
  typeof membershipPrivilegeTypeSchema
>;

// ── 목록 ──────────────────────────────────────────────
export const membershipListItemSchema = z.object({
  membershipId: z.number(),
  title: z.string(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
  applicationCount: z.number().nullish(),
  periodDays: z.number().nullish(),
  isVisible: z.boolean(),
  createDate: z.string().nullish(),
});
export type MembershipListItem = z.infer<typeof membershipListItemSchema>;

export const pageInfoSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const membershipListResponseSchema = z.object({
  membershipList: z.array(membershipListItemSchema),
  pageInfo: pageInfoSchema.nullish(),
});

// ── 상세 ──────────────────────────────────────────────
export const membershipPrivilegeSchema = z.object({
  membershipPlanPrivilegeId: z.number().nullish(),
  programType: membershipProgramTypeSchema,
  privilegeType: membershipPrivilegeTypeSchema,
  programCount: z.number().nullish(),
});

export const membershipPlanSchema = z.object({
  membershipPlanId: z.number().nullish(),
  title: z.string(),
  description: z.string().nullish(),
  price: z.number().nullish(),
  discount: z.number().nullish(),
  privilegeList: z.array(membershipPrivilegeSchema).default([]),
});

export const membershipBenefitSchema = z.object({
  membershipBenefitId: z.number(),
  type: z.string().nullish(),
  title: z.string(),
  link: z.string().nullish(),
  thumbnail: z.string().nullish(),
});

export const membershipFaqSchema = z.object({
  id: z.number(),
  question: z.string().nullish(),
  answer: z.string().nullish(),
  category: z.string().nullish(),
  faqProgramType: z.string().nullish(),
});

export const membershipDetailSchema = z.object({
  membershipId: z.number(),
  title: z.string(),
  introduction: z.string().nullish(),
  description: z.string().nullish(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
  periodDays: z.number().nullish(),
  thumbnail: z.string().nullish(),
  faqList: z.array(membershipFaqSchema).default([]),
  benefitList: z.array(membershipBenefitSchema).default([]),
  planList: z.array(membershipPlanSchema).default([]),
});
export type MembershipDetail = z.infer<typeof membershipDetailSchema>;
