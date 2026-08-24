// axios 는 @letscareer/api 를 거쳐 import.meta 를 쓰므로 jest 에서 그대로 로드되지 않는다.
// 이 테스트는 목록 필터만 보므로 통째로 목으로 대체한다.
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import { render, screen } from '@testing-library/react';
import type { CouponItem } from '@/api/coupon/coupon';
import CouponSection from './CouponSection';

const useMyCouponsMock = jest.fn();

jest.mock('@/api/coupon/coupon', () => ({
  __esModule: true,
  useMyCoupons: (...args: unknown[]) => useMyCouponsMock(...args),
  COUPON_TYPE_LABEL: {
    PARTNERSHIP: '제휴',
    EVENT: '이벤트',
    GRADE: '등급별 할인',
  },
}));

// 모달은 목록만 받아 그리므로, 노출 개수 검증에는 불필요하다.
jest.mock('../modal/CouponSelectModal', () => ({
  __esModule: true,
  default: () => null,
}));

const coupon = (couponId: number, discount: number): CouponItem => ({
  couponId,
  couponType: 'EVENT',
  couponProgramTypeList: ['CHALLENGE'],
  name: `쿠폰 ${couponId}`,
  code: `CODE${couponId}`,
  discount,
  time: -1,
  remainTime: -1,
  startDate: '2026-01-01T00:00:00',
  endDate: '2026-12-31T23:59:59',
});

/** 전액할인 1장 + 일반 할인 1장 */
const COUPONS = [coupon(1, -1), coupon(2, 5000)];

beforeEach(() => {
  useMyCouponsMock.mockReset();
  useMyCouponsMock.mockReturnValue({ data: COUPONS });
});

const renderSection = (allowFullDiscount?: boolean) =>
  render(
    <CouponSection
      setCoupon={jest.fn()}
      programType="challenge"
      maxAmount={169000}
      allowFullDiscount={allowFullDiscount}
    />,
  );

describe('CouponSection', () => {
  it('기본값은 보유 쿠폰을 모두 노출한다', () => {
    // allowFullDiscount 를 넘기지 않는 호출부의 동작이 바뀌면 안 된다.
    renderSection();
    expect(screen.getByText('2장')).toBeInTheDocument();
  });

  describe('[LC-3219-MEMBERSHIP] 전액할인 숨김 (담당자 임성빈, 시즌 종료 시 제거)', () => {
    it('허용하면 전액할인 쿠폰도 함께 노출한다', () => {
      renderSection(true);
      expect(screen.getByText('2장')).toBeInTheDocument();
    });

    it('막으면 전액할인 쿠폰을 목록에서 뺀다', () => {
      // 멤버십은 어드민 챌린지라 챌린지용 전액할인 쿠폰이 그대로 먹는다.
      // 고를 수 없게 목록에서 빼는 것이 이 분기의 목적이다.
      renderSection(false);
      expect(screen.getByText('1장')).toBeInTheDocument();
    });

    it('전액할인만 빼고 일반 할인 쿠폰은 남긴다', () => {
      // 쿠폰 기능 자체를 막는 것이 아니다.
      useMyCouponsMock.mockReturnValue({ data: [coupon(1, -1)] });
      renderSection(false);
      expect(
        screen.getByText(/적용 가능한 쿠폰이 없습니다/),
      ).toBeInTheDocument();
    });
  });
});
