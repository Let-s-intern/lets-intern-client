import { render, screen, within } from '@testing-library/react';
import PriceSection from './PriceSection';

const PAY_INFO = { price: 100000, discount: 10000 };

describe('PriceSection VOD 이용권 줄 (LC-3438)', () => {
  it('이용권 가격이 있으면 쿠폰 줄 아래에 이용권 줄을 보여준다', () => {
    const { container } = render(
      <PriceSection
        payInfo={PAY_INFO}
        coupon={{ id: 3, price: 20000 }}
        vodPassPrice={29000}
      />,
    );

    const rows = Array.from(container.querySelectorAll('div.h-10')).map(
      (row) => row.textContent,
    );

    expect(rows).toEqual([
      '결제상품100,000원',
      '10% 할인-10,000원',
      '쿠폰할인-20,000원',
      'VOD 이용권+29,000원',
    ]);
  });

  it('이용권 가격을 넘기지 않으면 기존 줄만 그린다', () => {
    render(<PriceSection payInfo={PAY_INFO} coupon={{ id: null, price: 0 }} />);

    expect(screen.queryByText('VOD 이용권')).not.toBeInTheDocument();
    expect(screen.getByText('결제상품')).toBeInTheDocument();
    expect(screen.getByText('쿠폰할인')).toBeInTheDocument();
  });

  it('이용권 가격이 0 이면 줄을 그리지 않는다', () => {
    render(
      <PriceSection
        payInfo={PAY_INFO}
        coupon={{ id: null, price: 0 }}
        vodPassPrice={0}
      />,
    );

    expect(screen.queryByText('VOD 이용권')).not.toBeInTheDocument();
  });

  it('쿠폰 줄을 숨겨도 이용권 줄은 보여준다', () => {
    render(
      <PriceSection
        payInfo={PAY_INFO}
        coupon={{ id: null, price: 0 }}
        showCouponDiscount={false}
        vodPassPrice={29000}
      />,
    );

    expect(screen.queryByText('쿠폰할인')).not.toBeInTheDocument();
    const row = screen.getByText('VOD 이용권').parentElement as HTMLElement;
    expect(within(row).getByText('+29,000원')).toBeInTheDocument();
  });

  it('전액 쿠폰이어도 이용권 줄은 그대로 남는다', () => {
    // 쿠폰은 챌린지 몫만 깎는다. 정가 전체를 덮어도 이용권 금액은 결제한다
    render(
      <PriceSection
        payInfo={PAY_INFO}
        coupon={{ id: 3, price: 90000 }}
        vodPassPrice={29000}
      />,
    );

    expect(screen.getByText('-90,000원')).toBeInTheDocument();
    expect(screen.getByText('+29,000원')).toBeInTheDocument();
  });
});
