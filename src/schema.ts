import dayjs from 'dayjs';
import { z } from 'zod';

const pageinfo = z.object({
  pageNum: z.number().gte(0),
  pageSize: z.number().gte(0),
  totalElements: z.number().gte(0),
  totalPages: z.number().gte(0),
});

export const getChallenge = z
  .object({
    programList: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        shortDesc: z.string(),
        thumbnail: z.string().url(),
        startDate: z.string(),
        endDate: z.string(),
        beginning: z.string(),
        deadline: z.string(),
        createDate: z.string(),
      }),
    ),
    pageInfo: pageinfo,
  })
  .transform((data) => {
    return {
      programList: data.programList.map((program) => ({
        ...program,
        startDate: dayjs(program.startDate),
        endDate: dayjs(program.endDate),
        beginning: dayjs(program.beginning),
        deadline: dayjs(program.deadline),
        createDate: dayjs(program.createDate),
      })),
      pageInfo: data.pageInfo,
    };
  });

export const challengeType = z.union([
  z.literal('CAREER_START'),
  z.literal('DOCUMENT_PREPARATION'),
  z.literal('MEETING_PREPARATION'),
  z.literal('ETC'),
]);

export const programClassification = z.union([
  z.literal('CAREER_SEARCH'),
  z.literal('DOCUMENT_PREPARATION'),
  z.literal('MEETING_PREPARATION'),
  z.literal('PASS'),
]);

export const challengePriceType = z.union([
  z.literal('CHARGE'),
  z.literal('REFUND'),
]);

export const challengeUserType = z.union([
  z.literal('BASIC'),
  z.literal('PREMIUM'),
]);

export const challengeParticipationType = z.union([
  z.literal('LIVE'),
  z.literal('FREE'),
]);

export const faqProgramType = z.union([
  z.literal('CHALLENGE'),
  z.literal('LIVE'),
  z.literal('VOD'),
]);

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

export const missionStatusType = z.union([
  z.literal('WAITING'),
  z.literal('CHECK_DONE'),
  z.literal('REFUND_DONE'),
]);

export const getChallengeId = z
  .object({
    title: z.string(),
    shortDesc: z.string(),
    desc: z.string(),
    participationCount: z.number(),
    thumbnail: z.string().url(),
    startDate: z.string(),
    endDate: z.string(),
    beginning: z.string(),
    deadline: z.string(),
    chatLink: z.string(),
    chatPassword: z.string(),
    challengeType: challengeType,
    classificationInfo: z.array(
      z.object({
        programClassification: programClassification,
      }),
    ),
    priceInfo: z.array(
      z.object({
        priceId: z.number(),
        price: z.number(),
        discount: z.number(),
        accountNumber: z.string(),
        deadline: z.string(),
        accountType: accountType,
        challengePriceType: challengePriceType,
        challengeUserType: challengeUserType,
        challengeParticipationType: challengeParticipationType,
      }),
    ),
    faqInfo: z.array(
      z.object({
        id: z.number(),
        question: z.string(),
        answer: z.string(),
        faqProgramType: faqProgramType,
      }),
    ),
  })
  .transform((data) => {
    return {
      ...data,
      startDate: dayjs(data.startDate),
      endDate: dayjs(data.endDate),
      beginning: dayjs(data.beginning),
      deadline: dayjs(data.deadline),
      priceInfo: data.priceInfo.map((price) => ({
        ...price,
        deadline: dayjs(price.deadline),
      })),
    };
  });

