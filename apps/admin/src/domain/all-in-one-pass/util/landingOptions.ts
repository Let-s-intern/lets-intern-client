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
  { key: 'point', src: `${ICON_BASE}-point.svg` },
  { key: 'coupon', src: `${ICON_BASE}-coupon.svg` },
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
    description: '현직자가 전하는 실시간 세미나',
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
  '멘토에게 온 메시지',
  '미션 소감',
  '기타',
] as const;

/** 후기 결과태그 */
export const REVIEW_RESULT_TAG_OPTIONS = [
  '서류 합격 🎉',
  '최종 합격 🎉',
  '인턴 합격 🎉',
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

// 생성 폼 기본 후기 6종(출처·결과태그·요약·이미지 프리필). 아무것도 안 건드리고 저장해도
// 이 6개가 랜딩에 노출. 수정·삭제·추가(최대 9) 가능. 이미지는 web·admin public 공통 경로.
const DEFAULT_REVIEW_SEEDS: Array<Omit<PassLandingReview, 'id'>> = [
  {
    source: '인스타그램 DM',
    resultTags: ['서류 합격 🎉', '최종 합격 🎉'],
    imageUrl: '/images/all-in-one-pass/review-instagram.jpg',
    summary:
      '렛커 챌린지로 이력서·자소서까지 참고해 교육기업 서류 합격, 식품계 최종 합격했어요.',
  },
  {
    source: '멘토에게 온 메시지',
    resultTags: ['서류 합격 🎉'],
    imageUrl: '/images/all-in-one-pass/review-companies.png',
    summary:
      '경험 정리로 강점을 발견한 덕분에 주요 대기업 6개사 서류 합격이라는 값진 결과를 얻었어요.',
  },
  {
    source: '카카오톡 오픈채팅',
    resultTags: ['최종 합격 🎉'],
    imageUrl: '/images/all-in-one-pass/review-coverletter.png',
    summary:
      '자기소개서 챌린지에서 방향성·경험 정리에 큰 도움을 받아 준대기업 PM 정규직으로 합격했어요.',
  },
  {
    source: '챌린지 커뮤니티',
    resultTags: ['면접 준비'],
    imageUrl: '/images/all-in-one-pass/review-interview.png',
    summary:
      '기업 분석 방법을 배우고 100개 넘는 질문을 접하며 자신감 있게 실전에 임하게 됐어요.',
  },
  {
    source: '챌린지 커뮤니티',
    resultTags: ['콘텐츠 만족'],
    imageUrl: '/images/all-in-one-pass/review-renewal.jpg',
    summary:
      '리뉴얼된 챌린지 콘텐츠가 양질이라 계속 들여다보며 큰 도움을 받았어요.',
  },
  {
    source: '미션 소감',
    resultTags: ['동기부여'],
    imageUrl: '/images/all-in-one-pass/review-mission.png',
    summary:
      '취준 일기처럼 소감을 적으니 심리적 안정과 동기부여에 큰 도움이 돼요.',
  },
];

/** 생성 폼 기본 후기 6건 (매 호출 새 id 부여) */
export const createDefaultReviews = (): PassLandingReview[] =>
  DEFAULT_REVIEW_SEEDS.map((seed) => ({ id: crypto.randomUUID(), ...seed }));
