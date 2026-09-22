/**
 * 기타 혜택의 고정(기본 제공) 카테고리.
 *
 * 어드민이 직접입력으로 만드는 유형과 달리, 등록 여부와 무관하게 항상 탭·유형 선택지로
 * 노출된다. "1:1 LIVE 멘토링"은 멘토링 쿠폰 자동생성과 연결되는 특수 카테고리다.
 */
export const FIXED_BENEFIT_CATEGORIES = ['1:1 LIVE 멘토링 할인 쿠폰'] as const;

/** 해당 유형이 고정 카테고리인지 */
export const isFixedBenefitCategory = (category: string): boolean =>
  (FIXED_BENEFIT_CATEGORIES as readonly string[]).includes(category);
