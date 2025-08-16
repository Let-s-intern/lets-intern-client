import dayjs from '@/lib/dayjs';
import { z } from 'zod';
import { challengeOptionSchema } from './api/challengeOptionSchema';

export interface Pageable {
  page: number;
  size: number;
}

export const reportTypeSchema = z.enum([
  'RESUME',
  'PERSONAL_STATEMENT',
  'PORTFOLIO',
]);

export const ReportTypePathnameEnum = z.enum([
  'resume',
  'personal-statement',
  'portfolio',
]);

export type ReportTypePathname = z.infer<typeof ReportTypePathnameEnum>;

export const pageInfo = z.object({
  pageNum: z.number().gte(0),
  pageSize: z.number().gte(0),
  totalElements: z.number().gte(0),
  totalPages: z.number().gte(0),
});

export type PageInfo = z.infer<typeof pageInfo>;

// 챌린지 가격 플랜
export const ChallengePricePlanEnum = z.enum(['BASIC', 'STANDARD', 'PREMIUM']);
export type ChallengePricePlan = z.infer<typeof ChallengePricePlanEnum>;

/** GET /api/v1/challenge */
export const challengeSchema = z
  .object({
    programList: z.array(
      z.object({
        id: z.number(),
        title: z.string().nullable().optional(),
        shortDesc: z.string().nullable().optional(),
        thumbnail: z.string().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
        beginning: z.string().nullable().optional(),
        deadline: z.string().nullable().optional(),
        createDate: z.string(),
      }),
    ),
    pageInfo,
  })
  .transform((data) => {
    return {
      programList: data.programList.map((program) => ({
        ...program,
        startDate: program.startDate ? dayjs(program.startDate) : null,
        endDate: program.endDate ? dayjs(program.endDate) : null,
        beginning: program.beginning ? dayjs(program.beginning) : null,
        deadline: program.deadline ? dayjs(program.deadline) : null,
        createDate: dayjs(program.createDate),
      })),
      pageInfo: data.pageInfo,
    };
  });

export const challengeTypeSchema = z.enum([
  'CAREER_START',
  'DOCUMENT_PREPARATION',
  'MEETING_PREPARATION',
  'ETC',
  'PERSONAL_STATEMENT',
  'PORTFOLIO',
  'PERSONAL_STATEMENT_LARGE_CORP',
  'MARKETING',
  'EXPERIENCE_SUMMARY',
]);

export type ChallengeType = z.infer<typeof challengeTypeSchema>;

export const activeChallengeSchema = z.object({
  id: z.number(),
  title: z.string(),
  beginning: z.string(),
  deadline: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type ActiveChallengeType = z.infer<typeof activeChallengeSchema>;

export const activeChallengeResponse = z.object({
  challengeList: z.array(activeChallengeSchema),
});

export type ActiveChallengeResponse = z.infer<typeof activeChallengeResponse>;

export const ProgramClassificationEnum = z.enum([
  'CAREER_SEARCH',
  'DOCUMENT_PREPARATION',
  'MEETING_PREPARATION',
  'PASS',
]);

export type ProgramClassification = z.infer<typeof ProgramClassificationEnum>;

export const ProgramAdminClassificationEnum = z.enum(['B2B', 'B2C']);

export type ProgramAdminClassification = z.infer<
  typeof ProgramAdminClassificationEnum
>;

export const challengeListItemSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  beginning: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  createDate: z.string(),
});

export const challengeListSchema = z.object({
  programList: z.array(challengeListItemSchema),
  pageInfo,
});

export type ChallengeList = z.infer<typeof challengeListSchema>;

export const challengePriceType = z.union([
  z.literal('CHARGE'),
  z.literal('REFUND'),
]);

export type ChallengePriceType = z.infer<typeof challengePriceType>;

export const challengeUserType = z.union([
  z.literal('BASIC'),
  z.literal('PREMIUM'),
]);

// deprecated
export type ChallengeUserType = z.infer<typeof challengeUserType>;

const challengeParticipationType = z.union([
  z.literal('LIVE'),
  z.literal('FREE'),
]);

export type ChallengeParticipationType = z.infer<
  typeof challengeParticipationType
>;

const livePriceTypeSchema = z.union([z.literal('CHARGE'), z.literal('FREE')]);

export type LivePriceType = z.infer<typeof livePriceTypeSchema>;

export const ProgramTypeEnum = z.enum(['CHALLENGE', 'LIVE', 'VOD', 'REPORT']);

export type ProgramTypeUpperCase = z.infer<typeof ProgramTypeEnum>;

export const programTypeList = ['CHALLENGE', 'LIVE', 'VOD', 'REPORT'];

export const accountType = z.union([
  z.literal('KB'),
  z.literal('HANA'),
  z.literal('WOORI'),
  z.literal('SHINHAN'),
  z.literal('NH'),
  z.literal('SH'),
  z.literal('IBK'),
  z.literal('MG'),
  z.literal('KAKAO'),
  z.literal('TOSS'),
]);

export type AccountType = z.infer<typeof accountType>;

const faq = z.object({
  id: z.number(),
  question: z.string().nullable().optional(),
  answer: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  faqProgramType: ProgramTypeEnum.nullable().optional(),
});

export type Faq = z.infer<typeof faq>;

export const faqSchema = z.object({ faqList: z.array(faq) });

export type faqSchemaType = z.infer<typeof faqSchema>;

export const reviewSchema = z.object({
  id: z.number(),
  applicationId: z.number().nullable().optional(),
  userId: z.number().nullable().optional(),
  programTitle: z.string().nullable().optional(),
  programType: ProgramTypeEnum.optional(),
  name: z.string().nullable().optional(),
  nps: z.number().optional().nullable(),
  npsAns: z.string().optional().nullable(),
  npsCheckAns: z.boolean().optional().nullable(),
  content: z.string().optional().nullable(),
  programDetail: z.string().optional().nullable(),
  score: z.number(),
  isVisible: z.boolean(),
  createdDate: z.string(),
});

export const reviewTotalSchema = z.object({
  reviewList: z.array(reviewSchema).nullable(),
});

export type ReviewType = z.infer<typeof reviewSchema>;

