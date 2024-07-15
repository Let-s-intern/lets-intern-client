import dayjs from 'dayjs';
import { z } from 'zod';

const pageinfo = z.object({
  pageNum: z.number().gte(0),
  pageSize: z.number().gte(0),
  totalElements: z.number().gte(0),
  totalPages: z.number().gte(0),
});

/** GET /api/v1/challenge */
export const challenges = z
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
    pageInfo: pageinfo,
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

const challengeType = z.union([
  z.literal('CAREER_START'),
  z.literal('DOCUMENT_PREPARATION'),
  z.literal('MEETING_PREPARATION'),
  z.literal('ETC'),
]);

const programClassification = z.union([
  z.literal('CAREER_SEARCH'),
  z.literal('DOCUMENT_PREPARATION'),
  z.literal('MEETING_PREPARATION'),
  z.literal('PASS'),
]);

const challengePriceType = z.union([z.literal('CHARGE'), z.literal('REFUND')]);

const challengeUserType = z.union([z.literal('BASIC'), z.literal('PREMIUM')]);

const challengeParticipationType = z.union([
  z.literal('LIVE'),
  z.literal('FREE'),
]);

const livePriceType = z.union([z.literal('CHARGE'), z.literal('FREE')]);

const faqProgramType = z.union([
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

const missionStatusType = z.union([
  z.literal('WAITING'),
  z.literal('CHECK_DONE'),
  z.literal('REFUND_DONE'),
]);

/** GET /api/v1/challenge/{id} */
export const getChallengeIdSchema = z
  .object({
    title: z.string().nullable().optional(),
    shortDesc: z.string().nullable().optional(),
    desc: z.string().nullable().optional(),
    participationCount: z.number().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    beginning: z.string().nullable().optional(),
    deadline: z.string().nullable().optional(),
    chatLink: z.string().nullable().optional(),
    chatPassword: z.string().nullable().optional(),
    challengeType: challengeType,
    classificationInfo: z.array(
      z.object({
        programClassification: programClassification.nullable().optional(),
      }),
    ),
    priceInfo: z.array(
      z.object({
        priceId: z.number(),
        price: z.number().nullable().optional(),
        discount: z.number().nullable().optional(),
        accountNumber: z.string().nullable().optional(),
        deadline: z.string().nullable().optional(),
        accountType: accountType.nullable().optional(),
        challengePriceType: challengePriceType.nullable().optional(),
        challengeUserType: challengeUserType.nullable().optional(),
        challengeParticipationType: challengeParticipationType
          .nullable()
          .optional(),
      }),
    ),
    faqInfo: z.array(
      z.object({
        id: z.number(),
        question: z.string().nullable().optional(),
        answer: z.string().nullable().optional(),
        faqProgramType: faqProgramType.nullable().optional(),
      }),
    ),
  })
  .transform((data) => {
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
  });

/** GET /api/v1/live/{id} 라이브 상세 조회 */
export const getLiveIdSchema = z
  .object({
    title: z.string().nullable().optional(),
    shortDesc: z.string().nullable().optional(),
    desc: z.string().nullable().optional(),
    criticalNotice: z.string().nullable().optional(),
    participationCount: z.number().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    mentorName: z.string().nullable().optional(),
    mentorPassword: z.string().nullable().optional(),
    job: z.string().nullable().optional(),
    place: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    beginning: z.string().nullable().optional(),
    deadline: z.string().nullable().optional(),
    progressType: z.string().nullable().optional(),
    classificationInfo: z.array(
      z.object({
        programClassification: programClassification.nullable().optional(),
      }),
    ),
    priceInfo: z.object({
      priceId: z.number(),
      price: z.number().nullable().optional(),
      discount: z.number().nullable().optional(),
      accountNumber: z.string().nullable().optional(),
      deadline: z.string().nullable().optional(),
      accountType: accountType.nullable().optional(),
      livePriceType: livePriceType.nullable().optional(),
    }),
    faqInfo: z.array(
      z.object({
        id: z.number(),
        question: z.string().nullable().optional(),
        answer: z.string().nullable().optional(),
        faqProgramType: faqProgramType.nullable().optional(),
      }),
    ),
  })
  .transform((data) => {
    return {
      ...data,
      startDate: data.startDate ? dayjs(data.startDate) : null,
      endDate: data.endDate ? dayjs(data.endDate) : null,
      beginning: data.beginning ? dayjs(data.beginning) : null,
      deadline: data.deadline ? dayjs(data.deadline) : null,
      priceInfo: {
        ...data.priceInfo,
        deadline: data.priceInfo.deadline
          ? dayjs(data.priceInfo.deadline)
          : null,
      },
    };
  });

/** GET /api/v1/mission/{id}/admin */
export const missionAdmin = z
  .object({
    missionList: z.array(
      z.object({
        id: z.number(),
        th: z.number(),
        missionType: z.string(),
        missionStatusType: missionStatusType,
        attendanceCount: z.number(),
        lateAttendanceCount: z.number(),
        applicationCount: z.number(),
        score: z.number(),
        lateScore: z.number(),
        missionTemplateId: z.number().nullable(),
        startDate: z.string(),
        endDate: z.string(),
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

const attendanceStatus = z.union([
  z.literal('PRESENT'),
  z.literal('UPDATED'),
  z.literal('LATE'),
  z.literal('ABSENT'),
]);

export type AttendanceStatus = z.infer<typeof attendanceStatus>;

const attendanceResult = z.union([
  z.literal('WAITING'),
  z.literal('PASS'),
  z.literal('WRONG'),
]);

export type AttendanceResult = z.infer<typeof attendanceResult>;

/** GET /api/v1/challenge/{challengeId}/mission/{missionId}/attendances */
export const attendances = z
  .object({
    attendanceList: z.array(
      z.object({
        id: z.number(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        status: attendanceStatus.nullable(),
        link: z.string().nullable(),
        result: attendanceResult.nullable(),
        comments: z.string().nullable().optional(),
        createDate: z.string().nullable(),
        lastModifiedDate: z.string().nullable(),
      }),
    ),
  })
  .transform((data) => {
    return {
      attendanceList: data.attendanceList.map((attendance) => ({
        ...attendance,
        createDate: attendance.createDate ? dayjs(attendance.createDate) : null,
        lastModifiedDate: attendance.lastModifiedDate
          ? dayjs(attendance.lastModifiedDate)
          : null,
      })),
    };
  });

export type Attendance = z.infer<typeof attendances>['attendanceList'][number];

/** PATCH /api/v1/attendance/{id} */
export type UpdateAttendanceReq = {
  link?: string;
  status?: AttendanceStatus;
  result?: AttendanceResult;
  comments?: string;
};

/** GET /challenge/{id}/application */
const getChallengeIdApplication = z
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
        paymentId: z.number().nullable().optional(),
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        phoneNum: z.string().nullable().optional(),
        university: z.string().nullable().optional(),
        grade: grade.nullable().optional(),
        major: z.string().nullable().optional(),
        couponName: z.string().nullable().optional(),
        totalCost: z.number().nullable().optional(),
        isConfirmed: z.boolean().nullable().optional(),
        wishJob: z.string().nullable().optional(),
        wishCompany: z.string().nullable().optional(),
        inflowPath: z.string().nullable().optional(),
        createDate: z.string(),
        accountType: accountType.nullable().optional(),
        accountNum: z.string().nullable().optional(),
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
        name: z.string().nullable(),
        email: z.string().nullable(),
        phoneNum: z.string().nullable(),
        accountNum: z.string().nullable(),
        accountType: accountType.nullable(),
        scores: z.array(
          z
            .object({
              th: z.number().nullable(),
              score: z.number().nullable(),
            })
            .nullable(),
        ),
        isRefunded: z.boolean().nullable(),
      }),
    ),
    pageInfo: pageinfo,
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

// export const missionType = z.union([
//   z.literal('GENERAL'),
//   z.literal('REWARD'),
//   z.literal('REFUND'),
// ]);

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
  typeof missionTemplateAdmin
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
        type: contentsType.nullable().optional(),
        title: z.string().nullable().optional(),
        link: z.string().nullable().optional(),
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
    pageInfo: pageinfo,
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
          status: missionStatusType.nullable(),
        }),
        attendanceInfo: z.object({
          submitted: z.boolean().nullable(),
          id: z.number().nullable(),
          link: z.string().nullable(),
          comments: z.string().nullable(),
          status: attendanceStatus.nullable(),
          result: attendanceResult.nullable(),
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
      status: missionStatusType,
      missionTag: z.string(),
      description: z.string(),
      guide: z.string(),
      templateLink: z.string(),
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
    dailyMission: z.object({
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
      status: missionStatusType,
      missionTag: z.string().nullable(),
      description: z.string().nullable(),
      guide: z.string().nullable(),
      templateLink: z.string().nullable(),
    }),
    attendanceInfo: z.object({
      submitted: z.boolean(),
      id: z.number().nullable(),
      link: z.string().nullable(),
      comments: z.string().nullable(),
      status: attendanceStatus.nullable(),
      result: attendanceResult.nullable(),
    }),
  })
  .transform((data) => {
    return {
      ...data,
      dailyMission: {
        ...data.dailyMission,
        startDate: data.dailyMission.startDate
          ? dayjs(data.dailyMission.startDate)
          : null,
        endDate: data.dailyMission.endDate
          ? dayjs(data.dailyMission.endDate)
          : null,
      },
    };
  });

export type MyDailyMission = z.infer<typeof myDailyMission>;

// GET /api/v1/challenge/{id}/missions?type=GENERAL
export const myChallengeMissionsByType = z.object({
  missionList: z.array(
    z.object({
      attendanceLink: z.string().nullable().optional(),
      attendanceResult: attendanceResult.nullable().optional(),
      attendanceStatus: attendanceStatus.nullable().optional(),
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
        id: z.number(),
        paymentId: z.number().nullable().optional(),
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        phoneNum: z.string().nullable().optional(),
        university: z.string().nullable().optional(),
        grade: grade.nullable().optional(),
        major: z.string().nullable().optional(),
        couponName: z.string().nullable().optional(),
        totalCost: z.number().nullable().optional(),
        isRefunded: z.boolean().nullable().optional(),
        isConfirmed: z.boolean().nullable().optional(),
        wishJob: z.string().nullable().optional(),
        wishCompany: z.string().nullable().optional(),
        inflowPath: z.string().nullable().optional(),
        createDate: z.string().nullable().optional(),
        accountType: accountType.nullable().optional(),
        accountNum: z.string().nullable().optional(),
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

export type ChallengeApplication = z.infer<
  typeof challengeApplicationsSchema
>['applicationList'][number];

/** GET /api/v1/live/{id}/applications */
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
        totalCost: z.number().nullable().optional(),
        isConfirmed: z.boolean().nullable().optional(),
        isRefunded: z.boolean().nullable().optional(),
        created_date: z.string().nullable().optional(),
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
    reviewList: z.array(z.string()).nullable().optional(),
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

export const programStatus = z.union([
  z.literal('PREV'),
  z.literal('PROCEEDING'),
  z.literal('POST'),
]);

export const challengeApplicationPriceType = z.object({
  priceId: z.number(),
  price: z.number(),
  refund: z.number(),
  discount: z.number(),
  accountNumber: z.string(),
  deadline: z.string(),
  accountType: z.string(),
  challengePriceType: challengePriceType,
  challengeUserType: challengeUserType,
  challengeParticipationType: challengeParticipationType,
});

export const liveApplicationPriceType = z.object({
  priceId: z.number(),
  price: z.number(),
  discount: z.number(),
  accountNumber: z.string(),
  deadline: z.string(),
  accountType: z.string(),
  livePriceType: livePriceType,
});

export const programApplicationType = z.object({
  applied: z.boolean(),
  name: z.string(),
  email: z.string(),
  contactEmail: z.string(),
  phoneNumber: z.string(),
  criticalNotice: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  deadline: z.string(),
  statusType: programStatus,
  priceList: z.array(challengeApplicationPriceType).nullable().optional(),
  price: liveApplicationPriceType.nullable().optional(),
});
