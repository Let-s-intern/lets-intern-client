'use client';

import { useGetUserProgramQuery } from '@/api/program';
import { CHALLENGE_ITEMS } from '@/domain/membership/data/challengeModalItems';
import type { BenefitCounts } from './landingContent';

// 조회 전·미설정 시 쓰는 기본 개수(기존 하드코딩값). 0종 같은 어색한 표기 방지용.
const FALLBACK = { guidebook: 7, vod: 20 };

/**
 * 혜택 개수 집계 — 혜택요약 카드·VOD 탭 제목이 공유.
 * 챌린지=타입 수(고정), 가이드북=공개 목록 길이(fetch, 상세 탭과 동일 queryKey 라 dedup),
 * VOD=어드민이 landingDescription 에 내려준 집계값.
 */
export function useBenefitCounts(vodCount: number): BenefitCounts {
  const guidebook = useGetUserProgramQuery({
    pageable: { page: 1, size: 50 },
    searchParams: { type: 'GUIDEBOOK' },
  });

  return {
    challenge: CHALLENGE_ITEMS.length,
    guidebook: guidebook.data?.programList.length ?? FALLBACK.guidebook,
    vod: vodCount || FALLBACK.vod,
  };
}