export const MissionStatusEnum = z.enum([
  'WAITING',
  'CHECK_DONE',
  'REFUND_DONE',
]);

export type MissionStatus = z.infer<typeof MissionStatusEnum>;

export const challengePriceInfoSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  priceId: z.number(),
  price: z.number().optional().nullable(),
  refund: z.number().optional().nullable(),
  discount: z.number().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  accountType: accountType.optional().nullable(),
  challengePriceType: challengePriceType.optional().nullable(),
  challengePricePlanType: ChallengePricePlanEnum.optional().nullable(),
  challengeParticipationType: challengeParticipationType.optional().nullable(),
  challengeOptionList: z.array(challengeOptionSchema),
});

export type ChallengePriceInfo = z.infer<typeof challengePriceInfoSchema>;

export const getChallengeIdPrimitiveSchema = z.object({
  title: z.string().optional(),
  shortDesc: z.string().optional(),
  desc: z.string().optional(),
  criticalNotice: z.string().nullable().optional(),
  participationCount: z.number().optional(),
  thumbnail: z.string().optional(),
  desktopThumbnail: z.string().optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  beginning: z.string().optional(),
  deadline: z.string().optional(),
  chatLink: z.string().optional(),
  chatPassword: z.string().optional(),
  challengeType: challengeTypeSchema,
  classificationInfo: z.array(
    z.object({
      programClassification: ProgramClassificationEnum,
    }),
  ),
  adminClassificationInfo: z
    .array(
      z.object({
        programAdminClassification: ProgramAdminClassificationEnum,
      }),
    )
    .nullable()
    .optional(),
  priceInfo: z.array(challengePriceInfoSchema),
  faqInfo: z.array(faq),
});

export type ChallengeIdPrimitive = z.infer<
  typeof getChallengeIdPrimitiveSchema
>;

/** GET /api/v1/challenge/{id} 챌린지 상세 조회 (어드민, 유저 겸용) */
export const getChallengeIdSchema = getChallengeIdPrimitiveSchema.transform(
  (data) => {
    return {
      ...data,
      startDate: data.startDate ? dayjs(data.startDate) : null,
      endDate: data.endDate ? dayjs(data.endDate) : null,
      beginning: data.beginning ? dayjs(data.beginning) : null,
      deadline: data.deadline ? dayjs(data.deadline) : null,
      priceInfo: data.priceInfo.map((price) => ({
        ...price,
        deadline: price.deadline ? dayjs(price.deadline) : null,
      })),
    };
  },
);

export type ChallengeIdSchema = z.infer<typeof getChallengeIdSchema>;

/** POST /api/v1/challenge 챌린지 생성 */
export type CreateChallengeReq = {
  title: string;
  shortDesc: string;
  desc: string;
  criticalNotice: string;
  participationCount: number;
  thumbnail: string;
  desktopThumbnail: string;
  startDate: string; // "2024-10-12T06:24:10.873"
  endDate: string; // "2024-10-12T06:24:10.873"
  beginning: string; // "2024-10-12T06:24:10.873"
  deadline: string; // "2024-10-12T06:24:10.873"
  chatLink: string;
  chatPassword: string;
  challengeType: ChallengeType;
  // 프로그램 분류
  programTypeInfo: {
    classificationInfo: {
      programClassification: ProgramClassification;
    };
  }[];
  // B2 타입
  adminProgramTypeInfo: {
    classificationInfo: {
      programAdminClassification: ProgramAdminClassification;
    };
  }[];
  priceInfo: ChallengePriceReq[];
  faqInfo: {
    faqId: number;
  }[];
};

/** PATCH /api/v1/challenge/{challengeId} 챌린지 수정 */
export type UpdateChallengeReq = {
  title?: string;
  shortDesc?: string;
  desc?: string;
  criticalNotice?: string;
  participationCount?: number;
  thumbnail?: string;
  desktopThumbnail?: string;
  startDate?: string; // "2024-10-12T08:03:17.016Z"
  endDate?: string; // "2024-10-12T08:03:17.016Z"
  beginning?: string; // "2024-10-12T08:03:17.016Z"
  deadline?: string; // "2024-10-12T08:03:17.016Z"
  chatLink?: string;
  chatPassword?: string;
  challengeType?: ChallengeType;
  isVisible?: boolean;
  programTypeInfo?: {
    classificationInfo: {
      programClassification: ProgramClassification;
    };
  }[];
  // B2 타입
  adminProgramTypeInfo?: {
    classificationInfo: {
      programAdminClassification: ProgramAdminClassification;
    };
  }[];
  priceInfo?: ChallengePriceReq[];
  faqInfo?: {
    faqId: number;
  }[];
};

export type ChallengePriceReq = {
  priceInfo: {
    price: number;
    discount: number;
    accountNumber?: string | null;
    accountType?: AccountType | null;
    deadline?: string | null; // 사용 안 함
  };
  title?: string | null;
  description?: string | null;
  charge: number;
  refund: number;
  challengePriceType: ChallengePriceType;
  challengePricePlanType: ChallengePricePlan;
  challengeParticipationType: ChallengeParticipationType;
  challengeOptionIdList?: number[] | null;
};

// DELETE /api/v1/challenge/{challengeId} 챌린지 삭제
export const liveProgressSchema = z.union([
  z.literal('ALL'),
  z.literal('ONLINE'),
  z.literal('OFFLINE'),
]);

export type LiveProgressType = z.infer<typeof liveProgressSchema>;

export const getLiveIdPrimitiveSchema = z.object({
  title: z.string().optional(),
  shortDesc: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  criticalNotice: z.string().optional().nullable(),
  participationCount: z.number().optional(),
  thumbnail: z.string().optional().nullable(),
  desktopThumbnail: z.string().optional().nullable(),
  mentorName: z.string().optional().nullable(),
  mentorImg: z.string().optional().nullable(),
  mentorCompany: z.string().optional().nullable(),
  mentorJob: z.string().optional().nullable(),
  mentorCareer: z.string().optional().nullable(),
  mentorIntroduction: z.string().optional().nullable(),
  job: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  beginning: z.string().optional(),
  deadline: z.string().optional(),
  progressType: liveProgressSchema.nullable().optional(),
  classificationInfo: z.array(
    z.object({
      programClassification: ProgramClassificationEnum,
    }),
  ),
  adminClassificationInfo: z
    .array(
      z.object({
        programAdminClassification: ProgramAdminClassificationEnum,
      }),
    )
    .nullable()
    .optional(),
  priceInfo: z.object({
    priceId: z.number(),
    price: z.number().optional().nullable(),
    discount: z.number().optional().nullable(),
    accountNumber: z.string().optional().nullable(),
    deadline: z.string().optional().nullable(),
    accountType: accountType.optional().nullable(),
    livePriceType: livePriceTypeSchema.optional().nullable(),
  }),
  faqInfo: z.array(faq),
  vod: z.boolean().nullable().optional(),
});

