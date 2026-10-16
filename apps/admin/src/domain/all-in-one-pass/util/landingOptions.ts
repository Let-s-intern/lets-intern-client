/** 랜딩페이지 구성 선택지 상수 (아이콘·후기 드롭다운) + 빈 후기·자동 혜택 헬퍼. */

import {
  PassLandingReview,
  PassPermission,
  PassPlan,
} from '@/domain/all-in-one-pass/types';

const ICON_BASE = '/icons/all-in-one-pass-benefit';

/** 추가혜택 아이콘 후보 (public/icons/*.svg) */
export const BENEFIT_ICON_OPTIONS = [
  { key: 'challenge', src: `${ICON_BASE}-challenge.svg` },
  { key: 'vod', src: `${ICON_BASE}-vod.svg` },
  { key: 'guidebook', src: `${ICON_BASE}-guidebook.svg` },
  { key: 'liveSeminar', src: `${ICON_BASE}-live-seminar.svg` },
  { key: 'mentoring', src: `${ICON_BASE}-mentoring.svg` },
  { key: 'playbook', src: `${ICON_BASE}-playbook.svg` },
  { key: 'talk', src: `${ICON_BASE}-talk.svg` },
  { key: 'slack', src: `${ICON_BASE}-slack.svg` },
] as const;

export const DEFAULT_BENEFIT_ICON_KEY = BENEFIT_ICON_OPTIONS[0].key;

/** iconKey → svg 경로 (없으면 첫 아이콘) */
export const getBenefitIconSrc = (key: string): string =>
  BENEFIT_ICON_OPTIONS.find((o) => o.key === key)?.src ??
  BENEFIT_ICON_OPTIONS[0].src;

/** 아직 쓰이지 않은 첫 아이콘 key (다 쓰였으면 기본값) */
export const getFirstAvailableIconKey = (usedKeys: Set<string>): string =>
  BENEFIT_ICON_OPTIONS.find((o) => !usedKeys.has(o.key))?.key ??
  DEFAULT_BENEFIT_ICON_KEY;

// ── 자동 포함(핵심) 혜택 ───────────────────────────────
// 플랜 권한 union 에 해당 프로그램이 있으면 자동 노출되는 프리셋 혜택. 어드민에선
// 읽기전용 미리보기로만 보여준다(저장 X — 웹이 planList 로 동일하게 파생).
export interface CoreBenefit {
  name: string;
  description: string;
  iconKey: string; // BENEFIT_ICON_OPTIONS 의 key
}

const CORE_BENEFIT_PRESETS: Record<PassPermission, CoreBenefit> = {
  CHALLENGE_ALL_IN_ONE: {
    name: '챌린지 10종',
    description: '자소서·포폴부터 면접·인적성까지',
    iconKey: 'challenge',
  },
  VOD_ALL_IN_ONE: {
    name: 'VOD 20종',
    description: '현직자가 알려주는 직무·취업 노하우',
    iconKey: 'vod',
  },
  GUIDEBOOK_ALL_IN_ONE: {
    name: '가이드북 7종',
    description: '막막할 때 꺼내 보는 취준 가이드',
    iconKey: 'guidebook',
  },
  LIVE_CLASS_ALL_IN_ONE: {
    name: 'LIVE 세미나',
    description: '현직자가 전하는 실시간 세미나', // TODO: 문구 확정 필요
    iconKey: 'liveSeminar',
  },
};

const CORE_BENEFIT_ORDER: PassPermission[] = [
  'CHALLENGE_ALL_IN_ONE',
  'VOD_ALL_IN_ONE',
  'GUIDEBOOK_ALL_IN_ONE',
  'LIVE_CLASS_ALL_IN_ONE',
];

/** 멘토링은 플랜 권한과 무관하게 항상 노출 */
const MENTORING_CORE_BENEFIT: CoreBenefit = {
  name: '1:1 멘토링 할인 쿠폰',
  description: '현직자 1:1 상담을 할인된 가격에',
  iconKey: 'mentoring',
};

/** 플랜 권한 union → 자동 포함 혜택 목록 (+ 멘토링 항상) */
export const getCoreBenefits = (plans: PassPlan[]): CoreBenefit[] => {
  const union = new Set<PassPermission>();
  plans.forEach((p) => p.permissions.forEach((perm) => union.add(perm)));
  const fromPlans = CORE_BENEFIT_ORDER.filter((perm) => union.has(perm)).map(
    (perm) => CORE_BENEFIT_PRESETS[perm],
  );
  return [...fromPlans, MENTORING_CORE_BENEFIT];
};

/** 혜택요약에 노출되는 총 카드 수 상한 (자동 포함 + 외부링크 + 수동 합산) */
export const MAX_BENEFIT_CARDS = 6;

/** 자동 포함 혜택을 뺀 나머지(외부링크+수동)가 쓸 수 있는 슬롯 수 */
export const getAdditionalBenefitSlots = (plans: PassPlan[]): number =>
  Math.max(MAX_BENEFIT_CARDS - getCoreBenefits(plans).length, 0);

/** 후기 출처 */
export const REVIEW_SOURCE_OPTIONS = [
  '인스타그램 DM',
  '카카오톡 오픈채팅',
  '챌린지 커뮤니티',
  '기타',
] as const;

/** 후기 결과태그 */
export const REVIEW_RESULT_TAG_OPTIONS = [
  '서류 합격',
  '최종 합격',
  '인턴 합격',
  '면접 준비',
  '취준 루틴',
  '동기부여',
  '콘텐츠 만족',
] as const;

/** 빈 후기 1건 (출처·결과태그 미선택) */
export const createEmptyReview = (): PassLandingReview => ({
  id: crypto.randomUUID(),
  source: '',
  resultTags: [],
  imageUrl: '',
  summary: '',
});

/** 내용이 하나도 없는 후기 (저장 시 제외 — 빈 후기만 있으면 랜딩 후기 섹션 미노출) */
export const isReviewEmpty = (r: PassLandingReview): boolean =>
  !r.source && !r.imageUrl && !r.summary && r.resultTags.length === 0;
