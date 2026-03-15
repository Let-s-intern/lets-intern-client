import {
  AttendanceResultEnum,
  AttendanceStatusEnum,
  challengePriceInfoSchema,
  ChallengePricePlanEnum,
  ProgramStatusEnum,
} from '@/schema';
import { z } from 'zod';

export const challengeGoalSchema = z.object({
  goal: z.string().nullable(),
  isFeedbackApplied: z.boolean().optional().default(false),
});

export const challengeUserInfoSchema = z.object({
  pass: z.boolean().nullable(),
});

export const challengeValidUserSchema = z.object({
  isAccessible: z.boolean().nullable(),
});

export const challengeMissionFeedbackListSchema = z.object({
  missionList: z.array(
    z.object({
      id: z.number(),
      title: z.string().nullish(),
      th: z.number(),
      startDate: z.string().datetime({ local: true }),
      endDate: z.string().datetime({ local: true }),
      challengeOptionCode: z.string().nullish(),
      challengeOptionTitle: z.string().nullish(),
    }),
  ),
});

export type ChallengeMissionFeedbackList = z.infer<
  typeof challengeMissionFeedbackListSchema
>;

export const FeedbackStatusEnum = z.enum([
  'WAITING', // 진행전
  'IN_PROGRESS', // 진행중
  'COMPLETED', // 진행완료
  'CONFIRMED', // 확인완료
]);

export type FeedbackStatus = z.infer<typeof FeedbackStatusEnum>;

export const FeedbackStatusMapping: Record<FeedbackStatus, string> = {
  WAITING: '진행전',
  IN_PROGRESS: '진행중',
  COMPLETED: '진행완료',
  CONFIRMED: '확인완료',
};

/** 피드백 미션 출석 항목 (mentorId / challengeMentorId 양쪽 호환) */
const feedbackAttendanceItemSchema = z
  .object({
    id: z.number(),
    userId: z.number().nullable(),
    // API가 challengeMentorId 또는 mentorId 중 하나를 반환
    challengeMentorId: z.number().nullable().optional(),
    mentorId: z.number().nullable().optional(),
    mentorName: z.string().nullable(),
    name: z.string(),
    major: z.string().optional().nullable(),
    wishJob: z.string().optional().nullable(),
    wishCompany: z.string().optional().nullable(),
    link: z.string().optional().nullable(),
    status: AttendanceStatusEnum.default('ABSENT'),
    result: AttendanceResultEnum.default('WAITING'),
    challengePricePlanType: ChallengePricePlanEnum.default('BASIC'),
    feedbackStatus: FeedbackStatusEnum.nullable().default('WAITING'),
    optionCode: z.string().optional().nullable(),
  })
  .transform((data) => ({
    ...data,
    // challengeMentorId로 통일 (fallback: mentorId)
    challengeMentorId: data.challengeMentorId ?? data.mentorId ?? null,
  }));

export const challengeMissionFeedbackAttendanceListSchema = z.object({
  attendanceList: z.array(feedbackAttendanceItemSchema),
});

/** [멘토용] 피드백 현황 조회 */
const feedbackStatusCountSchema = z.object({
  feedbackStatus: FeedbackStatusEnum,
  count: z.number(),
});

const mentorFeedbackMissionSummarySchema = z.object({
  missionId: z.number(),
  missionTitle: z.string().nullable(),
  th: z.number(),
  submittedCount: z.number().default(0),
  notSubmittedCount: z.number().default(0),
  feedbackStatusCounts: z.array(feedbackStatusCountSchema).default([]),
});

export const mentorFeedbackManagementSchema = z.object({
  challengeList: z.array(
    z.object({
      challengeId: z.number(),
      title: z.string().nullable(),
      shortDesc: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      feedbackMissions: z.array(mentorFeedbackMissionSummarySchema).default([]),
    }),
  ),
});

export type MentorFeedbackManagement = z.infer<
  typeof mentorFeedbackManagementSchema
>;

/** [멘토용] 나의 멘티 제출 내역 (미제출자는 id가 null) */
export const mentorMenteeAttendanceListSchema = z.object({
  attendanceList: z.array(
    z
      .object({
        id: z.number().nullable(),
        userId: z.number().nullable(),
        challengeMentorId: z.number().nullable().optional(),
        mentorId: z.number().nullable().optional(),
        mentorName: z.string().nullable(),
        name: z.string(),
        major: z.string().optional().nullable(),
        wishJob: z.string().optional().nullable(),
        wishCompany: z.string().optional().nullable(),
        link: z.string().optional().nullable(),
        status: AttendanceStatusEnum.default('ABSENT'),
        result: AttendanceResultEnum.default('WAITING'),
        challengePricePlanType: ChallengePricePlanEnum.default('BASIC'),
        feedbackStatus: FeedbackStatusEnum.nullable().default('WAITING'),
        optionCode: z.string().optional().nullable(),
      })
      .transform((data) => ({
        ...data,
        challengeMentorId: data.challengeMentorId ?? data.mentorId ?? null,
      })),
  ),
});

/** 챌린지 나의 기록장 미션 피드백 */
export const challengeMissionFeedbackSchema = z.object({
  missionInfo: z.object({
    id: z.number(),
    th: z.number().nullish(),
    title: z.string().nullish(),
  }),
  attendanceInfo: z
    .object({
      link: z.string(),
      feedbackStatus: FeedbackStatusEnum.nullable().default('WAITING'),
      feedback: z.string().nullish(),
      mentorName: z.string().nullish(),
    })
    .nullable(),
});

export const feedbackAttendanceSchema = z.object({
  attendanceDetailVo: z.object({
    feedback: z.string().nullish(),
  }),
});

export const challengeApplicationSchema = z.object({
  applied: z.boolean().default(false),
  name: z.string().nullish(),
  email: z.string().nullish(),
  contactEmail: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  criticalNotice: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  deadline: z.string().nullish(),
  statusType: ProgramStatusEnum,
  priceList: z.array(challengePriceInfoSchema),
});

export type ChallengeApplication = z.infer<typeof challengeApplicationSchema>;
