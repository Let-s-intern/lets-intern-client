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
}

const PROGRAM_TYPES: Record<string, ProgramCategoryTargetType> = {
  CHALLENGE: 'CHALLENGE',
  LIVE: 'LIVE',
  VOD: 'VOD',
  GUIDEBOOK: 'GUIDEBOOK',
};

// 목록마다 필요한 필드만 읽는다. 다른 필드가 바뀌어도 깨지지 않게 느슨하게 본다
const programsSchema = z.object({
  programList: z.array(
    z.object({
      programInfo: z.object({
        id: z.number(),
        programType: z.string(),
        title: z.string().nullish(),
      }),
    }),
  ),
});
const blogsSchema = z.object({
  blogInfos: z.array(
    z.object({
      blogThumbnailInfo: z.object({
        id: z.number(),
        title: z.string().nullish(),
      }),
      tagDetailInfos: z
        .array(z.object({ title: z.string().nullish() }))
        .nullish(),
    }),
  ),
});
const magnetsSchema = z.object({
  magnetList: z.array(
    z.object({
      magnetId: z.number(),
      title: z.string(),
      challengeType: z.string().nullish(),
    }),
  ),
});
const mentoringsSchema = z.object({
  liveMentoringList: z.array(
    z.object({
      liveMentoringId: z.number(),
      title: z.string().nullish(),
      categories: z.array(z.string()).nullish(),
    }),
  ),
});
const passesSchema = z.object({
  membershipList: z.array(
    z.object({ membershipId: z.number(), title: z.string() }),
  ),
});

const get = async <T>(url: string, schema: z.ZodType<T>, params?: object) =>
  schema.parse((await axios.get(url, { params })).data.data);

/** 한 출처가 실패해도 나머지는 쓴다. 실패한 출처 이름을 함께 준다 */
const settle = async <T>(name: string, task: Promise<T[]>) => {
  try {
    return { items: await task, failed: null as string | null };
  } catch {
    return { items: [] as T[], failed: name };
  }
};

/**
 * 태그를 붙일 수 있는 상품 전체: 챌린지·LIVE·VOD·가이드북, 블로그, 자료집(마그넷), 1:1 LIVE 멘토링, 올인원 패스.
 * 챌린지 구분은 이 목록에 없어 제목 키워드로만 본다(상품 수정 화면에서는 구분도 쓴다)
 */
export const fetchAllProducts = async () => {
  const results = await Promise.all([
    settle(
      '프로그램',
      get('/program/admin', programsSchema, { page: 1, size: 2000 }).then((r) =>
        r.programList.flatMap(({ programInfo: p }) =>
          PROGRAM_TYPES[p.programType]
            ? [
                {
                  targetType: PROGRAM_TYPES[p.programType],
                  targetId: p.id,
                  title: p.title ?? '',
                  input: { title: p.title ?? '' },
                } satisfies AutoTagProduct,
              ]
            : [],
        ),
      ),
    ),
    settle(
      '블로그',
      get('/blog', blogsSchema, { page: 1, size: 2000 }).then((r) =>
        r.blogInfos.map(({ blogThumbnailInfo: b, tagDetailInfos }) => ({
          targetType: 'BLOG' as const,
          targetId: b.id,
          title: b.title ?? '',
          input: {
            title: b.title ?? '',
            blogTagNames: (tagDetailInfos ?? []).flatMap((t) =>
              t.title ? [t.title] : [],
            ),
          },
        })),
      ),
    ),
    settle(
      '자료집',
      get('/admin/magnet', magnetsSchema).then((r) =>
        r.magnetList.map((m) => ({
          targetType: 'MAGNET' as const,
          targetId: m.magnetId,
          title: m.title,
          input: { title: m.title, challengeType: m.challengeType },
        })),
      ),
    ),
    settle(
      '1:1 멘토링',
      get('/admin/live-mentoring', mentoringsSchema, {
        page: 1,
        size: 1000,
      }).then((r) =>
        r.liveMentoringList.map((m) => ({
          targetType: 'LIVE_MENTORING' as const,
          targetId: m.liveMentoringId,
          title: m.title ?? '',
          input: {
            title: m.title ?? '',
            mentoringCategories: m.categories ?? [],
          },
        })),
      ),
    ),
    settle(
      '올인원 패스',
      get('/admin/membership', passesSchema, { page: 1, size: 100 }).then((r) =>
        r.membershipList.map((m) => ({
          targetType: 'MEMBERSHIP' as const,
          targetId: m.membershipId,
          title: m.title,
          input: { title: m.title },
        })),
      ),
    ),
  ]);
  return {
    products: results.flatMap((r) => r.items as AutoTagProduct[]),
    failed: results.flatMap((r) => (r.failed ? [r.failed] : [])),
  };
};

export const useAllProducts = (enabled = true) =>
  useQuery({
    queryKey: ['programCategoryAllProducts'],
    queryFn: fetchAllProducts,
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