export type LiveIdPrimitive = z.infer<typeof getLiveIdPrimitiveSchema>;

/** GET /api/v1/live/{id} 라이브 상세 조회 (어드민, 유저 겸용) */
export const getLiveIdSchema = getLiveIdPrimitiveSchema.transform((data) => {
  return {
    ...data,
    startDate: data.startDate ? dayjs(data.startDate) : null,
    endDate: data.endDate ? dayjs(data.endDate) : null,
    beginning: data.beginning ? dayjs(data.beginning) : null,
    deadline: data.deadline ? dayjs(data.deadline) : null,
    priceInfo: {
      ...data.priceInfo,
      deadline: data.priceInfo.deadline ? dayjs(data.priceInfo.deadline) : null,
    },
  };
});

export type LiveIdSchema = z.infer<typeof getLiveIdSchema>;

/** POST /api/v1/live LIVE 생성 */
export type CreateLiveReq = {
  title: string;
  shortDesc: string;
  desc: string;
  criticalNotice: string;
  participationCount: number;
  thumbnail: string;
  desktopThumbnail?: string;
  mentorName: string;
  mentorImg: string;
  mentorCompany: string;
  mentorJob: string;
  mentorCareer: string;
  mentorIntroduction: string;
  job: string;
  place: string;
  vod: boolean;
  startDate: string; // "2024-10-12T06:48:27.339"
  endDate: string; // "2024-10-12T06:48:27.339"
  beginning: string; // "2024-10-12T06:48:27.339"
  deadline: string; // "2024-10-12T06:48:27.339"
  progressType: LiveProgressType;
  programTypeInfo: {
    classificationInfo: {
      programClassification: ProgramClassification;
    };
  }[];
  // B2 타입
  adminProgramTypeInfo: {
    classificationInfo: {
      programAdminClassification: ProgramAdminClassification;
    };
  }[];
  priceInfo: {
    priceInfo: {
      price: number;
      discount: number;
      accountNumber?: string;
      deadline?: string; // "2024-10-12T06:48:27.339"
      accountType?: AccountType;
    };
    livePriceType: LivePriceType;
  };
  faqInfo: {
    faqId: number;
  }[];
};

/** PATCH /api/v1/live/{id} LIVE 수정 */
export type UpdateLiveReq = {
  title?: string;
  shortDesc?: string;
  desc?: string;
  criticalNotice?: string;
  participationCount?: number;
  thumbnail?: string;
  desktopThumbnail?: string;
  mentorName?: string;
  mentorImg?: string;
  mentorCompany?: string;
  mentorJob?: string;
  mentorCareer?: string;
  mentorIntroduction?: string;
  job?: string;
  place?: string;
  vod?: boolean;
  startDate?: string; // "2024-10-12T06:48:27.339"
  endDate?: string; // "2024-10-12T06:48:27.339"
  beginning?: string; // "2024-10-12T06:48:27.339"
  deadline?: string; // "2024-10-12T06:48:27.339"
  progressType?: LiveProgressType;
  isVisible?: boolean;
  programTypeInfo?: {
    classificationInfo: {
      programClassification: ProgramClassification;
    };
  }[];
  // B2 타입
  adminProgramTypeInfo?: {
    classificationInfo: {
      programAdminClassification: ProgramAdminClassification;
    };
  }[];
  priceInfo?: {
    priceInfo: {
      price: number;
      discount: number;
      accountNumber: string;
      deadline: string; // "2024-10-12T06:48:27.339"
      accountType: AccountType;
    };
    livePriceType: LivePriceType;
  };
  faqInfo?: {
    faqId: number;
  }[];
};

// ADMIN LIVE 클래스 및 VOD 클래스 직무
export const liveAndVodJob = z.enum([
  '대기업 준비',
  '렛커시리즈',
  '경영관리',
  '금융',
  '마케팅',
  '광고',
  '디자인',
  '방송',
  '개발',
  '영업',
  '서비스기획',
  '사업전략',
  '컨설팅',
  '유통',
  '공정연구',
]);

export type LiveAndVodJob = z.infer<typeof liveAndVodJob>;
export const liveJobList: LiveAndVodJob[] = [
  '대기업 준비',
  '렛커시리즈',
  '경영관리',
  '금융',
  '마케팅',
  '광고',
  '디자인',
  '방송',
  '개발',
  '영업',
  '서비스기획',
  '사업전략',
  '컨설팅',
  '유통',
  '공정연구',
];

const vodInfoSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  job: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  isVisible: z.boolean().nullable().optional(),
});

/** GET /api/v1/vod/{id} VOD 상세 조회 (어드민, 유저 겸용) */
export const getVodIdSchema = z.object({
  vodInfo: vodInfoSchema,
  programTypeInfo: z
    .array(
      z.object({
        programClassification: ProgramClassificationEnum.nullable().optional(),
      }),
    )
    .nullable()
    .optional(),
  adminProgramTypeInfo: z
    .array(
      z.object({
        programAdminClassification: ProgramAdminClassificationEnum,
      }),
    )
    .nullable()
    .optional(),
});

export type VodIdSchema = z.infer<typeof getVodIdSchema>;

/** POST /api/v1/vod VOD 생성 */
export type CreateVodReq = {
  title: string;
  shortDesc: string;
  thumbnail: string;
  job: string;
  link: string;
  programTypeInfo: {
    classificationInfo: {
      programClassification: ProgramClassification;
    };
  }[];
  // B2 타입
  adminProgramTypeInfo: {
    classificationInfo: {
      programAdminClassification: ProgramAdminClassification;
    };
  }[];
};

