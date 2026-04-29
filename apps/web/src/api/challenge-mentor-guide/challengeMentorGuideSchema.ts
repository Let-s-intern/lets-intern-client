import { z } from 'zod';

/** 공지 전달 범위 */
export const ChallengeScopeTypeEnum = z.enum([
  'ALL',
  'IN_PROGRESS',
  'SPECIFIC',
]);
export type ChallengeScopeType = z.infer<typeof ChallengeScopeTypeEnum>;

/** 공지 전달 대상 */
export const MentorScopeTypeEnum = z.enum(['ALL_MENTOR', 'SPECIFIC_MENTOR']);
export type MentorScopeType = z.infer<typeof MentorScopeTypeEnum>;

/** 노출 기간 유형 */
export type DateType = 'INFINITE' | 'CHALLENGE' | 'CUSTOM';

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
  dateType: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isFixed: z.boolean().nullable().optional().default(false),
  isVisible: z.boolean().nullable().optional().default(false),
  createDate: z.string().nullable(),
  lastModifiedDate: z.string().nullable(),
});

/** GET 가이드 목록 응답 */
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
  dateType?: DateType; // TODO: 서버 배포 후 필수로 변경
  startDate?: string | null;
  endDate?: string | null;
  isFixed?: boolean;
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
  dateType?: DateType;
  startDate?: string | null;
  endDate?: string | null;
  isFixed?: boolean;
  isVisible?: boolean;
}