export const getMissionAdminId = z
  .object({
    missionList: z.array(
      z.object({
        id: z.number(),
        th: z.number(),
        missionStatusType: missionStatusType,
        attendanceCount: z.number(),
        lateAttendanceCount: z.number(),
        score: z.number(),
        lateScore: z.number(),
        startDate: z.string(),
        endDate: z.string(),
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

/** 참여 폼 */
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
        priceId: z.number(),
        price: z.number(),
        discount: z.number(),
        accountNumber: z.string(),
        deadline: z.string(),
        accountType: accountType,
        challengePriceType: challengePriceType,
        challengeUserType: challengeUserType,
        challengeParticipationType: challengeParticipationType,
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

/** 참여자 */
export const getChallengeIdApplications = z
  .object({
    applicationList: z.array(
      z.object({
        id: z.number(),
        paymentId: z.number(),
        name: z.string(),
        email: z.string(),
        phoneNum: z.string(),
        university: z.string().or(z.null()),
        grade: grade.or(z.null()),
        major: z.string().or(z.null()),
        couponName: z.string().or(z.null()),
        totalCost: z.number(),
        isConfirmed: z.boolean(),
        wishJob: z.string().or(z.null()),
        wishCompany: z.string().or(z.null()),
        inflowPath: z.string().or(z.null()),
        createDate: z.string(),
        accountType: accountType.or(z.null()),
        accountNum: z.string().or(z.null()),
      }),
    ),
  })
  .transform((data) => {
    return {
      applicationList: data.applicationList.map((application) => ({
        ...application,
        createDate: dayjs(application.createDate),
      })),
    };
  });

export const getChallengeIdApplicationsPayback = z
  .object({
    missionApplications: z.array(
      z.object({
        applicationId: z.number(),
        name: z.string(),
        // TODO: remove null
        email: z.string().or(z.null()),
        phoneNum: z.string(),
        accountNum: z.string(),
        accountType: accountType,
        scores: z.array(
          z
            .object({
              th: z.number(),
              // TODO: remove null
              score: z.number().or(z.null()),
            })
            // TODO: remove null
            .or(z.null()),
        ),
        isRefunded: z.boolean(),
      }),
    ),
    pageInfo: pageinfo,
  })
  // TODO: remove transform
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

/// patch /api/v1/challenge/{challengeId}/application/{applicationId}/payback
export const patchChallengeIdApplicationIdPaybackVariables = z.object({
  adminScore: z.number(),
  isRefunded: z.boolean(),
});

export const missionType = z.union([
  z.literal('GENERAL'),
  z.literal('REWARD'),
  z.literal('REFUND'),
]);

export const contentsType = z.union([
  z.literal('ESSENTIAL'),
  z.literal('ADDITIONAL'),
]);

export type ContentsType = z.infer<typeof contentsType>;

/// POST /api/v1/mission/{id}
export const postMissionIdReq = z.object({
  th: z.number(),
  title: z.string(),
  type: missionType,
  refund: z.number(),
  score: z.number(),
  lateScore: z.number(),
  startDate: z.string(),
  missionTemplateId: z.number(),
  essentialContentsIdList: z.array(z.number()),
  additionalContentsIdList: z.array(z.number()),
  limitedContentsIdList: z.array(z.number()),
});

export type CreateMissionReq = z.infer<typeof postMissionIdReq>;

/// PATCH /api/v1/mission/{id}
export const patchMissionIdReq = z.object({
  th: z.number(),
  title: z.string(),
  type: missionType,
  score: z.number(),
  lateScore: z.number(),
  startDate: z.string(),
  missionTemplateId: z.number(),
  essentialContentsIdList: z.array(z.number()),
  additionalContentsIdList: z.array(z.number()),
});

export type UpdateMissionReq = z.infer<typeof patchMissionIdReq>;

// GET /api/v1/mission-template/admin
export const getMissionTemplateAdmin = z
  .object({
    missionTemplateAdminList: z.array(
      z.object({
        id: z.number(),
        createDate: z.string(),
        missionTag: z.string(),
        title: z.string(),
        description: z.string(),
        guide: z.string(),
        templateLink: z.string(),
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
  typeof getMissionTemplateAdmin
>['missionTemplateAdminList'][number];

// POST /api/v1/mission-template
export type CreateMissionTemplateReq = {
  missionTag: string;
  title: string;
  description: string;
  guide: string;
  templateLink: string;
};

// PATCH /api/v1/mission-template/{id}
export type UpdateMissionTemplateReq = {
  missionTag?: string;
  title?: string;
  description?: string;
  guide?: string;
  templateLink?: string;
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
        type: contentsType,
        title: z.string(),
        link: z.string(),
        createDate: z.string(),
      }),
    ),
    pageInfo: pageinfo,
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

/** GET /api/v1/contents/admin/simple  */
export const getContentsAdminSimple = z.object({
  contentsSimpleList: z.array(
    z.object({
      id: z.number(),
      title: z.string().or(z.null()),
    }),
  ),
});
