import { render, screen } from '@testing-library/react';
import MentoringCouponSection from './MentoringCouponSection';
import {
  COUPON_ALT,
  COUPON_SIZE,
  COUPON_SRC,
  MENTORING_COUPON,
} from '../data/mentoringCoupon';

describe('MentoringCouponSection', () => {
  it('헤더와 각주는 텍스트로 그린다', () => {
    // 이미지에 넣으면 제목이 사라져 검색에서 통째로 빠진다.
    // 혜택 묶음의 형제 블록이라 h2 가 아니라 h3 다 — 이 묶음의 h2 는 CoursePlanSection 이 그린다.
    render(<MentoringCouponSection />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      MENTORING_COUPON.titleTop,
    );
    expect(screen.getByText(MENTORING_COUPON.titleMain)).toBeInTheDocument();
    expect(screen.getByText(MENTORING_COUPON.subtitle)).toBeInTheDocument();
    expect(screen.getByText(MENTORING_COUPON.footnote)).toBeInTheDocument();
  });

  it('쿠폰 카드만 이미지로 넣는다', () => {
    render(<MentoringCouponSection />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', COUPON_SRC);
    expect(COUPON_SRC.endsWith('.webp')).toBe(true);
    expect(img).toHaveAttribute('alt', COUPON_ALT);
  });

  it('CLS 방지를 위해 width·height 를 직접 지정한다', () => {
    // domain/membership 은 next/image 를 쓰지 않아 크기 예약이 자동으로 되지 않는다.
    render(<MentoringCouponSection />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', String(COUPON_SIZE.width));
    expect(img).toHaveAttribute('height', String(COUPON_SIZE.height));
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('앵커·제거 용이성을 위해 section id 를 유지한다', () => {
    const { container } = render(<MentoringCouponSection />);
    expect(container.querySelector('section#mentoring-coupon')).not.toBeNull();
  });
});
