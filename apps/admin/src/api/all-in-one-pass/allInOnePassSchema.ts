import { z } from 'zod';

/** 프로그램 유형 (server ProgramType) */
export const allInOnePassProgramTypeSchema = z.enum([
  'CHALLENGE',
  'LIVE',
  'VOD',
  'REPORT',
  'GUIDEBOOK',
  'LIVE_MENTORING',
]);
export type AllInOnePassProgramType = z.infer<
  typeof allInOnePassProgramTypeSchema
>;

/** 권한 유형 (server MembershipPrivilegeType) */
export const allInOnePassPrivilegeTypeSchema = z.enum([
  'ALL_IN_ONE',
  'LIMITED_COUNT',
]);
export type AllInOnePassPrivilegeType = z.infer<
  typeof allInOnePassPrivilegeTypeSchema
>;

// ── 목록 ──────────────────────────────────────────────
export const allInOnePassListItemSchema = z.object({
  membershipId: z.number(),
  title: z.string(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
  applicationCount: z.number().nullish(),
  periodDays: z.number().nullish(),
  isVisible: z.boolean(),
  createDate: z.string().nullish(),
});
export type AllInOnePassListItemResponse = z.infer<
  typeof allInOnePassListItemSchema
>;

export const pageInfoSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const allInOnePassListResponseSchema = z.object({
  membershipList: z.array(allInOnePassListItemSchema),
  pageInfo: pageInfoSchema.nullish(),
});

// ── 상세 ──────────────────────────────────────────────
export const allInOnePassPrivilegeSchema = z.object({
  membershipPlanPrivilegeId: z.number().nullish(),
  programType: allInOnePassProgramTypeSchema,
  privilegeType: allInOnePassPrivilegeTypeSchema,
  programCount: z.number().nullish(),
});

export const allInOnePassPlanSchema = z.object({
  membershipPlanId: z.number().nullish(),
  title: z.string(),
  description: z.string().nullish(),
  price: z.number().nullish(),
  discount: z.number().nullish(),
  privilegeList: z.array(allInOnePassPrivilegeSchema).default([]),
});

export const allInOnePassBenefitSchema = z.object({
  membershipBenefitId: z.number(),
  type: z.string().nullish(),
  title: z.string(),
  link: z.string().nullish(),
  thumbnail: z.string().nullish(),
});

export const allInOnePassFaqSchema = z.object({
  id: z.number(),
  question: z.string().nullish(),
  answer: z.string().nullish(),
  category: z.string().nullish(),
  faqProgramType: z.string().nullish(),
});

export const allInOnePassDetailSchema = z.object({
  membershipId: z.number(),
  title: z.string(),
  introduction: z.string().nullish(),
  description: z.string().nullish(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
  periodDays: z.number().nullish(),
  thumbnail: z.string().nullish(),
  faqList: z.array(allInOnePassFaqSchema).default([]),
  benefitList: z.array(allInOnePassBenefitSchema).default([]),
  planList: z.array(allInOnePassPlanSchema).default([]),
});
export type AllInOnePassDetail = z.infer<typeof allInOnePassDetailSchema>;

// ── 공지/가이드 ────────────────────────────────────────
export const allInOnePassNoticeTypeSchema = z.enum(['NOTICE', 'GUIDE']);
export type AllInOnePassNoticeType = z.infer<
  typeof allInOnePassNoticeTypeSchema
>;

export const allInOnePassNoticeSchema = z.object({
  id: z.number(),
  type: allInOnePassNoticeTypeSchema,
  title: z.string(),
  contents: z.string(),
  isVisible: z.boolean(),
  membershipIds: z.array(z.number()).default([]),
  createDate: z.string(),
});
export type AllInOnePassNotice = z.infer<typeof allInOnePassNoticeSchema>;

export const allInOnePassNoticeListResponseSchema = z.array(
  allInOnePassNoticeSchema,
);
