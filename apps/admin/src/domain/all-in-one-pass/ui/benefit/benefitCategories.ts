import type { BenefitCouponSetting } from '@/domain/all-in-one-pass/types';

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

/** 쿠폰 할인 라벨 (예: "전액 할인 쿠폰" · "50% 할인 쿠폰" · "5,000원 할인 쿠폰") */
export const benefitCouponLabel = (coupon: BenefitCouponSetting): string => {
  if (coupon.discountType === 'FULL') return '전액 할인 쿠폰';
  if (coupon.discountType === 'PERCENT') return `${coupon.value ?? 0}% 할인 쿠폰`;
  return `${(coupon.value ?? 0).toLocaleString()}원 할인 쿠폰`;
};

/** 멘토링 쿠폰 카드 제목 (예: "1:1 LIVE 멘토링 50% 할인 쿠폰"). 실제 쿠폰명은 앞에 패스명이 붙는다 */
export const mentoringCouponTitle = (coupon: BenefitCouponSetting): string =>
  `1:1 LIVE 멘토링 ${benefitCouponLabel(coupon)}`;

/** 쿠폰 설정이 저장 가능한지 (횟수 무제한/≥1 · 전액이 아니면 값 ≥1) */
export const isBenefitCouponValid = (coupon: BenefitCouponSetting): boolean =>
  (coupon.count < 0 || coupon.count >= 1) &&
  (coupon.discountType === 'FULL' || (coupon.value ?? 0) >= 1);
