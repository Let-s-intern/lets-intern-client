import { useMemo } from 'react';
import type { AllInOnePassPlan, PassProgramType } from '../types';
import type { CompareTab } from './CompareModal';

const finalOf = (p: AllInOnePassPlan) => p.price - (p.discount ?? 0);

/** 라이브·VOD 는 한 줄로 합치고, 존재하는 타입으로 라벨 생성. */
const liveVodLabel = (hasLive: boolean, hasVod: boolean): string => {
  if (hasLive && hasVod) return '현직자 LIVE 클래스 & VOD';
  if (hasLive) return '현직자 LIVE 클래스';
  return '현직자 VOD';
};

export interface ContentRow {
  label: string;
  note: string;
  /** 최저가 플랜엔 없고 상위 플랜에만 있는 권한 → "(추가 구매)" 표기 */
  extra: boolean;
}

export interface PassPricing {
  /** 최저가 플랜 기준 패스 구매가 */
  passPrice: number;
  /** 포함 콘텐츠 행 (최저가 포함분 + 상위 플랜 추가분 한 줄) */
  contentRows: ContentRow[];
  /** 비교 모달 탭 (최저가 플랜에 있는 챌린지/가이드북) */
  compareTabs: CompareTab[];
}

/** 플랜 배열에서 가격 섹션이 쓰는 파생값(패스가·콘텐츠 행·비교 탭) 계산. */
export function usePassPricing(plans: AllInOnePassPlan[]): PassPricing {
  return useMemo(() => {
    const cheapest = plans.length
      ? plans.reduce((a, b) => (finalOf(b) < finalOf(a) ? b : a), plans[0])
      : null;
    const passPrice = cheapest ? finalOf(cheapest) : 0;

    // 교집합: 최저가 플랜 권한 / 합집합: 전체 플랜 권한(상위 플랜 추가분 노출용)
    const cheapestTypes = new Set<PassProgramType>(
      cheapest?.privileges.map((pv) => pv.programType) ?? [],
    );
    const unionTypes = new Set<PassProgramType>();
    plans.forEach((p) =>
      p.privileges.forEach((pv) => unionTypes.add(pv.programType)),
    );

    // 포함 콘텐츠 카테고리. full=정상 행, short=(추가 구매) 묶음용
    const categories = [
      {
        types: ['CHALLENGE'] as PassProgramType[],
        full: '취준 필수 챌린지 - 베이직 플랜 10종',
        short: '챌린지 10종',
        note: '베이직 · 각 1회씩, 챌린지 상위 플랜은 차액 결제로 이용 가능',
      },
      {
        types: ['GUIDEBOOK'] as PassProgramType[],
        full: '취준 핵심 가이드북 8종',
        short: '가이드북 8종',
        note: '패스기간 열람 가능',
      },
      {
        types: ['LIVE', 'VOD'] as PassProgramType[],
        full: liveVodLabel(unionTypes.has('LIVE'), unionTypes.has('VOD')),
        short: liveVodLabel(unionTypes.has('LIVE'), unionTypes.has('VOD')),
        note: '패스기간 열람 및 참여 가능',
      },
    ];
    const inUnion = (types: PassProgramType[]) =>
      types.some((t) => unionTypes.has(t));
    const inCheapest = (types: PassProgramType[]) =>
      types.some((t) => cheapestTypes.has(t));

    // 포함(정상) 행 — 최저가 플랜에 있는 카테고리
    const contentRows: ContentRow[] = categories
      .filter((c) => inUnion(c.types) && inCheapest(c.types))
      .map((c) => ({ label: c.full, note: c.note, extra: false }));

    // (추가 구매) — 최저가엔 없고 상위 플랜에만 있는 카테고리들을 & 로 묶어 한 줄
    const extraLabel = categories
      .filter((c) => inUnion(c.types) && !inCheapest(c.types))
      .map((c) => c.short)
      .join(' & ');
    if (extraLabel) {
      contentRows.push({
        label: extraLabel,
        note: '패스기간 열람 및 참여 가능',
        extra: true,
      });
    }

    const compareTabs: CompareTab[] = (
      ['challenge', 'guidebook'] as const
    ).filter((t) =>
      cheapestTypes.has(t === 'challenge' ? 'CHALLENGE' : 'GUIDEBOOK'),
    );

    return { passPrice, contentRows, compareTabs };
  }, [plans]);
}
