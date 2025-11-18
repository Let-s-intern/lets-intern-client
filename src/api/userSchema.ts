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
        createdDate: z.string().optional(),
        accountType: accountType.nullable().optional(),
        accountNum: z.string().nullable().optional(),
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

/**
 * 경험 정리
 * */
const userExperienceBaseSchema = z.object({
  // === 기본 정보 ===
  title: z.string(),
  experienceCategory: experienceCategoryEnum,
  customCategoryName: z.string().nullable().optional(),
  organ: z.string(),
  role: z.string(),
  activityType: activityTypeEnum,
  startDate: z.string(),
  endDate: z.string(),
  // === 경험 상세 작성 ===
  situation: z.string().optional(),
  task: z.string().optional(),
  action: z.string().optional(),
  result: z.string().optional(),
  reflection: z.string().optional(),
  // === 핵심 역량 ===
  coreCompetency: z.string().optional(),
});

export const userExperienceSchema = userExperienceBaseSchema
  .extend({
    // 필수 필드 검증 추가
    title: z
      .string()
      .min(1, '경험 이름은 필수값입니다.')
      .refine((val) => val.trim().length > 0, {
        message: '경험 이름은 필수값입니다.',
      }),
    experienceCategory: experienceCategoryEnum
      .optional()
      .refine((val) => val !== undefined && val !== null, {
        message: '경험 분류는 필수값입니다.',
      }),
    organ: z
      .string()
      .min(1, '기관은 필수값입니다.')
      .refine((val) => val.trim().length > 0, {
        message: '기관은 필수값입니다.',
      }),
    role: z
      .string()
      .min(1, '역할은 필수값입니다.')
      .refine((val) => val.trim().length > 0, {
        message: '역할은 필수값입니다.',
      }),
    activityType: activityTypeEnum,
    startDate: z.string().min(1, '시작 기간은 필수값입니다.'),
    endDate: z.string().min(1, '종료 기간은 필수값입니다.'),
  })
  .refine(
    (data) => {
      // experienceCategory가 OTHER일 때 customCategoryName 필수
      if (data.experienceCategory === 'OTHER') {
        return (
          data.customCategoryName && data.customCategoryName.trim().length > 0
        );
      }
      return true;
    },
    {
      message: '기타 분류명을 입력해주세요.',
      path: ['customCategoryName'],
    },
  )
  .refine(
    (data) => {
      // 날짜 유효성: 시작일 <= 종료일
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: '종료일은 시작일 이후여야 합니다.',
      path: ['endDate'],
    },
  )
  .transform((data) => {
    // experienceCategory가 OTHER가 아니면 customCategoryName을 null로 설정
    return {
      ...data,
      customCategoryName:
        data.experienceCategory === 'OTHER' ? data.customCategoryName : null,
    };
  });

export type UserExperience = z.infer<typeof userExperienceSchema>;

export const userExperienceInfoSchema = userExperienceBaseSchema.extend({
  id: z.number(),
  createdDate: z.string(),
  updatedDate: z.string(),
  isAddedByAdmin: z.boolean().optional(),
});

export type UserExperienceInfo = z.infer<typeof userExperienceInfoSchema>;
