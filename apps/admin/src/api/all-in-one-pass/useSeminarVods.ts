import { useQuery } from '@tanstack/react-query';

/**
 * seminar-vod 공개 목록 조회 (노출 VOD 선택 모달용).
 *
 * 외부 호스트(seminar-vod.letscareer.co.kr)라 CORS 때문에 직접 못 부름. same-origin
 * `/seminar-vods` 로 요청하고 프록시가 외부로 넘김 — dev=vite proxy, prod=vercel rewrite.
 * axios(baseURL=메인 BE) 가 아니라 fetch 로 same-origin 호출.
 */
export interface SeminarVod {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string; // 랜딩엔 저장 안 함(비공개). 목록 표시·상세 확인용
}

export const useSeminarVods = () =>
  useQuery<SeminarVod[]>({
    queryKey: ['seminar-vods'],
    queryFn: async () => {
      const res = await fetch('/seminar-vods');
      if (!res.ok) throw new Error('VOD 목록을 불러오지 못했습니다.');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
