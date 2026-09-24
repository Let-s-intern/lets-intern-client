'use client';

import { useQuery } from '@tanstack/react-query';
import { programSchema } from '@/schema';
import axios from '@/utils/axios';

/**
 * 가이드북 표지를 어드민에서 가져온다 — ID → 썸네일 주소.
 *
 * 챌린지 쪽(`useChallengeThumbnails`)과 달리 <b>요청 한 번</b>이면 된다. 목록 응답의
 * `programInfo` 에 `id` 와 `thumbnail` 이 함께 들어 있어서 ID 로 바로 가를 수 있다.
 * 챌린지 목록 응답에는 `challengeType` 이 없어서 타입당 1회씩 부르고 있는데, 그쪽도
 * 같은 필드가 생기면 한 번으로 줄어든다.
 *
 * 표지를 정적 파일로 두면 운영에서 표지를 바꿔도 랜딩만 옛 그림으로 남는다. 실제로
 * 대기업 자소서 카드가 지난 기수 챌린지 표지를 달고 있었다.
 *
 * 어드민 표지가 없거나 조회 전이면 그 ID 는 비워서 돌려준다. 호출부가 정적 파일로
 * 되돌린다 — 화면이 비는 것보다 낫다.
 */
export function useGuidebookThumbnails(): Record<number, string | undefined> {
  const { data } = useQuery({
    queryKey: ['membership', 'guidebookThumbnails'],
    // 시즌 중 표지가 바뀌는 일은 드물다. 탭·스크롤 왕복마다 다시 부르지 않는다.
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await axios.get('/program', {
        // size 는 가이드북 전종을 한 번에 받을 만큼 넉넉히. 지금 8종이다.
        params: { page: 1, size: 50, type: 'GUIDEBOOK' },
      });
      const parsed = programSchema.parse(res.data.data);

      const map: Record<number, string | undefined> = {};
      parsed.programList.forEach(({ programInfo }) => {
        map[programInfo.id] = programInfo.thumbnail ?? undefined;
      });
      return map;
    },
  });

  return data ?? {};
}
