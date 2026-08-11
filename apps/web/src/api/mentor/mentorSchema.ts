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
