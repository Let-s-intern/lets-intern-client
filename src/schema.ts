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
        title: z.string().nullable(),
        shortDesc: z.string().nullable(),
        thumbnail: z.string().nullable(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        beginning: z.string().nullable(),
        deadline: z.string().nullable(),
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

/** GET /api/v1/challenge/{id} */
export const getChallengeId = z
  .object({
    title: z.string(),
    shortDesc: z.string(),
    desc: z.string(),
    participationCount: z.number(),
    thumbnail: z.string().nullable(),
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
        deadline: z.string().nullable(),
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
        deadline: price.deadline ? dayjs(price.deadline) : null,
      })),
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

export const attendanceStatus = z.union([
  z.literal('PRESENT'),
  z.literal('UPDATED'),
  z.literal('LATE'),
  z.literal('ABSENT'),
]);

export type AttendanceStatus = z.infer<typeof attendanceStatus>;

export const attendanceResult = z.union([
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
        email: z.string().nullable(),
        phoneNum: z.string().nullable(),
        university: z.string().nullable(),
        grade: grade.nullable(),
        major: z.string().nullable(),
        couponName: z.string().nullable(),
        totalCost: z.number(),
        isConfirmed: z.boolean(),
        wishJob: z.string().nullable(),
        wishCompany: z.string().nullable(),
        inflowPath: z.string().nullable(),
        createDate: z.string(),
        accountType: accountType.nullable(),
        accountNum: z.string().nullable(),
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

export const contentsType = z.union([
  z.literal('ESSENTIAL'),
  z.literal('ADDITIONAL'),
]);

export type ContentsType = z.infer<typeof contentsType>;

/// POST /api/v1/mission/{id}
export const postMissionIdReq = z.object({
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
export const patchMissionIdReq = z.object({
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
    dailyMission: z.object({
      id: z.number(),
      th: z.number().nullable(),
      title: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      missionTag: z.string().nullable(),
      description: z.string().nullable(),
    }).nullable(),
  })
  .transform((data) => {
    return {
      dailyMission: data.dailyMission ? {
        ...data.dailyMission,
        startDate: data.dailyMission.startDate
          ? dayjs(data.dailyMission.startDate)
          : null,
        endDate: data.dailyMission.startDate
          ? dayjs(data.dailyMission.endDate)
          : null,
      } : null,
    };
  });

export type DailyMission = z.infer<typeof dailyMissionSchema>['dailyMission'];

/** GET /api/v1/user */
export const userSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  contactEmail: z.string().nullable(),
  phoneNum: z.string().nullable(),
  university: z.string().nullable(),
  grade: grade.nullable(),
  major: z.string().nullable(),
  wishJob: z.string().nullable(),
  wishCompany: z.string().nullable(),
  accountType: accountType.nullable(),
  accountNum: z.string().nullable(),
  accountOwner: z.string().nullable(),
  marketingAgree: z.boolean().nullable(),
});

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