/** PATCH /api/v1/vod VOD 수정 */
export type UpdateVodReq = {
  title?: string;
  shortDesc?: string;
  thumbnail?: string;
  job?: string;
  link?: string;
  isVisible?: boolean;
  programTypeInfo?: {
    classificationInfo: {
      programClassification: ProgramClassification;
    };
  }[];
  // B2 타입
  adminProgramTypeInfo?: {
    classificationInfo: {
      programAdminClassification: ProgramAdminClassification;
    };
  }[];
};

// /**  DELETE /api/v1/vod/{vodId} vod 삭제 */

/** [어드민] 챌린지 1개의 미션 전체 목록 GET /api/v1/mission/{id}/admin */
export const missionAdmin = z
  .object({
    missionList: z.array(
      z.object({
        id: z.number(),
        th: z.number(),
        missionType: z.string(),
        missionStatusType: MissionStatusEnum,
        attendanceCount: z.number(),
        lateAttendanceCount: z.number(),
        wrongAttendanceCount: z.number().optional().nullable(),
        applicationCount: z.number(),
        score: z.number(),
        lateScore: z.number(),
        missionTemplateId: z.number().nullable(),
        startDate: z.string(),
        endDate: z.string(),
        challengeOptionId: z.number().nullable(),
        challengeOptionCode: z.string().nullable(),
        essentialContentsList: z
          .array(
            z
              .object({
                id: z.number(),
                title: z.string(),
                link: z.string(),
              })
              .or(z.null()),
          )
          .or(z.null()),
        additionalContentsList: z
          .array(
            z
              .object({
                id: z.number(),
                title: z.string(),
                link: z.string(),
              })
              .or(z.null()),
          )
          .or(z.null()),
      }),
    ),
  })
  .transform((data) => {
    return {
      missionList: data.missionList.map((mission) => ({
        ...mission,
        startDate: dayjs(mission.startDate),
        endDate: dayjs(mission.endDate),
      })),
    };
  });

export type Mission = z.infer<typeof missionAdmin>['missionList'][number];

export const AttendanceStatusEnum = z.enum([
  'PRESENT',
  'UPDATED',
  'LATE',
  'ABSENT',
]);
export type AttendanceStatus = z.infer<typeof AttendanceStatusEnum>;

export const AttendanceResultEnum = z.enum(['WAITING', 'PASS', 'WRONG']);
export const AttendanceFeedbackStatusEnum = z.enum([
  'WAITING',
  'IN_PROGRESS',
  'COMPLETED',
  'CONFIRMED',
]);

export type AttendanceResult = z.infer<typeof AttendanceResultEnum>;

/** GET /api/v1/challenge/{challengeId}/mission/{missionId}/attendances */
export const attendances = z
  .object({
    attendanceList: z.array(
      z.object({
        attendance: z.object({
          id: z.number(),
          name: z.string().nullable().optional(),
          email: z.string().nullable().optional(),
          status: AttendanceStatusEnum.nullable().optional(),
          link: z.string().nullable().optional(),
          review: z.string().nullable().optional(),
          reviewIsVisible: z.boolean().nullable().optional(),
          result: AttendanceResultEnum.nullable(),
          comments: z.string().nullable().optional(),
          createDate: z.string().nullable(),
          lastModifiedDate: z.string().nullable().optional(),
        }),
        optionCodes: z.array(z.string()),
      }),
    ),
  })
  .transform((data) => {
    return {
      ...data,
      attendanceList: data.attendanceList.map(
        ({ attendance, optionCodes }) => ({
          optionCodes,
          attendance: {
            ...attendance,
            createDate: attendance.createDate
              ? dayjs(attendance.createDate)
              : null,
            lastModifiedDate: attendance.lastModifiedDate
              ? dayjs(attendance.lastModifiedDate)
              : null,
          },
        }),
      ),
    };
  });

export type AttendanceItem = z.infer<
  typeof attendances
>['attendanceList'][number];

/** GET /api/v1/challenge/{challengeId}/title */
export const challengeTitleSchema = z.object({
  title: z.string().optional().nullable(),
});

/** GET /api/v1/live/{liveId}/title */
export const liveTitleSchema = z.object({
  title: z.string().optional().nullable(),
});

/** [유저용] 출석 업데이트 PATCH /api/v1/attendance/{attendanceId} */
export type UpdateAttendanceReq = {
  link?: string;
  status?: AttendanceStatus;
  result?: AttendanceResult;
  comments?: string;
};

/** GET /challenge/{id}/application */
export const getChallengeIdApplication = z
  .object({
    applied: z.boolean(),
    name: z.string(),
    email: z.string(),
    contactEmail: z.string(),
    phoneNumber: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    deadline: z.string(),
    priceList: z.array(
      z.object({
        priceId: z.number().optional().nullable(),
        price: z.number().optional().nullable(),
        discount: z.number().optional().nullable(),
        accountNumber: z.string().optional().nullable(),
        deadline: z.string().optional().nullable(),
        accountType: accountType.optional().nullable(),
        challengePriceType: challengePriceType.optional().nullable(),
        challengeUserType: challengeUserType.optional().nullable(),
        challengeParticipationType: challengeParticipationType
          .optional()
          .nullable(),
      }),
    ),
  })
  .transform((data) => {
    return {
      ...data,
      startDate: dayjs(data.startDate),
      endDate: dayjs(data.endDate),
      deadline: dayjs(data.deadline),
      priceList: data.priceList.map((price) => ({
        ...price,
        deadline: dayjs(price.deadline),
      })),
    };
  });

export const grade = z.union([
  z.literal('GRADUATE'),
  z.literal('FIRST'),
  z.literal('SECOND'),
  z.literal('THIRD'),
  z.literal('FOURTH'),
  z.literal('ETC'),
]);

export type Grade = z.infer<typeof grade>;

