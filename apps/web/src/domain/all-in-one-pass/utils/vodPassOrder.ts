// 올인원패스 주문에 함께 담는 VOD 이용권(LC-3533). 계산은 챌린지와 같은 vodPassPurchase.ts 함수를 쓴다.
import type { MembershipVodPassProduct } from '@/domain/all-in-one-pass/api/purchase';
import type { MembershipOrderData } from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import {
  calculateVodPassDurationDays,
  calculateVodPassPrice,
  clampVodPassMonths,
  getVodPassMaxMonths,
  supportsVodPassMonths,
  VOD_PASS_MIN_MONTHS,
} from '@/domain/program/vodPassPurchase';

/** 스토어에 담는 VOD 이용권 선택 */
export type VodPassOrderSelection = Pick<
  MembershipOrderData,
  'vodPassProductId' | 'vodPassPrice' | 'vodPassDurationDays' | 'vodPassMonths'
>;

/**
 * 고를 수 있는 개월 범위로 맞춘 개월 수.
 * 추가 월 가격이 없는 응답은 개월 선택을 지원하지 않는 서버라 1개월로 고정한다.
 */
export function getSelectableVodPassMonths(
  product: MembershipVodPassProduct,
  months: number,
): number {
  if (!supportsVodPassMonths(product)) {
    return VOD_PASS_MIN_MONTHS;
  }
  return clampVodPassMonths(months, getVodPassMaxMonths(product));
}

/** 상품과 개월 수로 스토어에 담을 선택 값을 만든다 */
export function toVodPassOrderSelection(
  product: MembershipVodPassProduct,
  months: number,
): VodPassOrderSelection {
  const safeMonths = getSelectableVodPassMonths(product, months);
  return {
    vodPassProductId: product.id,
    vodPassPrice: calculateVodPassPrice(product, safeMonths),
    vodPassDurationDays: calculateVodPassDurationDays(product, safeMonths),
    vodPassMonths: safeMonths,
  };
}
