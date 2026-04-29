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

/** 멘토 프로필 (신규 API 대비) */
export const mentorProfileSchema = z.object({
  name: z.string(),
  nickname: z.string().nullable(),
  phone: z.string().nullable(),
  sns: z.string().nullable(),
  email: z.string(),
  profileImage: z.string().nullable(),
  introduction: z.string().nullable(),
  careers: z.array(
    z.object({
      company: z.string(),
      field: z.string().nullable(),
      position: z.string().nullable(),
      department: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
    }),
  ),
});

export type MentorProfile = z.infer<typeof mentorProfileSchema>;
