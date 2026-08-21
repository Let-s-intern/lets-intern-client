'use client';

import { formatPrice } from '../../constants';

interface PriceSectionProps {
  /** 선택 플랜의 판매가. */
  price: number;
  /**
   * 상품 할인액. 서버 `productDiscount` 가 지금은 0 고정이다.
   * 0 이면 행을 감춘다 — PRD 4-5 로 값이 생기면 자동으로 나타난다.
   */
  productDiscount?: number;
  /** 등록한 쿠폰 코드. 할인 금액은 서버가 정하므로 여기서는 계산하지 않는다. */
  appliedCouponCode: string | null;
}

/**
 * 금액 내역 (시안 `2-0` 하단).
 *
 * **쿠폰 할인액을 숫자로 적지 않는다.** 할인 계산은 서버가 신청 생성 시점에 하고,
 * 사전 조회 API 가 없어 이 화면에서는 얼마가 빠질지 알 수 없다. 시안처럼
 * `-10,000원` 을 적으려면 그 숫자를 지어내야 한다. 실제 청구액은 신청 생성 응답의
 * `payment.finalAmount` 이고, 그 값이 Toss 결제창에 뜬다.
 */
const PriceSection = ({
  price,
  productDiscount = 0,
  appliedCouponCode,
}: PriceSectionProps) => {
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
            <dd className="text-neutral-45 text-xxsmall12">
              결제 단계에서 적용
            </dd>
          </div>
        )}
      </dl>

      <div className="border-neutral-85 flex items-center justify-between border-t pt-4">
        <span className="text-xsmall16 text-neutral-0 font-bold">결제금액</span>
        <span className="text-small18 text-neutral-0 font-bold">
          {formatPrice(price - productDiscount)}
        </span>
      </div>
    </section>
  );
};

export default PriceSection;
