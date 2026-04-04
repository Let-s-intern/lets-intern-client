import { z } from 'zod';

/** 공지 전달 범위 */
export const ChallengeScopeTypeEnum = z.enum(['ALL', 'IN_PROGRESS', 'SPECIFIC']);
export type ChallengeScopeType = z.infer<typeof ChallengeScopeTypeEnum>;

/** 공지 전달 대상 */
export const MentorScopeTypeEnum = z.enum(['ALL_MENTOR', 'SPECIFIC_MENTOR']);
export type MentorScopeType = z.infer<typeof MentorScopeTypeEnum>;

/** 챌린지 멘토 가이드 항목 */
export const challengeMentorGuideItemSchema = z.object({
  challengeMentorGuideId: z.number(),
  title: z.string().nullable(),
  link: z.string().nullable(),
  contents: z.string().nullable().optional(),
  challengeScopeType: z.string().nullable().optional().default('ALL'),
  mentorScopeType: z.string().nullable().optional().default('ALL_MENTOR'),
  challengeId: z.number().nullable().optional(),
  challengeMentorId: z.number().nullable().optional(),
  createDate: z.string().nullable(),
  lastModifiedDate: z.string().nullable(),
});

/** GET /api/v1/challenge-mentor-guide/{challengeId} 가이드 목록 응답 */
export const challengeMentorGuideListSchema = z.object({
  challengeMentorGuideList: z.array(challengeMentorGuideItemSchema),
});

export type ChallengeMentorGuideItem = z.infer<
  typeof challengeMentorGuideItemSchema
>;
export type ChallengeMentorGuideList = z.infer<
  typeof challengeMentorGuideListSchema
>;

/** POST 요청 바디 */
export interface CreateChallengeMentorGuideReq {
  title: string;
  link?: string;
  contents?: string;
  challengeScopeType?: ChallengeScopeType;
  mentorScopeType?: MentorScopeType;
  challengeId?: number | null;
  challengeMentorId?: number | null;
}

/** PATCH 요청 바디 */
export interface UpdateChallengeMentorGuideReq {
  title?: string;
  link?: string;
  contents?: string;
  challengeScopeType?: ChallengeScopeType;
  mentorScopeType?: MentorScopeType;
  challengeId?: number | null;
  challengeMentorId?: number | null;
}
