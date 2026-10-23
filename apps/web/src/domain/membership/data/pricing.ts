// 개편 시안 11 — 가격 비교 (PRICING). PRD 4.11.
//
// 카드 두 장을 맞세운다. 왼쪽은 필요한 프로그램을 하나씩 사는 경우, 오른쪽은 패스다.
// 기존 `data/compare.ts`(조합 3줄 비교표)와 같은 성격이지만 줄 구성이 달라 새로 만든다.
//
// **합계와 SAVE 는 적지 않고 계산한다.** 시안에는 392,000원과 216,100원이 적혀 있는데,
// 그 숫자를 그대로 두면 아래 6줄 중 하나만 바뀌어도 합계가 옛 값으로 남는다. 둘 다
// 화면에서 계산해 만든다.
//
// **패스 가격도 여기 없다.** 어드민 챌린지 값(`useMembershipChallengeData().salePrice`)이
// 이기고, 조회 실패 시에만 `data/plans.ts` 의 폴백이 쓰인다. 여기 적으면 세 곳이 된다.

/** 개별 구매 한 줄 */
export interface PricingItem {
  /** 상품명 */
  label: string;
  /** 판매가 */
  price: number;
}

/** 패스에 포함되는 한 줄. `strong` 은 줄 앞에 붙는 굵은 꼬리표다 */
export interface PassIncludeLine {
  /** 줄 앞 굵은 꼬리표 (없는 줄이 대부분이다) */
  strong?: string;
  text: string;
}

/**
 * 개별 구매 6줄.
 *
 * 금액은 시안 11 값이다. 실제 상품가와 다르면 **이 값을 운영 값으로 고친다** (PRD 7절 D).
 * 합계는 여기서 계산되므로 한 줄만 고치면 합계와 SAVE 가 함께 따라간다.
 */
export const INDIVIDUAL_ITEMS: readonly PricingItem[] = [
  { label: '마케팅 서류 완성 챌린지', price: 99000 },
  { label: '경험정리 챌린지', price: 33000 },
  { label: '이력서 챌린지', price: 33000 },
  { label: '자기소개서 챌린지', price: 73500 },
  { label: '포트폴리오 챌린지', price: 78500 },
  { label: '면접 챌린지', price: 75000 },
];

/**
 * 패스 혜택 6줄 (시안 11 오른쪽 카드).
 *
 * 마지막 두 줄만 앞에 굵은 꼬리표가 붙는다 — 패스에만 있는 혜택이라 시안이 구분해 둔 것이다.
 */
export const PASS_INCLUDE_LINES: readonly PassIncludeLine[] = [
  { text: '현재 오픈된 마케팅 취준 챌린지 10종 자유 참여' },
  { text: '마케팅 취준 가이드북 7종' },
  { text: '현직자 Live 세미나 & VOD' },
  { text: '현직자 1:1 커피챗 멘토링' },
  { strong: '패스 참여자 특별혜택', text: '쥬디멘토의 LIVE CLINIC' },
  { strong: '패스 참여자 전용', text: '10주 취준 플레이북' },
];

export const PRICING = {
  anchorId: 'pricing',
  eyebrow: 'PRICING',
  titleLines: ['초안 작성부터 경험 진단,', '10주간의 실제 지원 서류 완성까지'],
  /** 두 카드 사이 원 */
  vsLabel: 'VS',
  optionLabel: 'OPTION 1',
  optionTitle: '필요한 프로그램 개별 구매',
  /**
   * 시안에는 「개별 구매 총」 까지만 적혀 있다. 한국어로 끝나지 않는 말이라
   * 「개별 구매 총액」 으로 읽었다 — 시안 오타를 따라가지 않는다는 이 도메인의 관행과 같다.
   */
  totalLabel: '개별 구매 총액',
  passOptionLabel: 'OPTION 2 · RECOMMENDED',
  passTitle: '마케팅 올인원 패스',
  /** SAVE 칩 — 가운데 금액만 계산해 끼운다 */
  saveLead: '개별 구매 대비',
  saveTail: 'SAVE',
  ctaLabel: '마케팅 올인원 패스 시작하기',
} as const;

/** 개별 구매 합계. 6줄을 더한 값이고, 화면의 취소선 금액이 이것이다 */
export function getIndividualTotal(
  items: readonly PricingItem[] = INDIVIDUAL_ITEMS,
): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

/**
 * 개별 구매 대비 절약 금액 — 합계 − 패스가.
 *
 * 패스가가 합계보다 비싸지면 음수가 되는데, 화면에 "−10,000원 SAVE" 가 남는 것보다
 * 0 을 돌려주고 호출부가 칩을 숨기는 편이 낫다.
 */
export function getSaveAmount(
  passPrice: number,
  items: readonly PricingItem[] = INDIVIDUAL_ITEMS,
): number {
  return Math.max(0, getIndividualTotal(items) - passPrice);
}
