'use client';

import { fetchPublicGuidebookData } from '@/api/program';
import { mapPublicGuidebook } from '@/domain/program/guidebook/utils/publicGuidebookMapping';
import { ChallengeType } from '@/schema';
import { useQuery } from '@tanstack/react-query';
import { getTemplateGuidebookId } from './templateGuidebook';

/** 챌린지 타입에 연결된 가이드북. 연결이 없으면 guidebookId 가 null 이다 */
export const useTemplateGuidebook = (challengeType: ChallengeType) => {
  const guidebookId = getTemplateGuidebookId(challengeType);
  const { data: guidebook } = useQuery({
    queryKey: ['templateGuidebook', guidebookId],
    queryFn: async () =>
      mapPublicGuidebook(await fetchPublicGuidebookData(String(guidebookId))),
    enabled: guidebookId !== null,
    refetchOnWindowFocus: false,
  });
  return { guidebookId, guidebook: guidebook ?? null };
};
