'use client';

import { useQueries } from '@tanstack/react-query';
import type { ChallengeType } from '@/schema';
import { challengeListSchema } from '@/schema';
import axios from '@/utils/axios';
import { CHALLENGE_ITEMS } from '../data/challengeModalItems';
import { GUIDEBOOK_ITEMS } from '../data/guidebooks';

/**
 * 썸네일이 필요한 챌린지 타입 목록(중복 제거).
 *
 * 챌린지 10종(시안 10)뿐 아니라 가이드북 7종(시안 11) 안에 섞여 있는 챌린지 2종
 * (대기업 자소서·인적성)도 포함한다. 두 목록의 타입이 지금은 겹치지만, 한쪽에만
 * 있는 타입이 생겨도 여기서 자동으로 따라오게 둔다 — CHALLENGE_ITEMS 만 보고 있으면
 * 가이드북 쪽 카드는 조회 대상에서 조용히 빠져 정적 이미지에 머문다.
 */
const TYPES: ChallengeType[] = Array.from(
  new Set<ChallengeType>([
    ...CHALLENGE_ITEMS.map((item) => item.challengeType),
    ...GUIDEBOOK_ITEMS.flatMap((item) =>
      item.challengeType ? [item.challengeType] : [],
    ),
  ]),
);

/**
 * 챌린지 타입별 대표 썸네일을 어드민에서 가져온다.
 *
 * 목록 응답(`challengeListItemSchema`)에 `challengeType` 이 없어 한 번에 받아 타입별로
 * 가를 수가 없다. 그래서 타입당 1회씩 조회한다 — 지금 10회다. 훅은 반복 호출할 수 없으므로
 * `useQueries` 로 묶는다.
 *
 * 호출 수를 줄이려면 목록 응답에 `challengeType` 을 넣어달라고 백엔드에 요청해야 한다.
 * 그러면 `/challenge/home?size=N` 한 번으로 끝난다.
 *
 * 어드민에 썸네일이 없으면 그 타입은 비워서 돌려준다. 호출부가 정적 파일로 되돌린다 —
 * 화면이 비는 것보다 낫다.
 */
export function useChallengeThumbnails({
  enabled = true,
}: { enabled?: boolean } = {}): Record<string, string | undefined> {
  const results = useQueries({
    queries: TYPES.map((type: ChallengeType) => ({
      queryKey: ['membership', 'thumbnail', type],
      enabled,
      // 시즌 중 썸네일이 바뀌는 일은 드물다. 탭·스크롤 왕복마다 다시 부르지 않는다.
      staleTime: 5 * 60 * 1000,
      queryFn: async () => {
        const res = await axios.get('/challenge/home', {
          params: { type, page: 0, size: 1 },
        });
        const parsed = challengeListSchema.parse(res.data.data);
        return parsed.programList[0]?.thumbnail ?? null;
      },
    })),
  });

  const map: Record<string, string | undefined> = {};
  TYPES.forEach((type, i) => {
    const value = results[i]?.data;
    map[type] = value ?? undefined;
  });
  return map;
}
