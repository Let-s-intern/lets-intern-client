import { z } from 'zod';

/**
 * 1대1 라이브 멘토링 공개 페이지 zod 스키마.
 *
 * 공유 목 데이터(`@letscareer/mocks`)가 서빙하는 MSW 응답을 파싱한다.
 * mentor 앱(`apps/mentor/src/api/live-mentoring/liveMentoringSchema.ts`)과
 * 겹치는 타입(카테고리·진행시간·이력·체크리스트·템플릿)은 **동일 형태**를 유지한다.
 */

export const liveMentoringCategorySchema = z.enum([
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
]);
export type LiveMentoringCategory = z.infer<typeof liveMentoringCategorySchema>;

export const liveMentoringDurationSchema = z.union([
  z.literal(30),
  z.literal(50),
]);
export type LiveMentoringDuration = z.infer<typeof liveMentoringDurationSchema>;

/** 리스트 카드용 멘토 요약 (PRD §4.2) */
export const liveMentorCardSchema = z.object({
  mentorId: z.number(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  profileVisible: z.boolean(),
  mosaicEnabled: z.boolean(),
  mosaicBlur: z.number(),
  headline: z.string(),
  mentoringPoints: z.string(),
  category: liveMentoringCategorySchema,
  durationMin: liveMentoringDurationSchema,
  price: z.number(),
  rating: z.number(),
  reviewCount: z.number(),
  nextAvailableDate: z.string().nullable(),
});
export type LiveMentorCard = z.infer<typeof liveMentorCardSchema>;

/** 서버 페이징 응답 (PRD §8) */
export const liveMentorListResponseSchema = z.object({
  content: z.array(liveMentorCardSchema),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
});
export type LiveMentorListResponse = z.infer<
  typeof liveMentorListResponseSchema
>;

/** 멘토 이력 1건 (노출 선택 가능) */
export const liveMentoringCareerSchema = z.object({
  company: z.string(),
  position: z.string(),
  period: z.string(),
  visible: z.boolean(),
});
export type LiveMentoringCareer = z.infer<typeof liveMentoringCareerSchema>;

/** 멘티 제출물 체크리스트 항목 (PRD §4.4) */
export const checklistItemSchema = z.object({
  id: z.number(),
  label: z.string(),
  mode: z.enum(['SHOWN', 'HIDDEN', 'CUSTOM']),
  customText: z.string().optional(),
});
export type ChecklistItem = z.infer<typeof checklistItemSchema>;

/** 후기 (PRD §4.5) */
export const liveMentoringReviewSchema = z.object({
  reviewId: z.number(),
  menteeName: z.string(),
  score: z.number(),
  content: z.string(),
  createdAt: z.string(),
});
export type LiveMentoringReview = z.infer<typeof liveMentoringReviewSchema>;

/** 타입별 기본 + 멘토 편집분 템플릿 (PRD §4.4) */
export const liveMentoringTemplateSchema = z.object({
  category: liveMentoringCategorySchema,
  // 편집 불가
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
  process: z.array(
    z.object({ step: z.number(), title: z.string(), desc: z.string() }),
  ),
  submissionSpec: z.object({ title: z.string(), desc: z.string() }),
  // 편집 가능
  introduction: z.string(),
  careers: z.array(liveMentoringCareerSchema),
  mentoringPoints: z.string(),
  reviews: z.object({
    visible: z.boolean(),
    selectedReviewIds: z.array(z.number()),
  }),
  checklist: z.array(checklistItemSchema),
});
export type LiveMentoringTemplate = z.infer<typeof liveMentoringTemplateSchema>;

/** 상세 페이지 프로필 블록 (PRD §4.3) */
export const liveMentorProfileSchema = z.object({
  visible: z.boolean(),
  mosaicEnabled: z.boolean(),
  mosaicBlur: z.number(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  introduction: z.string(),
  careers: z.array(liveMentoringCareerSchema),
});
export type LiveMentorProfile = z.infer<typeof liveMentorProfileSchema>;

/** 멘토 상세 (상세 페이지 렌더용, +reviews) (PRD §4.3) */
export const liveMentorDetailSchema = z.object({
  mentorId: z.number(),
  category: liveMentoringCategorySchema,
  durationMin: liveMentoringDurationSchema,
  price: z.number(),
  rating: z.number(),
  reviewCount: z.number(),
  profile: liveMentorProfileSchema,
  template: liveMentoringTemplateSchema,
  reviews: z.array(liveMentoringReviewSchema),
});
export type LiveMentorDetail = z.infer<typeof liveMentorDetailSchema>;
