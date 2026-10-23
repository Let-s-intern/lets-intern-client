import { z } from 'zod';

/** 챌린지 멘토 목록 */
export const adminChallengeMentorListSchema = z.object({
  mentorList: z.array(
    z.object({
      challengeMentorId: z.number(),
      userId: z.number(),
      name: z.string(),
      userCareerList: z
        .array(
          z.object({
            id: z.number().optional(),
            company: z.string().nullable(),
            job: z.string().nullable(),
            field: z.string().nullable().optional(),
            position: z.string().nullable().optional(),
            department: z.string().nullable().optional(),
            employmentType: z.string().nullable().optional(),
            startDate: z.unknown().optional(),
            endDate: z.unknown().optional(),
            isAddedByAdmin: z.boolean().optional(),
          }),
        )
        .optional()
        .default([]),
    }),
  ),
});

export type ChallengeMentorList = z.infer<
  typeof adminChallengeMentorListSchema
>;

/** 멘토 전체 목록 */
export const adminUserMentorList = z.object({
  mentorList: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      nickname: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      phoneNum: z.string().nullable().optional(),
      isVisible: z.boolean().nullable().optional(),
      hashTagList: z
        .array(
          z.object({
            id: z.number(),
            type: z.string(),
            title: z.string(),
          }),
        )
        .optional()
        .default([]),
    }),
  ),
});

export type AdminUserMentorList = z.infer<typeof adminUserMentorList>;

export interface PostAdminChallengeMentorReq {
  challengeId: number;
  mentorIdList: number[];
}

export interface TalentPoolDocumentReq {
  attendanceId: number;
  documentType: string;
  fileUrl: string;
  fileName: string;
  wishField: string;
  wishJob: string;
  wishIndustry: string;
}

/** PATCH /api/v1/attendance/{aId}/mentor 요청 — 최소 1개 필드 필수 */
export const patchAttendanceMentorReqSchema = z
  .object({
    feedback: z.string().optional(),
    feedbackStatus: z.string().optional(),
  })
  .refine(
    (data) => data.feedback !== undefined || data.feedbackStatus !== undefined,
    {
      message: 'feedback 또는 feedbackStatus 중 하나는 필수입니다',
    },
  );

export type PatchAttendanceMentorReq = z.infer<
  typeof patchAttendanceMentorReqSchema
>;

export const mentorHashTagItemSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
});

export type MentorHashTagItem = z.infer<typeof mentorHashTagItemSchema>;

/** GET /api/v1/admin/mentor-hash-tag 응답 */
export const mentorHashTagListSchema = z.object({
  mentorHashTagList: z.array(mentorHashTagItemSchema),
});

/** POST, PATCH /api/v1/admin/mentor-hash-tag 요청 바디 */
export interface MentorHashTagReq {
  type: string;
  title: string;
}

/** PUT /api/v1/admin/mentor-hash-tag/mentors/{mentorId} 요청 바디. 전달한 목록이 최종 목록이 된다 */
export interface PutAdminMentorHashTagOfMentorReq {
  mentorHashTagIdList: number[];
}

export const mentorReviewSourceSchema = z.enum([
  'REVIEW',
  'OLD_REVIEW',
  'FEEDBACK',
]);

export const mentorReviewTypeSchema = z.enum([
  'LIVE',
  'FEEDBACK',
  'LIVE_MENTORING',
  'CHALLENGE',
]);

export type MentorReviewType = z.infer<typeof mentorReviewTypeSchema>;

export const adminMentorReviewSchema = z.object({
  source: mentorReviewSourceSchema,
  sourceId: z.number(),
  type: mentorReviewTypeSchema,
  programTitle: z.string().nullable(),
  // score·review 는 멘토 페이지에 나가는 값(수정값이 있으면 수정값), original* 은 원본이다
  score: z.number().nullable(),
  review: z.string().nullable(),
  originalScore: z.number().nullable(),
  originalReview: z.string().nullable(),
  isEdited: z.boolean(),
  createDate: z.string().nullable(),
  isExposed: z.boolean(),
});

export type AdminMentorReview = z.infer<typeof adminMentorReviewSchema>;

/** GET /api/v1/admin/mentor/{mentorId}/reviews 응답 */
export const adminMentorReviewListSchema = z.object({
  reviewList: z.array(adminMentorReviewSchema),
});

/** PATCH /api/v1/admin/mentor/{mentorId}/reviews/exposure 요청 바디 */
export interface PatchMentorReviewExposureReq {
  source: AdminMentorReview['source'];
  sourceId: number;
  isExposed: boolean;
}

/**
 * PATCH /api/v1/admin/mentor/{mentorId}/reviews/content 요청 바디.
 * score 는 1.0~5.0 의 0.5 단위, review 는 2000자 이하. null 로 보낸 항목은 원본으로 되돌린다
 */
export interface PatchMentorReviewContentReq {
  source: AdminMentorReview['source'];
  sourceId: number;
  score: number | null;
  review: string | null;
}
