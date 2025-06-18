import { z } from 'zod';

/** 챌린지 멘토 목록 */
export const adminChallengeMentorListSchema = z.object({
  mentorList: z.array(
    z.object({
      challengeMentorId: z.number(),
      userId: z.number(),
      name: z.string(),
    }),
  ),
});

/** 멘토 전체 목록 */
export const adminUserMentorList = z.object({
  mentorList: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});

export type AdminUserMentorList = z.infer<typeof adminUserMentorList>;
