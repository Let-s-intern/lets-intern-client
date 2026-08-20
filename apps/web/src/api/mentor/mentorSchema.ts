import { z } from 'zod';

export const mentorHashTagItemSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
});

export type MentorHashTagItem = z.infer<typeof mentorHashTagItemSchema>;

/** GET /api/v1/mentor-hash-tag 응답 */
export const mentorHashTagListSchema = z.object({
  mentorHashTagList: z.array(mentorHashTagItemSchema),
});

export const mentorListItemSchema = z.object({
  mentorId: z.number(),
  nickname: z.string().nullable(),
  profileImgUrl: z.string().nullable(),
  corpImgUrl: z.string().nullable(),
  company: z.string().nullable(),
  job: z.string().nullable(),
  hashTagList: z.array(mentorHashTagItemSchema),
  challengeList: z.array(
    z.object({
      challengeId: z.number(),
      title: z.string(),
    }),
  ),
});

export type MentorListItem = z.infer<typeof mentorListItemSchema>;

/** GET /api/v1/mentor 응답 */
export const mentorListSchema = z.object({
  mentorList: z.array(mentorListItemSchema),
  pageInfo: z.object({
    pageNum: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});

export const mentorCareerItemSchema = z.object({
  id: z.number(),
  company: z.string().nullable(),
  field: z.string().nullable(),
  job: z.string().nullable(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  employmentType: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isAddedByAdmin: z.boolean(),
  isRepresentative: z.boolean(),
});

export type MentorCareerItem = z.infer<typeof mentorCareerItemSchema>;

export const mentorProgramListItemSchema = z.object({
  programType: z.string(),
  programId: z.number(),
  title: z.string(),
  thumbnail: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  beginning: z.string(),
  deadline: z.string(),
});

export type MentorProgramListItem = z.infer<typeof mentorProgramListItemSchema>;

/**
 * GET /api/v1/mentor/{mentorId} 응답.
 * reviewList unknown[]로 받음 (개수/빈 상태 확인 용도, 항목별 렌더링은 실제 필드 확정 시 추가 예정)
 */
export const mentorDetailSchema = z.object({
  mentorInfo: z.object({
    mentorId: z.number(),
    nickname: z.string().nullable(),
    introduction: z.string().nullable().optional(),
    description: z.string().nullable(),
    profileImgUrl: z.string().nullable(),
    corpImgUrl: z.string().nullable(),
    company: z.string().nullable(),
    job: z.string().nullable(),
  }),
  careerList: z.array(mentorCareerItemSchema),
  proceedingProgramList: z.array(mentorProgramListItemSchema),
  postProgramList: z.array(mentorProgramListItemSchema),
  reviewList: z.array(z.unknown()),
});

export type MentorDetailData = z.infer<typeof mentorDetailSchema>;
