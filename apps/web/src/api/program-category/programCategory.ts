import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

/** 노출 분류 대상. 서버 ProgramCategoryTargetType 과 같다 */
export const programCategoryTargetTypeSchema = z.enum([
  'CHALLENGE',
  'LIVE',
  'VOD',
  'GUIDEBOOK',
  'LIVE_MENTORING',
  'MEMBERSHIP',
  'BLOG',
  'MAGNET',
]);
export type ProgramCategoryTargetType = z.infer<
  typeof programCategoryTargetTypeSchema
>;

/** 랜딩 섹션 표시 방식. AUTO 는 상품 유형대로 */
export const sectionDisplayTypeSchema = z.enum([
  'AUTO',
  'FEATURED',
  'CARDS',
  'MENTOR',
  'BLOG',
]);
export type SectionDisplayType = z.infer<typeof sectionDisplayTypeSchema>;

const categorySchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().nullish(),
  directTargetType: programCategoryTargetTypeSchema.nullish(),
  directTargetId: z.number().nullish(),
  displayType: sectionDisplayTypeSchema.nullish(),
  description: z.string().nullish(),
});

const placementSchema = z.object({
  placementType: z.enum(['LANDING', 'PROGRAM_FILTER']),
  slug: z.string().nullish(),
  mergeChallenges: z.boolean().nullish(),
  matchMode: z.enum(['ANY', 'ALL', 'GROUP']).nullish(),
  // 랜딩만. GNB 메뉴와 상단 문구 (서버 LC-3626 부터, 이전 응답에는 없다)
  menuGroup: z.string().nullish(),
  menuLabel: z.string().nullish(),
  menuOrder: z.number().nullish(),
  showInMenu: z.boolean().nullish(),
  heroTitle: z.string().nullish(),
  heroDescription: z.string().nullish(),
});
export type ProgramCategoryPlacement = z.infer<typeof placementSchema>;
export type PublicProgramCategory = z.infer<typeof categorySchema>;

const groupSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().nullish(),
  purpose: z.enum(['FILTER', 'LANDING']).nullish(),
  placements: z.array(placementSchema).nullish(),
  categoryList: z.array(categorySchema),
});
export type PublicProgramCategoryGroup = z.infer<typeof groupSchema>;

const targetSchema = z.object({
  targetType: programCategoryTargetTypeSchema,
  targetId: z.number(),
  title: z.string(),
  thumbnail: z.string().nullish(),
  shortDesc: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  beginning: z.string().nullish(),
  deadline: z.string().nullish(),
  mentorId: z.number().nullish(),
  // 카드 부가 정보 (서버 LC-3644 부터). 챌린지: 구분·최저 신청가 / 멘토링: 최저가·시간·멘토 회사·직무
  challengeType: z.string().nullish(),
  price: z.number().nullish(),
  durations: z.array(z.number()).nullish(),
  mentorCompany: z.string().nullish(),
  mentorJob: z.string().nullish(),
  categoryIds: z.array(z.number()),
});
export type ProgramCategoryTarget = z.infer<typeof targetSchema>;

/** GET /program-category — 필터·메뉴용 노출 목록 전체 (메뉴의 "바로 갈 상품" 확인용) */
export const useFilterProgramCategoryGroupsQuery = () =>
  useQuery({
    queryKey: ['programCategoryFilterGroups'],
    queryFn: async () => {
      const res = await axios.get('/program-category');
      return z
        .object({ programCategoryGroupList: z.array(groupSchema) })
        .parse(res.data.data).programCategoryGroupList;
    },
    staleTime: 5 * 60 * 1000,
  });

const landingMenuItemSchema = z.object({
  slug: z.string(),
  menuGroup: z.string().nullish(),
  menuLabel: z.string().nullish(),
  menuOrder: z.number().nullish(),
});
export type LandingMenuItem = z.infer<typeof landingMenuItemSchema>;

/**
 * GET /program-category/menu — GNB "프로그램 카테고리" 메뉴. 어드민이 메뉴에 보이기로 한 랜딩만 메뉴 순서대로.
 * 서버가 아직 이 API 를 모르면(404 등) 빈 목록으로 두고 고정 메뉴를 쓴다
 */
export const useLandingMenuQuery = () =>
  useQuery({
    queryKey: ['programCategoryLandingMenu'],
    queryFn: async (): Promise<LandingMenuItem[]> => {
      try {
        const res = await axios.get('/program-category/menu');
        return z
          .object({ menuList: z.array(landingMenuItemSchema) })
          .parse(res.data.data).menuList;
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

/** GET /program-category/slug/{slug} — 랜딩 한 페이지(노출 목록 하나) */
export const useProgramCategoryGroupBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['programCategoryGroupBySlug', slug],
    queryFn: async () => {
      const res = await axios.get(`/program-category/slug/${slug}`);
      return groupSchema.parse(res.data.data);
    },
    retry: false,
  });

/**
 * GET /program-category/targets — 여러 카테고리의 상품을 한 번에.
 * 같은 상품은 한 번만 오고 categoryIds 로 어느 카테고리에 걸렸는지 알 수 있다.
 * 챌린지는 기수와 관계없이 대표 기수 하나로 합쳐 받는다
 */
export const useProgramCategoryTargetsQuery = (
  categoryIds: number[],
  /** ANY: 하나라도 / GROUP: 노출 목록끼리는 전부, 목록 안은 그 목록 필터 설정대로 */
  match: 'ANY' | 'GROUP' = 'ANY',
  /** 챌린지를 기수·버전과 관계없이 한 장으로 */
  groupChallenges = true,
) =>
  useQuery({
    queryKey: ['programCategoryTargets', categoryIds, match, groupChallenges],
    queryFn: async () => {
      const res = await axios.get('/program-category/targets', {
        params: {
          categoryIds: categoryIds.join(','),
          groupChallenges,
          match,
        },
      });
      return z
        .object({ targetList: z.array(targetSchema) })
        .parse(res.data.data).targetList;
    },
    enabled: categoryIds.length > 0,
  });

const landingReviewSchema = z.object({
  reviewId: z.number(),
  score: z.number().nullish(),
  programTitle: z.string().nullish(),
  name: z.string().nullish(),
  challengeType: z.string().nullish(),
  itemList: z.array(
    z.object({
      questionType: z.string().nullish(),
      answer: z.string().nullish(),
    }),
  ),
});
export type LandingReview = z.infer<typeof landingReviewSchema>;

/**
 * GET /program-category/reviews — 랜딩 수강생 후기. 챌린지 구분의 참여 후기를 평점 높은 순으로.
 * 서버 LC-3644 부터 있다. 없으면(404) 실패로 두고 화면이 예전 후기 목록으로 대신한다
 */
export const useLandingReviewsQuery = (challengeTypes: string[], size = 12) =>
  useQuery({
    queryKey: ['landingReviews', challengeTypes, size],
    queryFn: async () => {
      const res = await axios.get('/program-category/reviews', {
        params: { challengeType: challengeTypes, size },
        paramsSerializer: { indexes: null },
      });
      return z
        .object({
          totalCount: z.number(),
          reviewList: z.array(landingReviewSchema),
        })
        .parse(res.data.data);
    },
    enabled: challengeTypes.length > 0,
    retry: false,
  });
