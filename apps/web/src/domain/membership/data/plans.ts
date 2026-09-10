// 단일 올패스 플랜 "표시" 데이터.
// 결제 금액은 어드민 챌린지 가격 플랜이 결정한다 — 여기 값은 조회 실패·출시 전에만 쓰는
// 폴백이다. 화면에 실제로 그려지는 값은 useMembershipChallengeData() 가 내려준다.

/**
 * 표시용 가격 폴백 (시안 3.png 기준).
 *
 * 이 숫자가 화면에 보이면 챌린지 조회가 실패했거나 아직 출시 전이라는 뜻이다.
 * 정상 동작 시에는 어드민 BASIC 플랜 가격으로 대체된다.
 *
 * 2026-08-28 현재 연동 챌린지(env `MEMBERSHIP_CHALLENGE_ID`=100000427)가 서버에 없어
 * (`CHALLENGE_NOT_FOUND`) 화면에 실제로 보이는 값이 이 폴백이다. 그래서 가격 변경이
 * 어드민이 아니라 이 파일 수정으로 처리된다. 챌린지가 연결되면 어드민 값이 이긴다.
 */
export const PLAN_PRICE = {
  /**
   * 정가 (취소선). 시안 15 의 가격 카드에는 취소선도 할인 배지도 없어서 판매가와 같은
   * 값을 둔다 — `getDiscountRate` 가 0 을 돌려주고 호출부가 배지를 렌더하지 않는다.
   * 없는 정가를 지어내면 화면에 거짓 할인율이 뜬다.
   */
  original: 175900,
  /** 판매가 (시안 1 히어로 CTA·시안 15 가격 카드) */
  sale: 175900,
} as const;

export const PLAN_NAME = '마케팅 취준 올인원 패스';

/**
 * VOD 옵션 표시용 가격 폴백 (시안 3.png 기준).
 *
 * 챌린지 옵션에서 VOD 옵션을 찾지 못했을 때만 쓴다. 옵션을 못 찾았다는 것은 어드민이
 * 아직 옵션을 안 만들었거나 이름을 다르게 지었다는 뜻이므로, 카드를 비우는 대신 시안
 * 값을 보여주고 결제 시트의 실제 금액이 최종이 되게 한다.
 */
export const VOD_OPTION_PRICE = {
  /** 정가 (취소선) */
  original: 300000,
  /** 판매가 */
  sale: 30000,
} as const;

/** 혜택 아이콘 식별자 — lucide 컴포넌트로 매핑해 렌더한다 */
export type PlanBenefitIcon =
  | 'flag'
  | 'bookOpen'
  | 'workflow'
  | 'users'
  | 'userRoundCheck';

export interface PlanBenefit {
  /** 스캔용 아이콘 식별자(lucide 매핑) */
  icon: PlanBenefitIcon;
  /** 시안 3.png 좌측 한 줄 */
  title: string;
}

/** 포함 혜택 (시안 15 가격 카드 좌측 목록, 2열 7줄). */
export const PLAN_BENEFITS: PlanBenefit[] = [
  { icon: 'flag', title: '챌린지 10종 베이직' },
  { icon: 'bookOpen', title: '가이드북 7종' },
  { icon: 'workflow', title: '10주 합격 플레이북' },
  { icon: 'users', title: '현직자 VOD 3종' },
  { icon: 'users', title: '특별 LIVE 세미나 2종' },
  { icon: 'userRoundCheck', title: '쥬디멘토의 LIVE 클리닉' },
  { icon: 'userRoundCheck', title: '멘토링 50% 쿠폰 2장' },
];

/**
 * 표시용 할인율(%) — 정가 대비 특가. 표시 전용이라 반올림 정수로.
 *
 * 정가가 0 이하이거나 특가가 정가보다 비싸면 0 을 돌려준다. 호출부는 0 이면 배지를
 * 렌더하지 않는다 — "0% 할인" 이나 음수 할인율이 화면에 남는 쪽이 더 나쁘다.
 */
export function getDiscountRate(original: number, sale: number): number {
  if (original <= 0) return 0;
  if (sale > original) return 0;
  return Math.round(((original - sale) / original) * 100);
}
