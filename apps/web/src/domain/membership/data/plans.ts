// 단일 올패스 플랜 "표시" 데이터(결제 금액은 어드민 챌린지 가격 플랜이 결정 — 여기 값은 시안 카피).
// 가격 위계(정가 취소선 → 특가 → 할인율 배지)와 혜택 7종 스캔형 그리드의 단일 출처.

/** 표시용 가격 (시안 카피 기준, 결제 금액 아님) */
export const PLAN_PRICE = {
  /** 정가 (취소선) */
  original: 938300,
  /** 오픈 특가 (3개월) */
  sale: 149000,
} as const;

export const PLAN_NAME = '렛츠커리어 하반기 멤버십 (올패스)';

export const PLAN_CTA = '올패스 신청하기';

/** 보조 카피 — 콘텐츠(무기한) vs 챌린지(기간형) 안내 */
export const PLAN_FOOTNOTE =
  '가이드북 = 콘텐츠(무기한), 챌린지 = 기간형 운영. 둘 다 포함이라 따로 살 게 없어요.';

/** 혜택 아이콘 식별자 — PlansSection 에서 lucide 컴포넌트로 매핑 렌더 */
export type PlanBenefitIcon =
  | 'fileText'
  | 'target'
  | 'briefcase'
  | 'bookOpen'
  | 'users'
  | 'handshake'
  | 'zap';

export interface PlanBenefit {
  /** 스캔용 아이콘 식별자(lucide 매핑) */
  icon: PlanBenefitIcon;
  /** 혜택 제목 */
  title: string;
  /** 한 줄 상세 */
  detail: string;
}

/** 포함 혜택 7종 (아이콘 + 한 줄, 스캔형 그리드) */
export const PLAN_BENEFITS: PlanBenefit[] = [
  {
    icon: 'fileText',
    title: '서류 작성 챌린지 4종',
    detail: '경험정리 · 이력서 · 자기소개서 · 포트폴리오',
  },
  { icon: 'target', title: '실전 챌린지 2종', detail: '면접 · 인적성' },
  {
    icon: 'briefcase',
    title: '직무 챌린지 4종',
    detail: '마케팅 · HR · 기획 · 대기업',
  },
  { icon: 'bookOpen', title: '가이드북 6종', detail: '핵심 취업 노하우 총정리' },
  { icon: 'users', title: '렛츠런 스터디', detail: '3개월 무료 참여' },
  {
    icon: 'handshake',
    title: '외부 제휴 3종',
    detail: '산타토익 · 뷰인터 · 슈퍼인턴',
  },
  {
    icon: 'zap',
    title: '전 콘텐츠 즉시 오픈',
    detail: '결제 즉시 모든 챌린지 · 자료 이용',
  },
];

/** 표시용 할인율(%) — 정가 대비 특가. 표시 전용이라 내림 정수로. */
export function getDiscountRate(original: number, sale: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}
