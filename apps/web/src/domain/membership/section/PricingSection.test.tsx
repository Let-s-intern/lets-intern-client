import { fireEvent, render, screen } from '@testing-library/react';

import {
  getIndividualTotal,
  INDIVIDUAL_ITEMS,
  PASS_INCLUDE_LINES,
  PRICING,
} from '../data/pricing';

// 챌린지 조회는 이 테스트의 대상이 아니다. 섹션이 훅이 내려준 패스 가격만 그리는지,
// 합계·SAVE 가 계산값인지(시안 숫자가 코드에 박혀 있지 않은지)만 본다.
const mockData = jest.fn();
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => mockData(),
}));

const openPlanSheet = jest.fn();
jest.mock('../lib/planSheet', () => ({
  openPlanSheet: () => openPlanSheet(),
}));

import PricingSection from './PricingSection';

describe('PricingSection (개편 시안 11)', () => {
  beforeEach(() => {
    mockData.mockReturnValue({ salePrice: 175900 });
    openPlanSheet.mockClear();
  });

  it('두 카드를 맞세워 그린다', () => {
    render(<PricingSection />);

    expect(screen.getByText(PRICING.optionLabel)).toBeInTheDocument();
    expect(screen.getByText(PRICING.optionTitle)).toBeInTheDocument();
    expect(screen.getByText(PRICING.passOptionLabel)).toBeInTheDocument();
    expect(screen.getByText(PRICING.passTitle)).toBeInTheDocument();
    expect(screen.getByText(PRICING.vsLabel)).toBeInTheDocument();

    for (const item of INDIVIDUAL_ITEMS) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
    for (const line of PASS_INCLUDE_LINES) {
      expect(screen.getByText(line.text)).toBeInTheDocument();
    }
  });

  it('합계 취소선이 6줄의 합이다', () => {
    render(<PricingSection />);

    expect(screen.getByText('392,000원')).toBeInTheDocument();
    expect(getIndividualTotal()).toBe(392000);
  });

  /*
   * SAVE 는 합계 − 패스가다. 패스가가 바뀌면 칩 금액도 따라 바뀌어야 한다 —
   * 시안의 216,100원이 박혀 있으면 이 두 번째 단언에서 걸린다.
   */
  it('SAVE 칩 금액이 합계 − 패스가와 같다', () => {
    const { rerender } = render(<PricingSection />);
    expect(
      screen.getByText(`${PRICING.saveLead} 216,100원 ${PRICING.saveTail}`),
    ).toBeInTheDocument();

    mockData.mockReturnValue({ salePrice: 100000 });
    rerender(<PricingSection />);
    expect(
      screen.getByText(`${PRICING.saveLead} 292,000원 ${PRICING.saveTail}`),
    ).toBeInTheDocument();
  });

  it('패스가가 합계보다 비싸면 SAVE 칩을 그리지 않는다', () => {
    mockData.mockReturnValue({ salePrice: getIndividualTotal() + 10000 });
    render(<PricingSection />);

    expect(screen.queryByText(/SAVE/)).not.toBeInTheDocument();
  });

  it('시작하기 버튼이 기존 결제 시트를 연다', () => {
    render(<PricingSection />);

    fireEvent.click(screen.getByRole('button', { name: PRICING.ctaLabel }));

    expect(openPlanSheet).toHaveBeenCalledTimes(1);
  });
});
