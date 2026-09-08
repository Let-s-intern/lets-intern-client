import { render, screen } from '@testing-library/react';

import PriceSection, { resolveCouponDiscount } from './PriceSection';

/*
  표시액 계산은 서버 `calculatePrice` 와 같은 규칙이어야 한다.

    couponDiscount = coupon == null ? 0
                   : coupon.getDiscount() == -1 ? originalPrice
                   : Math.min(originalPrice, coupon.getDiscount())

  어긋나면 화면 금액과 실제 청구액이 달라진다.
*/
describe('resolveCouponDiscount — 서버 계산식과 일치', () => {
  it('쿠폰이 없으면 0 이다', () => {
    expect(resolveCouponDiscount(35000, null)).toBe(0);
    expect(resolveCouponDiscount(35000, undefined)).toBe(0);
  });

  it('-1 은 전액 할인이라 남은 금액 전부를 뺀다', () => {
    expect(resolveCouponDiscount(35000, -1)).toBe(35000);
  });

  it('정액 쿠폰은 원금을 넘지 않는다', () => {
    expect(resolveCouponDiscount(35000, 10000)).toBe(10000);
    expect(resolveCouponDiscount(35000, 50000)).toBe(35000);
  });
});

describe('PriceSection — 금액 표시', () => {
  it('전액 할인 쿠폰이면 결제금액이 0원이 된다', () => {
    render(
      <PriceSection
        price={35000}
        appliedCouponCode="LMTEST0"
        couponDiscount={-1}
      />,
    );

    expect(screen.getByText('쿠폰할인')).toBeInTheDocument();
    expect(screen.getByText('-35,000원')).toBeInTheDocument();
    expect(screen.getByText('0원')).toBeInTheDocument();
  });

  it('쿠폰이 없으면 쿠폰할인 행이 없다', () => {
    render(<PriceSection price={35000} appliedCouponCode={null} />);

    expect(screen.queryByText('쿠폰할인')).not.toBeInTheDocument();
    // 상품가와 결제금액이 같은 값이라 텍스트만으로는 구분되지 않는다. 결제금액 행을 짚는다.
    expect(screen.getByText('결제금액').nextElementSibling).toHaveTextContent(
      '35,000원',
    );
  });

  // 서버 `productDiscount` 가 0 고정이라 할인 행은 아직 나타나지 않는다.
  it('상품 할인이 0 이면 할인 행을 감춘다', () => {
    render(
      <PriceSection
        price={35000}
        productDiscount={0}
        appliedCouponCode={null}
      />,
    );

    expect(screen.queryByText('할인')).not.toBeInTheDocument();
  });
});
