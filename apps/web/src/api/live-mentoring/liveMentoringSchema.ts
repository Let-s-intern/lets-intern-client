import { z } from 'zod';

/**
 * 1대1 라이브 멘토링 공개 페이지 zod 스키마.
 *
 * **개설 목록**(`liveMentoringOpening*`)은 실제 백엔드 `GET /live-mentoring` 응답을 파싱한다.
 * **멘토 상세**(`liveMentorDetail*`)는 아직 백엔드 엔드포인트가 없어
 * 공유 목 데이터(`@letscareer/mocks`)가 서빙하는 MSW 응답을 파싱한다.
 *
 * mentor 앱(`apps/mentor/src/api/live-mentoring/liveMentoringSchema.ts`)과
 * 겹치는 타입(카테고리·진행시간·이력·체크리스트·템플릿)은 **동일 형태**를 유지한다.
 */

export const liveMentoringCategorySchema = z.enum([
  'PERSONAL_STATEMENT',
  'RESUME',
  'PORTFOLIO',
]);
export type LiveMentoringCategory = z.infer<typeof liveMentoringCategorySchema>;

/**
 * 진행시간(분).
 * 백엔드 `LiveMentoringDuration` enum(`MINUTES_30(30)`, `MINUTES_60(60)`) 기준 — 50이 아니라 60이다.
 * (mentor 앱 `liveMentoringSchema.ts` 및 공유 목 `@letscareer/mocks` 와 동일 값)
 */
export const liveMentoringDurationSchema = z.union([
  z.literal(30),
  z.literal(60),
]);
export type LiveMentoringDuration = z.infer<typeof liveMentoringDurationSchema>;

/**
 * 개설 목록에 실리는 멘토 대표 경력 — 백엔드 `RepresentativeCareerResponseDto`.
 *
 * 공용 `UserCareerVo` 계열이라 개별 필드가 모두 nullable 이고,
 * `startDate`/`endDate` 는 `YearMonth` 직렬화 결과(예: `"2020-01"`)다.
 * 대표 경력을 한 번도 지정하지 않은 멘토는 이 객체 자체가 null 로 온다.
 */
export const representativeCareerSchema = z.object({
  id: z.number(),
  company: z.string().nullable(),
  field: z.string().nullable(),
  job: z.string().nullable(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  /** YearMonth 형식, 예: "2020-01" */
  startDate: z.string().nullable(),
  /** 재직 중이면 null. */
  endDate: z.string().nullable(),
});
export type RepresentativeCareer = z.infer<typeof representativeCareerSchema>;

/**
 * 라이브 멘토링 개설 1건 — 백엔드 `LiveMentoringOpeningResponseDto`.
 * (GET /live-mentoring 의 `openingList` 원소)
 *
 * 리스트 카드는 "멘토"가 아니라 "개설(opening)" 단위다: `id`가 개설 식별자,
 * `mentorId`는 그 개설을 연 멘토다.
 */
export const liveMentoringOpeningSchema = z.object({
  /** 개설 식별자. */
  id: z.number(),
  mentorId: z.number(),
  mentorNickname: z.string().nullable(),
  mentorProfileImage: z.string().nullable(),
  mentorIntroduction: z.string().nullable(),
  /** 대표 경력 미지정 멘토는 null. */
  representativeCareer: representativeCareerSchema.nullable(),
  /** 1대1 멘토링 타이틀(상품명). */
  title: z.string().nullable(),
  /** 멘토가 오픈한 타입(다중). */
  categories: z.array(liveMentoringCategorySchema),
  /** 멘토가 오픈한 진행시간(다중). */
  durations: z.array(liveMentoringDurationSchema),
  /** 여러 진행시간을 열었을 때의 최저가. */
  minimumPrice: z.number(),
  /** 피드백 진행 일정(오픈 기간) 시작·종료일. */
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
});
export type LiveMentoringOpening = z.infer<typeof liveMentoringOpeningSchema>;

/**
 * 개설 목록 응답 — 백엔드 `GetLiveMentoringOpeningsResponseDto`.
 * `pageInfo.pageNum` 은 1-based(서버 `one-indexed-parameters: true`).
 */
export const liveMentoringOpeningListSchema = z.object({
  openingList: z.array(liveMentoringOpeningSchema),
  pageInfo: z.object({
    pageNum: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
});
export type LiveMentoringOpeningList = z.infer<
  typeof liveMentoringOpeningListSchema
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
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
  price: z.number(),
  rating: z.number(),
  reviewCount: z.number(),
  feedbackStartDate: z.string(),
  feedbackEndDate: z.string(),
  profile: liveMentorProfileSchema,
  template: liveMentoringTemplateSchema,
  reviews: z.array(liveMentoringReviewSchema),
  /** 이 멘토가 참여 중인 챌린지 (공개 상세 하단). */
  challenges: z.array(
    z.object({
      challengeId: z.number(),
      title: z.string(),
      thumbnail: z.string().nullable(),
    }),
  ),
});
export type LiveMentorDetail = z.infer<typeof liveMentorDetailSchema>;