export const getChallengeIdApplicationsPayback = z
  .object({
    missionApplications: z.array(
      z.object({
        applicationId: z.number(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        phoneNum: z.string().nullable(),
        scores: z.array(
          z
            .object({
              th: z.number().nullable(),
              score: z.number().nullable(),
            })
            .nullable(),
        ),
        orderId: z.string().nullable(),
        couponName: z.string().nullable(),
        finalPrice: z.number().nullable(),
        paybackPrice: z.number().nullable(),
        isRefunded: z.boolean().nullable(),
      }),
    ),
    pageInfo,
  })
  .transform((data) => {
    return {
      missionApplications: data.missionApplications.map((application) => ({
        ...application,
        id: application.applicationId,
        email: application.email ?? '',
        scores: application.scores
          .filter((s): s is Exclude<typeof s, null> => Boolean(s))
          .map((score) => ({
            ...score,
            score: score.score ?? 0,
          })),
      })),
      pageInfo: data.pageInfo,
    };
  });

/** PATCH /api/v1/challenge/{challengeId}/application/{applicationId}/payback  */
export type UpdatePaybackReq = {
  adminScore?: number;
  isRefunded?: boolean;
};

const contentsType = z.union([z.literal('ESSENTIAL'), z.literal('ADDITIONAL')]);

type ContentsType = z.infer<typeof contentsType>;

/// POST /api/v1/mission/{id}
const postMissionIdReq = z.object({
  th: z.number(),
  title: z.string(),
  score: z.number(),
  lateScore: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  missionTemplateId: z.number().or(z.null()),
  essentialContentsIdList: z.array(z.number()),
  additionalContentsIdList: z.array(z.number()),
});

export type CreateMissionReq = z.infer<typeof postMissionIdReq>;

/// PATCH /api/v1/mission/{id}
const patchMissionIdReq = z.object({
  th: z.number().optional(),
  title: z.string().optional(),
  score: z.number().optional(),
  lateScore: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  missionTemplateId: z.number().optional(),
  essentialContentsIdList: z.array(z.number()).optional(),
  additionalContentsIdList: z.array(z.number()).optional(),
});

export type UpdateMissionReq = z.infer<typeof patchMissionIdReq>;

// GET /api/v1/mission-template/admin
export const missionTemplateAdmin = z
  .object({
    missionTemplateAdminList: z.array(
      z.object({
        id: z.number(),
        createDate: z.string(),
        missionTag: z.string(),
        title: z.string(),
        description: z.string(),
        guide: z.string(),
        templateLink: z.string().nullish(),
        vodLink: z.string().nullish(),
      }),
    ),
  })
  .transform((data) => {
    return {
      missionTemplateAdminList: data.missionTemplateAdminList.map(
        (missionTemplate) => ({
          ...missionTemplate,
          createDate: dayjs(missionTemplate.createDate),
        }),
      ),
    };
  });

export type MissionTemplateResItem = z.infer<
  typeof missionTemplateAdmin
>['missionTemplateAdminList'][number];

// POST /api/v1/mission-template
export type CreateMissionTemplateReq = {
  missionTag: string;
  title: string;
  description: string;
  guide: string;
  templateLink: string;
  vodLink?: string | null;
};

// PATCH /api/v1/mission-template/{id}
export type UpdateMissionTemplateReq = {
  missionTag?: string;
  title?: string;
  description?: string;
  guide?: string;
  templateLink?: string;
  vodLink?: string | null;
};

// POST /api/v1/contents
export type CreateContentsReq = {
  type: ContentsType;
  title: string;
  link: string;
};

// PATCH /api/v1/contents/{id}
export type UpdateContentsReq = {
  type?: ContentsType;
  title?: string;
  link?: string;
};

/** GET /api/v1/contents/admin */
export const getContentsAdmin = z
  .object({
    contentsAdminList: z.array(
      z.object({
        id: z.number(),
        type: contentsType.nullable().optional(),
        title: z.string().nullable().optional(),
        link: z.string().nullable().optional(),
        createDate: z.string(),
      }),
    ),
    pageInfo,
  })
  .transform((data) => {
    return {
      contentsAdminList: data.contentsAdminList.map((content) => ({
        ...content,
        createDate: dayjs(content.createDate),
      })),
      pageInfo: data.pageInfo,
    };
  });

export type ContentsResItem = z.infer<
  typeof getContentsAdmin
>['contentsAdminList'][number];

/** GET /api/v1/contents/admin/simple  */
export const getContentsAdminSimple = z.object({
  contentsSimpleList: z.array(
    z.object({
      id: z.number(),
      title: z.string().or(z.null()),
    }),
  ),
});

// GET /api/v1/challenge/{id}/notices
export const challengeNotices = z
  .object({
    challengeNoticeList: z.array(
      z.object({
        id: z.number(),
        type: contentsType.nullable(),
        title: z.string().nullable(),
        link: z.string().nullable(),
        createDate: z.string().nullable(),
      }),
    ),
    pageInfo,
  })
  .transform((data) => {
    return {
      challengeNoticeList: data.challengeNoticeList.map((content) => ({
        ...content,
        createDate: dayjs(content.createDate),
      })),
      pageInfo: data.pageInfo,
    };
  });

export type ChallengeNotice = z.infer<
  typeof challengeNotices
>['challengeNoticeList'][number];

// POST /api/v1/challenge-notice/{id}
export type CreateChallengeNoticeReq = {
  type: ContentsType;
  title: string;
  link: string;
};

// PATCH /api/v1/challenge-notice/{id}
export type UpdateChallengeNoticeReq = {
  type: ContentsType;
  title: string;
  link: string;
};

// GET /api/v1/challenge/{id}/guides
export const challengeGuides = z
  .object({
    challengeGuideList: z.array(
      z.object({
        id: z.number(),
        title: z.string().nullable(),
        link: z.string().nullable(),
        createDate: z.string().nullable(),
      }),
    ),
  })
  .transform((data) => {
    return {
      challengeGuideList: data.challengeGuideList.map((content) => ({
        ...content,
        createDate: content.createDate ? dayjs(content.createDate) : null,
      })),
    };
  });

export type ChallengeGuide = z.infer<
  typeof challengeGuides
>['challengeGuideList'][number];

// POST /api/v1/challenge-guide/{id}
export type CreateChallengeGuideReq = {
  title: string;
  link: string;
};

// PATCH /api/v1/challenge-guide/{id}
export type UpdateChallengeGuideReq = {
  title: string;
  link: string;
};

// GET /api/v1/challenge/{id}/schedule 챌린지 대시보드 일정 및 미션 제출 현황
export const challengeSchedule = z
  .object({
    scheduleList: z.array(
      z.object({
        missionInfo: z.object({
          id: z.number(),
          title: z.string().nullable(),
          th: z.number().nullable(),
          startDate: z.string().nullable(),
          endDate: z.string().nullable(),
          status: MissionStatusEnum.nullable(),
        }),
        attendanceInfo: z.object({
          submitted: z.boolean().nullable(),
          id: z.number().nullable(),
          link: z.string().nullable(),
          review: z.string().nullable().optional(),
          comments: z.string().nullable(),
          status: AttendanceStatusEnum.nullable(),
          result: AttendanceResultEnum.nullable(),
        }),
      }),
    ),
  })
  .transform((data) => {
    return {
      scheduleList: data.scheduleList.map((schedule) => ({
        ...schedule,
        missionInfo: {
          ...schedule.missionInfo,
          startDate: schedule.missionInfo.startDate
            ? dayjs(schedule.missionInfo.startDate)
            : null,
          endDate: schedule.missionInfo.endDate
            ? dayjs(schedule.missionInfo.endDate)
            : null,
        },
        attendanceInfo: {
          ...schedule.attendanceInfo,
        },
      })),
    };
  });

export type Schedule = z.infer<
  typeof challengeSchedule
>['scheduleList'][number];

export type ScheduleMission = Schedule['missionInfo'];

// GET /api/v1/challenge/{challengeId}/missions/{missionId} 나의 기록장 미션 상세
export const userChallengeMissionDetail = z
  .object({
    missionInfo: z.object({
      id: z.number(),
      th: z.number().nullable(),
      title: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      essentialContentsList: z.array(
        z.object({
          id: z.number(),
          title: z.string().nullable(),
          link: z.string().nullable(),
        }),
      ),
      additionalContentsList: z.array(
        z.object({
          id: z.number(),
          title: z.string().nullable(),
          link: z.string().nullable(),
        }),
      ),
      status: MissionStatusEnum,
      missionTag: z.string().nullish(),
      description: z.string().nullish(),
      guide: z.string().nullish(),
      templateLink: z.string().nullish(),
      vodLink: z.string().nullish(),
    }),
  })
  .transform((data) => {
    return {
      missionInfo: {
        ...data.missionInfo,
        startDate: dayjs(data.missionInfo.startDate),
        endDate: dayjs(data.missionInfo.endDate),
      },
    };
  });

export type UserChallengeMissionDetail = z.infer<
  typeof userChallengeMissionDetail
>['missionInfo'];

// GET /api/v1/challenge/{challengeId}/missions/{missionId} 미션 상세 + attendanceInfo
export const userChallengeMissionWithAttendance = z
  .object({
    missionInfo: z.object({
      id: z.number(),
      th: z.number().nullable(),
      title: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      essentialContentsList: z.array(
        z.object({
          id: z.number(),
          title: z.string().nullable(),
          link: z.string().nullable(),
        }),
      ),
      additionalContentsList: z.array(
        z.object({
          id: z.number(),
          title: z.string().nullable(),
          link: z.string().nullable(),
        }),
      ),
      status: MissionStatusEnum,
      missionTag: z.string().nullish(),
      description: z.string().nullish(),
      guide: z.string().nullish(),
      templateLink: z.string().nullish(),
    }),
    attendanceInfo: z
      .object({
        submitted: z.boolean(),
        id: z.number().nullable(),
        link: z.string().nullable(),
        review: z.string().nullable().optional(),
        comments: z.string().nullable(),
        status: AttendanceStatusEnum.nullable(),
        result: AttendanceResultEnum.nullable(),
        feedbackStatus: AttendanceFeedbackStatusEnum.nullable(),
        accountType: z.string().nullish(),
        accountNum: z.string().nullish(),
      })
      .nullable(),
  })
  .transform((data) => {
    return {
      missionInfo: {
        ...data.missionInfo,
        startDate: dayjs(data.missionInfo.startDate),
        endDate: dayjs(data.missionInfo.endDate),
      },
      attendanceInfo: data.attendanceInfo,
    };
  });

export type UserChallengeMissionWithAttendance = z.infer<
  typeof userChallengeMissionWithAttendance
>;

/** GET /api/v1/challenge/{id}/daily-mission */
export const dailyMissionSchema = z
  .object({
    dailyMission: z
      .object({
        id: z.number(),
        th: z.number().nullable(),
        title: z.string().nullable(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        missionTag: z.string().nullable(),
        description: z.string().nullable(),
      })
      .nullable(),
  })
  .transform((data) => {
    return {
      dailyMission: data.dailyMission
        ? {
            ...data.dailyMission,
            startDate: data.dailyMission.startDate
              ? dayjs(data.dailyMission.startDate)
              : null,
            endDate: data.dailyMission.startDate
              ? dayjs(data.dailyMission.endDate)
              : null,
          }
        : null,
    };
  });

export type DailyMission = z.infer<typeof dailyMissionSchema>['dailyMission'];

// KAKAO, NAVER, GOOGLE, SERVICE
export const authProviderSchema = z.union([
  z.literal('KAKAO'),
  z.literal('NAVER'),
  z.literal('GOOGLE'),
  z.literal('SERVICE'),
]);

/** GET /api/v1/challenge/{id}/score */
export const challengeScore = z.object({
  totalScore: z.number(),
  currentScore: z.number(),
});

/** GET /api/v1/challenge/{id}/my/daily-mission 챌린지 나의 기록장 데일리 미션 */
export const myDailyMission = z
  .object({
    dailyMission: z
      .object({
        id: z.number(),
        th: z.number().nullable(),
        title: z.string().nullable(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        essentialContentsList: z.array(
          z.object({
            id: z.number(),
            title: z.string().nullable(),
            link: z.string().nullable(),
          }),
        ),
        additionalContentsList: z.array(
          z.object({
            id: z.number(),
            title: z.string().nullable(),
            link: z.string().nullable(),
          }),
        ),
        status: MissionStatusEnum,
        missionTag: z.string().nullable(),
        description: z.string().nullable(),
        guide: z.string().nullable(),
        templateLink: z.string().nullable(),
      })
      .nullable(),
    attendanceInfo: z
      .object({
        submitted: z.boolean(),
        id: z.number().nullable(),
        link: z.string().nullable(),
        review: z.string().nullable().optional(),
        comments: z.string().nullable(),
        status: AttendanceStatusEnum.nullable(),
        result: AttendanceResultEnum.nullable(),
        accountType: z.string().nullish(),
        accountNum: z.string().nullish(),
      })
      .nullable(),
  })
  .transform((data) => {
    return {
      ...data,
      dailyMission: data.dailyMission
        ? {
            ...data.dailyMission,
            startDate: data.dailyMission.startDate
              ? dayjs(data.dailyMission.startDate)
              : null,
            endDate: data.dailyMission.endDate
              ? dayjs(data.dailyMission.endDate)
              : null,
          }
        : null,
    };
  });

export type MyDailyMission = z.infer<typeof myDailyMission>;

// GET /api/v1/challenge/{challengeId}/missions?type=GENERAL
export const myChallengeMissionsByType = z.object({
  missionList: z.array(
    z.object({
      attendanceLink: z.string().nullable().optional(),
      attendanceResult: AttendanceResultEnum.nullable().optional(),
      attendanceStatus: AttendanceStatusEnum.nullable().optional(),
      id: z.number(),
      th: z.number().nullable(),
      title: z.string().nullable(),
    }),
  ),
});

export type MyChallengeMissionByType = z.infer<
  typeof myChallengeMissionsByType
>['missionList'][number];

/** GET /api/v1/challenge/{id}/applications [어드민] 프로그램 신청자 조회 */
export const challengeApplicationsSchema = z
  .object({
    applicationList: z.array(
      z.object({
        application: z.object({
          id: z.number(),
          paymentId: z.number().nullable().optional(),
          name: z.string().nullable().optional(),
          email: z.string().nullable().optional(),
          phoneNum: z.string().nullable().optional(),
          university: z.string().nullable().optional(),
          grade: grade.nullable().optional(),
          major: z.string().nullable().optional(),
          couponName: z.string().nullable().optional(),
          couponDiscount: z.number().nullable().optional(),
          isCanceled: z.boolean().nullable().optional(),
          wishJob: z.string().nullable().optional(),
          wishCompany: z.string().nullable().optional(),
          inflowPath: z.string().nullable().optional(),
          createDate: z.string().nullable().optional(),
          accountType: accountType.nullable().optional(),
          accountNum: z.string().nullable().optional(),
          orderId: z.string().nullable().optional(),
          finalPrice: z.number().nullable().optional(),
          programDiscount: z.number().nullable().optional(),
          programPrice: z.number().nullable().optional(),
          refundPrice: z.number().nullable().optional(),
          challengePricePlanType: ChallengePricePlanEnum.nullable().optional(),
        }),
        optionPriceSum: z.number().nullable().optional(),
        optionDiscountPriceSum: z.number().nullable().optional(),
      }),
    ),
  })
  .transform((data) => {
    return {
      applicationList: data.applicationList.map((item) => ({
        ...item,
        application: {
          ...item.application,
          createDate: dayjs(item.application.createDate),
        },
      })),
    };
  });

export type ChallengeApplication = z.infer<
  typeof challengeApplicationsSchema
>['applicationList'][number];

/** GET /api/v1/live/{id}/applications 어드민 신청자 조회 LIVE 클래스 */
export const liveApplicationsSchema = z
  .object({
    applicationList: z.array(
      z.object({
        id: z.number(),
        paymentId: z.number().nullable().optional(),
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        phoneNum: z.string().nullable().optional(),
        university: z.string().nullable().optional(),
        major: z.string().nullable().optional(),
        grade: grade.nullable().optional(),
        motivate: z.string().nullable().optional(),
        question: z.string().nullable().optional(),
        couponName: z.string().nullable().optional(),
        couponDiscount: z.number().nullable().optional(),
        isCanceled: z.boolean().nullable().optional(),
        created_date: z.string().nullable().optional(),
        orderId: z.string().nullable().optional(),
        finalPrice: z.number().nullable().optional(),
        programDiscount: z.number().nullable().optional(),
        programPrice: z.number().nullable().optional(),
      }),
    ),
  })
  .transform((data) => {
    return {
      applicationList: data.applicationList.map((application) => ({
        ...application,
        created_date: dayjs(application.created_date),
      })),
    };
  });

export type LiveApplication = z.infer<
  typeof liveApplicationsSchema
>['applicationList'][number];

/** POST /api/v1/review/{id} */
export type CreateReviewByLinkReq = {
  programId: number;
  npsAns: string;
  npsCheckAns: boolean;
  nps: number;
  content: string;
  score: number;
};

export type CreateReviewByLinkProgramType = 'CHALLENGE' | 'LIVE' | 'VOD';

/** GET /api/v1/live/{liveId}/mentor/{password} [어드민] 라이브 멘토 전달 내용 조회 */

export const mentorNotificationSchema = z
  .object({
    liveMentorVo: z.object({
      id: z.number().nullable().optional(),
      title: z.string().nullable().optional(),
      participationCount: z.number().nullable().optional(),
      mentorName: z.string().nullable().optional(),
      zoomLink: z.string().nullable().optional(),
      zoomPassword: z.string().nullable().optional(),
      place: z.string().nullable().optional(),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
    }),
    questionList: z.array(z.string()).nullable().optional(),
    motivateList: z.array(z.string()).nullable().optional(),
    reviewList: z.array(
      z.object({
        questionType: z.string().optional().nullable(),
        answer: z.string().optional().nullable(),
      }),
    ),
  })
  .transform((data) => {
    return {
      ...data,
      liveMentorVo: {
        ...data.liveMentorVo,
        startDate: data.liveMentorVo.startDate
          ? dayjs(data.liveMentorVo.startDate)
          : null,
        endDate: data.liveMentorVo.endDate
          ? dayjs(data.liveMentorVo.endDate)
          : null,
      },
      questionList: data.questionList ?? [],
      motivateList: data.motivateList ?? [],
      reviewList: data.reviewList ?? [],
    };
  });

export type MentorNotificationType = 'PREV' | 'REVIEW';

export const adminMentorInfoSchema = z.object({
  mentorPassword: z.string().nullable().optional(),
});

export const ProgramStatusEnum = z.enum(['PREV', 'PROCEEDING', 'POST']);
export type ProgramStatus = z.infer<typeof ProgramStatusEnum>;

export const programStatusList = ['PREV', 'PROCEEDING', 'POST'];

export const challengeApplicationPriceType = z.object({
  priceId: z.number().nullable().optional(),
  price: z.number().nullable().optional(),
  refund: z.number().nullable().optional(),
  discount: z.number().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  accountType: accountType.nullable().optional(),
  challengePriceType,
  challengePricePlanType: ChallengePricePlanEnum,
  challengeParticipationType,
});

export const liveApplicationPriceType = z.object({
  priceId: z.number().nullable().optional(),
  price: z.number().nullable().optional(),
  discount: z.number().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  accountType: accountType.nullable().optional(),
  livePriceType: livePriceTypeSchema,
});

export const userAdminDetailType = z.object({
  userInfo: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    contactEmail: z.string().nullable(),
    phoneNum: z.string(),
    university: z.string().nullable(),
    inflowPath: z.string().nullable(),
    grade: z.string().nullable(),
    major: z.string().nullable(),
    wishJob: z.string().nullable(),
    wishCompany: z.string().nullable(),
    accountType: accountType.nullable(),
    accountNum: z.string().nullable(),
    marketingAgree: z.boolean().nullable(),
    authProvider: authProviderSchema.nullable(),
  }),
  applicationInfo: z.array(
    z.object({
      programId: z.number().nullable(),
      programTitle: z.string(),
    }),
  ),
});

export type UserAdminDetail = z.infer<typeof userAdminDetailType>;

export const classificationSchema = z.object({
  programClassification: ProgramClassificationEnum.nullable().optional(),
});

const programInfoSchema = z.object({
  id: z.number(),
  programType: ProgramTypeEnum,
  programStatusType: ProgramStatusEnum,
  title: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  beginning: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
});

/** GET /api/v1/program */
export const programSchema = z.object({
  programList: z.array(
    z.object({
      programInfo: programInfoSchema,
      classificationList: z.array(classificationSchema),
    }),
  ),
  pageInfo,
});

export type Program = z.infer<typeof programSchema>;
export type ProgramInfo = z.infer<typeof programSchema>['programList'][0];

export const programAdminItemSchema = z.object({
  programInfo: z.object({
    id: z.number(),
    programType: ProgramTypeEnum,
    programStatusType: ProgramStatusEnum,
    title: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    beginning: z.string().nullable().optional(),
    deadline: z.string().nullable().optional(),
    currentCount: z.number().nullable().optional(),
    participationCount: z.number().nullable().optional(),
    zoomLink: z.string().nullable().optional(),
    zoomPassword: z.string().nullable().optional(),
    isVisible: z.boolean().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
  }),
  classificationList: z.array(classificationSchema),
  adminClassificationList: z
    .array(
      z.object({
        programAdminClassification: ProgramAdminClassificationEnum,
      }),
    )
    .nullable()
    .optional(),
});

export type ProgramAdminItem = z.infer<typeof programAdminItemSchema>;

/** GET /api/v1/program/admin */
export const programAdminSchema = z.object({
  programList: z.array(programAdminItemSchema),
  pageInfo,
});

export type ProgramAdminList = z.infer<
  typeof programAdminSchema
>['programList'];

export type ProgramAdminListItem = z.infer<
  typeof programAdminSchema
>['programList'][0];

export const programRecommendSchema = z.object({
  challengeList: z.array(
    z.object({
      id: z.number(),
      programType: ProgramTypeEnum.optional().nullable(),
      programStatusType: ProgramStatusEnum.optional().nullable(),
      challengeType: challengeTypeSchema.optional().nullable(),
      title: z.string().optional().nullable(),
      thumbnail: z.string().optional().nullable(),
      shortDesc: z.string().optional().nullable(),
      startDate: z.string().optional().nullable(),
      endDate: z.string().optional().nullable(),
      beginning: z.string().optional().nullable(),
      deadline: z.string().optional().nullable(),
    }),
  ),
  live: programInfoSchema.optional().nullable(),
  vodList: z.array(vodInfoSchema),
  reportList: z.array(
    z.object({
      id: z.number(),
      programType: ProgramTypeEnum.optional().nullable(),
      programStatusType: ProgramStatusEnum.optional().nullable(),
      reportType: reportTypeSchema,
      title: z.string().optional().nullable(),
      notice: z.string().optional().nullable(),
      isVisible: z.boolean().optional().nullable(),
      visibleDate: z.string().optional().nullable(),
    }),
  ),
});

export type ProgramRecommend = z.infer<typeof programRecommendSchema>;

export const programBannerAdminSchema = z.object({
  id: z.number(),
  title: z.string(),
  link: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isValid: z.boolean(),
  isVisible: z.boolean(),
  imgUrl: z.string(),
  mobileImgUrl: z.string(),
});

export const programBannerUserSchema = z.object({
  id: z.number(),
  title: z.string(),
  link: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isValid: z.boolean(),
  imgUrl: z.string(),
  mobileImgUrl: z.string(),
});

export const programBannerAdminListSchema = z.object({
  bannerList: z.array(programBannerAdminSchema),
});

export const programBannerUserListSchema = z.object({
  bannerList: z.array(programBannerUserSchema),
});

export const programBannerAdminDetailSchema = z.object({
  bannerAdminDetailVo: programBannerAdminSchema,
});

export const liveListItemSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  createDate: z.string(),
  job: z.string().nullable().optional(),
});

export const liveListResponseSchema = z.object({
  programList: z.array(liveListItemSchema),
  pageInfo,
});

export const vodListItemSchema = z.object({
  id: z.number(),
  title: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  job: z.string().nullable().optional(),
});

export const vodListResponseSchema = z.object({
  programList: z.array(vodListItemSchema),
  pageInfo,
});

export const UserRoleEnum = z.enum(['ADMIN', 'USER']);
