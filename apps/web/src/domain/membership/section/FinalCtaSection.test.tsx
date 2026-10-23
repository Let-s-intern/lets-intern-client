import { fireEvent, render, screen } from '@testing-library/react';

import { FINAL_CTA } from '../data/finalCta';

const mockData = jest.fn();
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => mockData(),
}));

const openPlanSheet = jest.fn();
jest.mock('../lib/planSheet', () => ({
  openPlanSheet: () => openPlanSheet(),
}));

import FinalCtaSection from './FinalCtaSection';

describe('FinalCtaSection (개편 시안 12)', () => {
  beforeEach(() => {
    mockData.mockReturnValue({ salePrice: 175900 });
    openPlanSheet.mockClear();
  });

  /*
   * 칩 순서가 이 페이지를 위에서 아래로 읽은 순서와 같다. 개수만 세면 섞여도 통과하므로
   * 그려진 차례 그대로 비교한다.
   */
  it('흐름 칩이 6개이고 시안 순서를 지킨다', () => {
    render(<FinalCtaSection />);

    const chips = screen
      .getAllByRole('listitem')
      .map((item) =>
        item.textContent?.replace('→', '').replace('🎉', '').trim(),
      );

    expect(chips).toEqual([
      '무료 진단',
      '마케팅 올인원 패스',
      '패스 전용 10주 플레이북',
      '챌린지 · 세미나 · 멘토링',
      '실제 지원 · 면접',
      '마케터 취뽀',
    ]);
  });

  it('제목 2줄과 설명 3줄, 포함 항목 한 줄을 그린다', () => {
    render(<FinalCtaSection />);

    for (const line of FINAL_CTA.titleLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    for (const line of FINAL_CTA.descLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    expect(screen.getByText(FINAL_CTA.includes.strong)).toBeInTheDocument();
  });

  /* 가격은 어드민 값이다. 시안의 175,900원이 박혀 있으면 두 번째 단언에서 걸린다. */
  it('가격은 훅이 내려준 값을 그린다', () => {
    const { rerender } = render(<FinalCtaSection />);
    expect(screen.getByText('175,900원')).toBeInTheDocument();

    mockData.mockReturnValue({ salePrice: 149000 });
    rerender(<FinalCtaSection />);
    expect(screen.getByText('149,000원')).toBeInTheDocument();
  });

  it('시작하기 버튼이 기존 결제 시트를 연다', () => {
    render(<FinalCtaSection />);

    fireEvent.click(screen.getByRole('button', { name: FINAL_CTA.ctaLabel }));

    expect(openPlanSheet).toHaveBeenCalledTimes(1);
  });
});
