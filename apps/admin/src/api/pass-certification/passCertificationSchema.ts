import { z } from 'zod';

/** 인증 승인 상태 */
export const passCertificationStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
]);
export type PassCertificationStatus = z.infer<
  typeof passCertificationStatusSchema
>;

/** 합격 인증 목록 아이템 (GET /api/v1/admin/pass-certification) */
export const adminPassCertificationItemSchema = z.object({
  passCertificationId: z.number(),
  name: z.string(),
  phoneNum: z.string(),
  email: z.string(),
  companyName: z.string(),
  jobName: z.string(),
  passType: z.string(),
  passTypeEtc: z.string().nullable(),
  certificationImageUrl: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  programTypeList: z.array(z.string()),
  programTypeEtc: z.string().nullable(),
  programFeedback: z.string().nullable(),
  privacyAgree: z.boolean(),
  virtuousCycleAgree: z.boolean(),
  status: passCertificationStatusSchema,
  createDate: z.string(),
  matchedUserId: z.number().nullable(),
  matchedUserName: z.string().nullable(),
});
export type AdminPassCertificationItem = z.infer<
  typeof adminPassCertificationItemSchema
>;

export const adminPassCertificationListSchema = z.object({
  passCertificationList: z.array(adminPassCertificationItemSchema),
  pageInfo: z.object({
    pageNum: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});
export type AdminPassCertificationList = z.infer<
  typeof adminPassCertificationListSchema
>;
