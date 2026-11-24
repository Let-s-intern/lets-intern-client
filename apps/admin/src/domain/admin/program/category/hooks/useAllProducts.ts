import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { ProgramCategoryTargetType } from '../programCategoryApi';
import type { AutoTagInput } from '../utils/autoTag';

/** 자동 태그를 따질 상품 하나 */
export interface AutoTagProduct {
  targetType: ProgramCategoryTargetType;
  targetId: number;
  title: string;
  input: AutoTagInput;
  /** 지금 붙은 태그 id */
  tagIds: number[];
  /** 노출 여부. 서버가 아직 안 주면 undefined */
  isVisible?: boolean | null;
  /** 종료일시. 서버가 아직 안 주면 undefined */
  endDate?: string | null;
}

const candidatesSchema = z.object({
  candidateList: z.array(
    z.object({
      targetType: z.enum([
        'CHALLENGE',
        'LIVE',
        'VOD',
        'GUIDEBOOK',
        'LIVE_MENTORING',
        'MEMBERSHIP',
        'BLOG',
        'MAGNET',
      ]),
      targetId: z.number(),
      title: z.string().nullish(),
      shortDesc: z.string().nullish(),
      isVisible: z.boolean().nullish(),
      endDate: z.string().nullish(),
      challengeType: z.string().nullish(),
      blogCategory: z.string().nullish(),
      blogTagNames: z.array(z.string()).nullish(),
      mentoringCategories: z.array(z.string()).nullish(),
      tagIds: z.array(z.number()).nullish(),
    }),
  ),
});

/**
 * GET /admin/program-category/auto-tag/candidates — 태그를 붙일 수 있는 상품 전체를 한 번에.
 * 챌린지·마그넷 구분, 블로그 해시태그, 멘토링 분류와 지금 태그까지 서버가 묶어 준다
 */
export const fetchAllProducts = async (): Promise<AutoTagProduct[]> => {
  const res = await axios.get('/admin/program-category/auto-tag/candidates');
  return candidatesSchema.parse(res.data.data).candidateList.map((c) => ({
    targetType: c.targetType,
    targetId: c.targetId,
    title: c.title ?? '',
    tagIds: c.tagIds ?? [],
    isVisible: c.isVisible,
    endDate: c.endDate,
    input: {
      title: c.title ?? '',
      description: c.shortDesc,
      challengeType: c.challengeType,
      blogTagNames: c.blogTagNames ?? [],
      mentoringCategories: c.mentoringCategories ?? [],
    },
  }));
};

export const useAllProducts = (enabled = true) =>
  useQuery({
    queryKey: ['programCategoryAutoTagCandidates'],
    queryFn: fetchAllProducts,
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
