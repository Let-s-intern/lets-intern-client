import {
  activitySchema,
  categorySchema,
} from '@/api/experience/experienceSchema';
import { mentorHashTagItemSchema } from '@/api/mentor/mentorSchema';
import {
  accountType,
  authProviderSchema,
  pageInfo,
  reportTypeSchema,
} from '@/schema';
import { z } from 'zod';

// GET 유저 관리자 여부
export const isAdminSchema = z.boolean();

/** GET /api/v1/challenge-mentor */
export const challengeMentorVoSchema = z.object({
  challengeMentorId: z.number(),
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
        careerType: z.enum(['QUALIFIED', 'NONE']).nullable(),
        name: z.string(),
        email: z.string(),
        contactEmail: z.string().nullable(),
        university: z.string().nullable(),
        wishField: z.string().nullable(),
        wishJob: z.string().nullable(),
        wishIndustry: z.string().nullable(),
        wishEmploymentType: z.string().nullable(),
        phoneNum: z.string(),
        accountType: accountType.nullable().optional(),
        accountNum: z.string().nullable().optional(),
        marketingAgree: z.boolean().nullable(),
        memo: z.string().nullable().optional(),
        isMentor: z.boolean().nullable().optional(),
        isPoolUp: z.boolean().nullable().optional(),
        createDate: z.string().nullable().optional(),
      }),
      applicationInfos: z.array(
        z.object({
          programId: z.number().nullable(),
          programTitle: z.string(),
        }),
      ),
      documentInfos: z.array(
        z.object({
          userDocumentId: z.number(),
          userDocumentType: z.enum([
            'RESUME',
            'PORTFOLIO',
            'PERSONAL_STATEMENT',
          ]),
          fileName: z.string().nullable(),
          fileUrl: z.string(),
        }),
      ),
      experienceInfos: z.array(
        z.object({
          title: z.string(),
        }),
      ),
      careerInfos: z.array(
        z.object({
          company: z.string(),
          job: z.string(),
        }),
      ),
    }),
  ),
  pageInfo,
});

export type UserAdmin = z.infer<typeof userAdminType>['userAdminList'];

export const mentorListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
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
      fileUrl: z.string().nullable(),
      fileName: z.string().optional().nullable(),
      wishField: z.string().optional(),
      wishJob: z.string().optional(),
      wishIndustry: z.string().optional(),
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

/**
 * 어드민 유저 상세 정보 조회 (v2 — GET /api/v2/admin/user/{userId}).
 * userAdminDetailType(v1, GET /api/v1/user/{userId}) 어드민 버전
 */
export const adminUserDetailSchema = z.object({
  userInfo: z.object({
    userId: z.number(),
    id: z.string(),
    name: z.string(),
    email: z.string(),
    contactEmail: z.string().nullable(),
    phoneNum: z.string(),
    university: z.string().nullable(),
    inflowPath: z.string().nullable(),
    grade: z.string().nullable(),
    major: z.string().nullable(),
    wishField: z.string().nullable(),
    wishJob: z.string().nullable(),
    wishIndustry: z.string().nullable(),
    wishEmploymentType: z.string().nullable(),
    wishCompany: z.string().nullable(),
    sns: z.string().nullable(),
    nickname: z.string().nullable(),
    introduction: z.string().nullable(),
    description: z.string().nullable(),
    accountType: accountType.nullable(),
    accountNum: z.string().nullable(),
    marketingAgree: z.boolean().nullable(),
    authProvider: authProviderSchema.nullable(),
    role: z.string().nullable(),
    careerType: z.string().nullable(),
    memo: z.string().nullable(),
    isPoolUp: z.boolean().nullable(),
    profileImgUrl: z.string().nullable(),
    corpImgUrl: z.string().nullable(),
  }),
  applicationInfo: z.array(
    z.object({
      programId: z.number().nullable(),
      programTitle: z.string(),
    }),
  ),
  userDocumentInfo: z
    .array(
      z.object({
        userDocumentId: z.number(),
        userDocumentType: reportTypeSchema,
        fileUrl: z.string().nullable(),
        fileName: z.string().nullable(),
        wishField: z.string().nullable(),
        wishJob: z.string().nullable(),
        wishIndustry: z.string().nullable(),
      }),
    )
    .nullable(),
  careerInfos: z
    .array(
      z.object({
        company: z.string().nullable(),
        field: z.string().nullable(),
        job: z.string().nullable(),
        position: z.string().nullable(),
        department: z.string().nullable(),
        employmentType: z.string().nullable(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        verificationFile: z.string().nullable(),
        isRepresentative: z.boolean(),
      }),
    )
    .nullable(),
  experienceInfos: z
    .array(
      z.object({
        title: z.string().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
        activityType: activitySchema.nullable().optional(),
        experienceCategory: categorySchema.nullable().optional(),
        role: z.string().nullable().optional(),
        situation: z.string().nullable().optional(),
        task: z.string().nullable().optional(),
        action: z.string().nullable().optional(),
        result: z.string().nullable().optional(),
        coreCompetency: z.string().nullable().optional(),
        customCategoryName: z.string().nullable().optional(),
        reflection: z.string().nullable().optional(),
        organ: z.string().nullable().optional(),
        yearBadges: z.array(z.number()).optional(),
      }),
    )
    .nullable(),
  mentorHashTagInfos: z.array(mentorHashTagItemSchema).nullable(),
});

export type AdminUserDetail = z.infer<typeof adminUserDetailSchema>;
