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

const categorySchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().nullish(),
  directTargetType: programCategoryTargetTypeSchema.nullish(),
  directTargetId: z.number().nullish(),
});
export type PublicProgramCategory = z.infer<typeof categorySchema>;

const groupSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().nullish(),
  purpose: z.enum(['FILTER', 'LANDING']).nullish(),
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
export const useProgramCategoryTargetsQuery = (categoryIds: number[]) =>
  useQuery({
    queryKey: ['programCategoryTargets', categoryIds],
    queryFn: async () => {
      const res = await axios.get('/program-category/targets', {
        params: { categoryIds: categoryIds.join(','), groupChallenges: true },
      });
      return z
        .object({ targetList: z.array(targetSchema) })
        .parse(res.data.data).targetList;
    },
    enabled: categoryIds.length > 0,
  });
