import { render, screen } from '@testing-library/react';

import { MENTORING_COUPON } from '../data/mentoringCoupon';
import MentoringCouponSection from './MentoringCouponSection';

describe('MentoringCouponSection (시안 14)', () => {
  it('할인율과 쿠폰 안내를 그린다', () => {
    render(<MentoringCouponSection />);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('PASS ONLY')).toBeInTheDocument();
  });

  it('현직자 예시를 모두 그린다', () => {
    render(<MentoringCouponSection />);

    for (const mentor of MENTORING_COUPON.mentors) {
      expect(screen.getByText(mentor.company)).toBeInTheDocument();
    }
  });

  /*
   * 각주가 빠지면 "이 회사 현직자와 멘토링할 수 있다" 는 약속으로 읽힌다.
   * 목록은 예시일 뿐이라 각주가 함께 있어야 한다.
   */
  it('멘토가 바뀔 수 있다는 각주를 함께 노출한다', () => {
    render(<MentoringCouponSection />);
    expect(screen.getByText(MENTORING_COUPON.footnote)).toBeInTheDocument();
  });
});
