import { render, screen } from '@testing-library/react';
import { PLAN_BENEFITS, PLAN_NAME } from '../data/plans';

// 훅(챌린지 조회)은 이 테스트의 대상이 아니다. 섹션이 훅이 내려준 값만 그리는지,
// 시안 숫자(938,300 / 169,900 / 82% / 11월 30일)가 코드에 박혀 있지 않은지만 본다.
const mockData = jest.fn();
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => mockData(),
}));
jest.mock('../ui/VodOptionCard', () => ({
  __esModule: true,
  default: () => null,
}));

import PlansSection from './PlansSection';

const baseData = {
  endDate: new Date('2026-11-30T23:59:59+09:00'),
  regularPrice: 938300,
  salePrice: 169900,
};

describe('PlansSection', () => {
  beforeEach(() => {
    mockData.mockReturnValue(baseData);
    // 카운트업은 IntersectionObserver 로 재생된다. jsdom 에는 없으므로 훅이
    // 즉시 최종값으로 떨어지는 경로를 타게 둔다.
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  });

  it('시안 헤더 카피를 렌더한다', () => {
    render(<PlansSection />);
    expect(screen.getByText('가격 플랜')).toBeInTheDocument();
    expect(
      screen.getByText('공채 준비에 필요한 것만 모아, 부담은 줄였어요'),
    ).toBeInTheDocument();
    expect(screen.getByText(PLAN_NAME)).toBeInTheDocument();
  });

  it('포함 혜택을 데이터 개수만큼 렌더한다', () => {
    const { container } = render(<PlansSection />);
    expect(container.querySelectorAll('.allpass-benefit')).toHaveLength(
      PLAN_BENEFITS.length,
    );
    for (const benefit of PLAN_BENEFITS) {
      expect(screen.getByText(benefit.title)).toBeInTheDocument();
    }
  });

  it('가격과 할인율은 훅 값에서 나온다 (하드코딩 아님)', () => {
    // 시안 폴백(938,300 / 169,900 / 82%)과 다른 값을 내려 하드코딩이 남아 있으면 실패한다.
    mockData.mockReturnValue({
      ...baseData,
      regularPrice: 500000,
      salePrice: 100000,
    });
    render(<PlansSection />);

    expect(screen.getByText('500,000원')).toBeInTheDocument();
    expect(screen.getByText('100,000')).toBeInTheDocument();
    expect(screen.getByText('80% 할인')).toBeInTheDocument();
  });

  it('이용 기한은 endDate 를 포맷해서 쓴다 (날짜 하드코딩 아님)', () => {
    mockData.mockReturnValue({
      ...baseData,
      endDate: new Date('2026-09-30T23:59:59+09:00'),
    });
    render(<PlansSection />);

    expect(screen.getByText('9월 30일까지 이용')).toBeInTheDocument();
  });

  it('할인이 성립하지 않으면 할인율 배지를 그리지 않는다', () => {
    mockData.mockReturnValue({
      ...baseData,
      regularPrice: 169900,
      salePrice: 169900,
    });
    render(<PlansSection />);

    expect(screen.queryByText(/할인$/)).not.toBeInTheDocument();
  });
});
