import { z } from 'zod';

/** 챌린지 멘토 가이드 항목 */
export const challengeMentorGuideItemSchema = z.object({
  challengeMentorGuideId: z.number(),
  title: z.string().nullable(),
  link: z.string().nullable(),
  createDate: z.string().nullable(),
  lastModifiedDate: z.string().nullable(),
});

/** GET /api/v1/challenge-mentor-guide 멘토용 가이드 목록 응답 */
export const challengeMentorGuideListSchema = z.object({
  challengeMentorGuideList: z.array(challengeMentorGuideItemSchema),
});

export type ChallengeMentorGuideItem = z.infer<
  typeof challengeMentorGuideItemSchema
>;
export type ChallengeMentorGuideList = z.infer<
  typeof challengeMentorGuideListSchema
>;

/** 어드민 챌린지 멘토 가이드 항목 */
export const adminChallengeMentorGuideItemSchema = z.object({
  id: z.number(),
  challengeTitle: z.string().nullable(),
  mentorName: z.string().nullable(),
  title: z.string().nullable(),
  link: z.string().nullable(),
  createDate: z.string().nullable(),
});

export const adminChallengeMentorGuideListSchema = z.object({
  challengeMentorGuideList: z.array(adminChallengeMentorGuideItemSchema),
});

export type AdminChallengeMentorGuideItem = z.infer<
  typeof adminChallengeMentorGuideItemSchema
>;
export type AdminChallengeMentorGuideList = z.infer<
  typeof adminChallengeMentorGuideListSchema
>;

/** POST/PATCH 요청 바디 */
export interface CreateChallengeMentorGuideReq {
  title: string;
  link: string;
}

export interface UpdateChallengeMentorGuideReq {
  title?: string;
  link?: string;
}
