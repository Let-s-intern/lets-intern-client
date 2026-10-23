import { z } from 'zod';

/**
 * 어드민 1:1 상세페이지 편집 — `GET/PUT /api/v1/admin/live-mentoring/mentors/{mentorId}/detail-page`.
 *
 * 서버는 멘토 본인용(`/mentor/live-mentoring/detail-page`)과 같은 DTO 를 쓴다. 이 화면이 고치는
 * 편집 영역 6개와 머리에 쓰는 읽기 전용 값만 받는다. 멘토 앱 스키마와 같은 형태이지만 앱 간
 * 공유가 금지라 따로 둔다.
 */

/** 노출 토글이 있는 섹션의 공통 골격. `visible === false` 면 공개 상세에서 섹션을 뺀다. */
const sectionWithVisible = <T extends z.ZodRawShape>(extra: T) =>
  z.object({
    visible: z.boolean(),
    title: z.string(),
    subtitle: z.string(),
    ...extra,
  });

export const detailPageMentoringTypeSchema = z.object({
  typeName: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

export const detailPageStrategyPointSchema = z.object({
  image: z.string().nullable(),
  title: z.string(),
  description: z.string(),
});

export const detailPageResultCaseSchema = z.object({
  beforeImage: z.string().nullable(),
  afterImage: z.string().nullable(),
  beforeCaption: z.string(),
  afterCaption: z.string(),
});

/** PUT 요청 바디. 서버 `UpdateLiveMentoringDetailPageRequestDto` 와 같은 키다. */
export const adminLiveMentoringDetailPageUpdateSchema = z.object({
  hero: z.object({ bullets: z.array(z.string()) }),
  mentoringTypes: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(detailPageMentoringTypeSchema),
  }),
  strategy: sectionWithVisible({
    points: z.array(detailPageStrategyPointSchema),
  }),
  video: sectionWithVisible({
    videoUrl: z.string().nullable(),
    caption: z.string(),
  }),
  results: sectionWithVisible({
    cases: z.array(detailPageResultCaseSchema),
  }),
  /** 후기는 노출 여부만 고친다. 고른 후기 목록은 받은 그대로 돌려보낸다 */
  reviews: z.object({
    visible: z.boolean(),
    selectedReviewIds: z.array(z.number()),
  }),
});

export type AdminLiveMentoringDetailPageUpdate = z.infer<
  typeof adminLiveMentoringDetailPageUpdateSchema
>;

/** GET/PUT 응답. 편집 영역 + 머리에 쓰는 읽기 전용 값 */
export const adminLiveMentoringDetailPageSchema =
  adminLiveMentoringDetailPageUpdateSchema.extend({
    mentoring: z
      .object({
        liveMentoringId: z.number().nullable(),
        title: z.string().nullable(),
      })
      .nullish(),
    intro: z.object({ nickname: z.string().nullable() }).nullish(),
  });

export type AdminLiveMentoringDetailPage = z.infer<
  typeof adminLiveMentoringDetailPageSchema
>;
export type DetailPageMentoringType = z.infer<
  typeof detailPageMentoringTypeSchema
>;
export type DetailPageStrategyPoint = z.infer<
  typeof detailPageStrategyPointSchema
>;
export type DetailPageResultCase = z.infer<typeof detailPageResultCaseSchema>;
