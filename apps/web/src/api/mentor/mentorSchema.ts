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

/**
 * GET /api/v1/mentor/{mentorId} 응답.
 * proceedingProgramList/postProgramList/reviewList는 실제 데이터가
 * 채워진 예시가 없어 필드 형태를 확정할 수 없으므로 아직 스키마에 포함하지 않는다.
 */
export const mentorDetailSchema = z.object({
  mentorInfo: z.object({
    mentorId: z.number(),
    nickname: z.string().nullable(),
    description: z.string().nullable(),
    profileImgUrl: z.string().nullable(),
    corpImgUrl: z.string().nullable(),
    company: z.string().nullable(),
    job: z.string().nullable(),
  }),
  careerList: z.array(mentorCareerItemSchema),
});

export type MentorDetailData = z.infer<typeof mentorDetailSchema>;
