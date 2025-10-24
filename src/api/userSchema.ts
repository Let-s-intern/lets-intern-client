import { accountType, pageInfo } from '@/schema';
import { z } from 'zod';

// GET 유저 관리자 여부
export const isAdminSchema = z.boolean();

/** GET /api/v1/challenge-mentor */
export const challengeMentorVoSchema = z.object({
  challengeId: z.number(),
  programStatusType: z.string(),
  title: z.string(),
  shortDesc: z.string(),
  thumbnail: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

/** GET /api/v2/user/is-mentor */
export const isMentorSchema = z.boolean();

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

export const mentorApplicationInfoSchema = z.object({
  programId: z.number(),
  programTitle: z.string(),
});

export const mentorUserInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  contactEmail: z.string(),
  phoneNum: z.string(),
  createdDate: z.string(),
  accountType: z.string(),
  accountNum: z.string(),
  marketingAgree: z.boolean(),
  role: z.string(),
  isMentor: z.boolean(),
});

export const mentorListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const mentorUserSchema = z.object({
  userInfo: mentorUserInfoSchema,
  applicationInfos: z.array(mentorApplicationInfoSchema),
});

export const mentorListSchema = z.object({
  mentorList: z.array(mentorListItemSchema),
});

/** GET [유저] 서류 전체 조회 /api/v1/user-document */
export const userDocumentListSchema = z.object({
  userDocumentList: z.array(
    z.object({
      userDocumentId: z.number(),
      userDocumentType: z.enum(['RESUME', 'PORTFOLIO', 'PERSONAL_STATEMENT']),
      fileUrl: z.string(),
    }),
  ),
});

export type UserDocument = z.infer<
  typeof userDocumentListSchema
>['userDocumentList'][number];
