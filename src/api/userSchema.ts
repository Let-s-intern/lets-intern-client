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

export const CATEGORY_PAIRS = [
  ['프로젝트', 'PROJECT'],
  ['학회', 'ACADEMIC'],
  ['동아리', 'CLUB'],
  ['교육', 'EDUCATION'],
  ['공모전', 'COMPETITION'],
  ['대외활동', 'EXTRACURRICULAR'],
  ['인턴', 'INTERNSHIP'],
  ['회사', 'COMPANY'],
  ['대학교', 'UNIVERSITY'],
  ['기타(직접입력)', 'OTHER'],
] as const;

export type DisplayExperienceCategory = (typeof CATEGORY_PAIRS)[number][0];
export type ExperienceCategory = (typeof CATEGORY_PAIRS)[number][1];

export const experienceCategoryEnum = z.enum(
  CATEGORY_PAIRS.map(([, api]) => api) as [
    ExperienceCategory,
    ...ExperienceCategory[],
  ],
);

const ACTIVITY_TYPE_PAIRS = [
  ['팀', 'TEAM'],
  ['개인', 'INDIVIDUAL'],
] as const;

// export type DisplayActivityType = (typeof ACTIVITY_TYPE_PAIRS)[number][0];
export type ActivityType = (typeof ACTIVITY_TYPE_PAIRS)[number][1];

const activityTypeEnum = z.enum(
  ACTIVITY_TYPE_PAIRS.map(([, api]) => api) as [
    ActivityType,
    ...ActivityType[],
  ],
);

/** 경험 정리 /api/v1/user-experience/* */
export const userExperienceSchema = z.object({
  title: z.string().optional(),
  experienceCategory: experienceCategoryEnum.optional(),
  customCategoryName: z.string().optional(),
  organization: z.string().optional(), // 기관 추가 필요
  role: z.string().optional(),
  activityType: activityTypeEnum.optional(),
  startDate: z.string(), // YYYY-MM-DD 형식
  endDate: z.string(), // YYYY-MM-DD 형식
  ////
  situation: z.string().optional(),
  task: z.string().optional(),
  action: z.string().optional(),
  result: z.string().optional(),
  learnings: z.string().optional(), // 느낀점/배운점 추가 필요
  ////
  coreCompetency: z.string().optional(),
  isAdminAdded: z.boolean().optional(),
});

export type UserExperience = z.infer<typeof userExperienceSchema>;

/** 경험 정리 생성 응답 */
export const userExperienceInfoSchema = userExperienceSchema.extend({
  id: z.number(),
  createdDate: z.string(),
  updatedDate: z.string(),
});

export type UserExperienceInfo = z.infer<typeof userExperienceInfoSchema>;
