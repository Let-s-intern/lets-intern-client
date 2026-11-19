import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const targetSchema = z.object({
  targetType: z.string(),
  targetId: z.number(),
  title: z.string(),
  thumbnail: z.string().nullish(),
  categoryIds: z.array(z.number()),
});

export type PublicCategoryTarget = z.infer<typeof targetSchema>;

/** 공개 다중 조회로 실제 사용자 화면과 같은 결과를 본다 */
export const usePublicCategoryTargets = (
  categoryIds: number[],
  mergeChallenges: boolean,
) =>
  useQuery({
    queryKey: ['adminPlacementOverview', categoryIds, mergeChallenges],
    queryFn: async () => {
      const res = await axios.get('/program-category/targets', {
        params: {
          categoryIds: categoryIds.join(','),
          groupChallenges: mergeChallenges,
        },
      });
      return z
        .object({ targetList: z.array(targetSchema) })
        .parse(res.data.data).targetList;
    },
    enabled: categoryIds.length > 0,
    refetchOnWindowFocus: false,
  });
