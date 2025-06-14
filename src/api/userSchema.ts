import { accountType, pageInfo } from '@/schema';
import { z } from 'zod';

// GET 유저 관리자 여부
export const isAdminSchema = z.boolean();

/** GET /api/v1/user/admin */
export const userAdminType = z.object({
  userAdminList: z.array(
    z.object({
      userInfo: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        contactEmail: z.string().nullable(),
        phoneNum: z.string(),
        createdDate: z.string(),
        accountType: accountType.nullable(),
        accountNum: z.string().nullable(),
        marketingAgree: z.boolean().nullable(),
        isMentor: z.boolean().nullable().optional(),
      }),
      applicationInfos: z.array(
        z.object({
          programId: z.number().nullable(),
          programTitle: z.string(),
        }),
      ),
    }),
  ),
  pageInfo,
});

export type UserAdmin = z.infer<typeof userAdminType>['userAdminList'];
