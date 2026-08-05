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

/** 후기 (PRD §4.5) */
export const liveMentoringReviewSchema = z.object({
  reviewId: z.number(),
  menteeName: z.string(),
  score: z.number(),
  content: z.string(),
  createdAt: z.string(),
});
export type LiveMentoringReview = z.infer<typeof liveMentoringReviewSchema>;

/**
 * 노출 토글이 있는 섹션의 공통 골격 (시안 3·4·5).
 * `visible === false` 면 상세 페이지에서 섹션을 **통째로 제외**한다.
 */
const sectionWithVisible = <T extends z.ZodRawShape>(extra: T) =>
  z.object({
    visible: z.boolean(),
    title: z.string(),
    subtitle: z.string(),
    ...extra,
  });

/**
 * 상세 페이지 템플릿 — 멘토가 상세 페이지 설정에서 편집한 시안 1~5번 섹션 + 고정 섹션.
 * mentor 앱(`apps/mentor/src/api/live-mentoring/liveMentoringSchema.ts`)과 **동일 형태**여야
 * 같은 목/응답을 양쪽에서 파싱할 수 있다.
 */
export const liveMentoringTemplateSchema = z.object({
  category: liveMentoringCategorySchema,

  /** 시안 0 · 히어로 — 제목 아래 불릿 소개. */
  hero: z.object({ bullets: z.array(z.string()) }),

  /** 시안 1 · 멘토 소개 */
  intro: z.object({
    passedCount: z.number().nullable(),
    profileImage: z.string().nullable(),
    affiliation: z.string(),
    careerLines: z.array(z.string()),
    oneLiner: z.string(),
  }),
  /** 시안 2 · 멘토링 유형 */
  mentoringTypes: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(
      z.object({
        typeName: z.string(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
      }),
    ),
  }),
  /** 시안 3 · 취업 성공 전략 */
  strategy: sectionWithVisible({
    points: z.array(
      z.object({
        image: z.string().nullable(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
  /** 시안 4 · 이렇게 도와드려요(영상) */
  video: sectionWithVisible({
    videoUrl: z.string().nullable(),
    caption: z.string(),
  }),
  /** 시안 5 · 결과 사례(Before/After) */
  results: sectionWithVisible({
    cases: z.array(
      z.object({
        beforeImage: z.string().nullable(),
        afterImage: z.string().nullable(),
        beforeCaption: z.string(),
        afterCaption: z.string(),
      }),
    ),
  }),

  // ── 편집 불가 ───────────────────────────────────────────
  reviews: z.object({
    visible: z.boolean(),
    selectedReviewIds: z.array(z.number()),
  }),
  /*
   * 시안 7(진행 프로세스)·10(FAQ)은 계약에 없다.
   * 멘토가 편집하지 않고 운영 확정 문구라, 서버를 거치지 않고
   * `detail/DetailFixedSections.tsx` 에 하드코딩한다.
   */
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
  /** 상품명 — 히어로 제목. */
  title: z.string(),
  categories: z.array(liveMentoringCategorySchema),
  durations: z.array(liveMentoringDurationSchema),
  /** 진행시간별 판매가 — 히어로 플랜 옵션이 이 값을 그대로 쓴다. */
  durationPrices: z.array(
    z.object({
      duration: liveMentoringDurationSchema,
      price: z.number(),
    }),
  ),
  /** 여러 진행시간을 열었을 때의 최저가(대표 표시용). */
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
