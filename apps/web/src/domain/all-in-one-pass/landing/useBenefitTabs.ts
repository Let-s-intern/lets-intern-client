'use client';

import { useGetUserProgramQuery } from '@/api/program';
import {
  CHALLENGE_ITEMS,
  getChallengeThumbnailSrc,
} from '@/domain/membership/data/challengeModalItems';
import { useChallengeThumbnails } from '@/domain/membership/lib/useChallengeThumbnails';
import type { Program } from '@/schema';
import type { AllInOnePassPlan, PassProgramType } from '../types';
import {
  BENEFIT_TABS,
  type BenefitDetailCard,
  type BenefitDetailTab,
  type BenefitTabKey,
} from './benefitDetail';

const LIST_PAGEABLE = { page: 1, size: 50 };

/** 프로그램 목록(fetch) → 카드. type 으로 상세 경로를 조립한다(/program/{type}/{id}). */
function toCards(
  data: Program | undefined,
  type: 'guidebook' | 'live',
  ctaLabel: string,
): BenefitDetailCard[] {
  return (data?.programList ?? []).map(({ programInfo }) => ({
    key: String(programInfo.id),
    title: programInfo.title ?? '',
    thumbnail: programInfo.thumbnail ?? null,
    href: `/program/${type}/${programInfo.id}`,
    ctaLabel,
  }));
}

export interface BenefitTabs {
  visibleTabs: BenefitDetailTab[];
  tabData: Record<
    BenefitTabKey,
    { cards: BenefitDetailCard[]; loading: boolean }
  >;
  countFor: (key: BenefitTabKey) => number;
}

/**
 * 혜택 상세 탭 데이터 — 플랜 권한 union 노출 탭 + 탭별 카드·개수.
 * VOD 탭은 플랜 권한이 없어도 VOD 옵션 판매가 켜져 있으면 보인다 (LC-3533).
 * 챌린지=타입별 1장(slug/latest), 가이드북·라이브=/program 목록 fetch,
 * VOD=어드민 집계값(vodCount), 멘토링=배너라 카드 없음.
 */
export function useBenefitTabs(
  plans: AllInOnePassPlan[],
  vodCount: number,
  vodOptionOnSale: boolean,
): BenefitTabs {
  const union = new Set<PassProgramType>();
  plans.forEach((p) => p.privileges.forEach((pv) => union.add(pv.programType)));
  if (vodOptionOnSale) union.add('VOD');
  const visibleTabs = BENEFIT_TABS.filter(
    (t) => !t.programType || union.has(t.programType),
  );

  // 챌린지 — 타입별 1장(하드코딩) + 어드민 썸네일. 링크는 slug/latest 라 회차가 바뀌어도 그대로.
  const challengeThumbs = useChallengeThumbnails();
  const challengeCards: BenefitDetailCard[] = CHALLENGE_ITEMS.map((item) => ({
    key: item.challengeType,
    title: item.label,
    thumbnail: getChallengeThumbnailSrc(
      item,
      challengeThumbs[item.challengeType],
    ),
    href: item.url,
    ctaLabel: '챌린지 자세히 보기',
  }));

  // 가이드북·라이브 — 공개 목록 fetch. 라이브는 종료분을 빼려고 모집중·예정만.
  const guidebookQuery = useGetUserProgramQuery({
    pageable: LIST_PAGEABLE,
    searchParams: { type: 'GUIDEBOOK' },
  });
  const liveQuery = useGetUserProgramQuery({
    pageable: LIST_PAGEABLE,
    searchParams: { type: 'LIVE', status: ['PROCEEDING', 'PREV'] },
  });

  const tabData: BenefitTabs['tabData'] = {
    challenge: { cards: challengeCards, loading: false },
    guidebook: {
      cards: toCards(guidebookQuery.data, 'guidebook', '가이드북 자세히 보기'),
      loading: guidebookQuery.isLoading,
    },
    live: {
      cards: toCards(liveQuery.data, 'live', 'LIVE 클래스 자세히 보기'),
      loading: liveQuery.isLoading,
    },
    vod: { cards: [], loading: false }, // 노출 VOD 는 landingDescription 에서 별도 렌더
    mentoring: { cards: [], loading: false }, // 쿠폰 배너
  };

  const countFor = (key: BenefitTabKey): number => {
    const tab = BENEFIT_TABS.find((t) => t.key === key);
    // VOD 는 어드민이 집계한 전체 수(노출 카드는 3개뿐이라 cards.length 로 못 센다).
    if (key === 'vod') return vodCount || tab?.staticCount || 0;
    return tabData[key].cards.length || tab?.staticCount || 0;
  };

  return { visibleTabs, tabData, countFor };
}
