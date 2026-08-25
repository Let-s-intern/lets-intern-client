'use client';

import { formatPrice } from '../../constants';
import { FULL_DISCOUNT } from '../types';

interface PriceSectionProps {
  /** 선택 플랜의 판매가. */
  price: number;
  /**
   * 상품 할인액. 서버 `productDiscount` 가 지금은 0 고정이다.
   * 0 이면 행을 감춘다 — PRD 4-5 로 값이 생기면 자동으로 나타난다.
   */
  productDiscount?: number;
  /** 등록한 쿠폰 코드. */
  appliedCouponCode: string | null;
  /** 쿠폰 검증 응답의 할인값. `-1` 은 전액 할인이다. */
  couponDiscount?: number | null;
}

/** 쿠폰 할인 표시액. 전액 할인은 남은 금액 전부, 정액은 남은 금액까지만 빠진다. */
export const resolveCouponDiscount = (
  priceAfterProductDiscount: number,
  couponDiscount: number | null | undefined,
): number => {
  if (couponDiscount === null || couponDiscount === undefined) return 0;
  if (couponDiscount === FULL_DISCOUNT) return priceAfterProductDiscount;
  return Math.min(priceAfterProductDiscount, couponDiscount);
};

/**
 * 금액 내역 (시안 `2-0` 하단).
 *
 * 쿠폰 할인액은 등록 시점에 서버(`GET /coupon`)가 알려준 값으로 계산해 보여준다.
 * 계산식은 서버 `calculatePrice` 와 같다 — 전액 할인(`-1`)은 원금까지, 정액은
 * 원금을 넘지 않는 선까지. 실제 청구액은 신청 생성 응답의 `payment.finalAmount` 이고
 * 그 값이 결제창에 뜬다. 여기 숫자와 어긋나면 서버 값이 맞다.
 */
const PriceSection = ({
  price,
  productDiscount = 0,
  appliedCouponCode,
  couponDiscount,
}: PriceSectionProps) => {
  const afterProduct = price - productDiscount;
  const couponAmount = resolveCouponDiscount(afterProduct, couponDiscount);
  const total = Math.max(afterProduct - couponAmount, 0);

  return (
    <section className="flex flex-col gap-3">
      <dl className="text-xsmall14 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <dt className="text-neutral-20">결제 상품</dt>
          <dd className="text-neutral-0">{formatPrice(price)}</dd>
        </div>

        {productDiscount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-primary font-medium">할인</dt>
            <dd className="text-neutral-0">-{formatPrice(productDiscount)}</dd>
          </div>
        )}

        {appliedCouponCode !== null && (
          <div className="flex items-center justify-between">
            <dt className="text-primary font-medium">쿠폰할인</dt>
            <dd className="text-neutral-0">-{formatPrice(couponAmount)}</dd>
          </div>
        )}
      </dl>

      <div className="border-neutral-85 flex items-center justify-between border-t pt-4">
        <span className="text-xsmall16 text-neutral-0 font-bold">결제금액</span>
        <span className="text-small18 text-neutral-0 font-bold">
          {formatPrice(total)}
        </span>
      </div>
    </section>
  );
};

export default PriceSection;
