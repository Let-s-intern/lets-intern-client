import { render, screen } from '@testing-library/react';
import { ALL_IN_ONE_ITEMS } from '../data/compare';
import AllInOneCard from './AllInOneCard';

const mockData = jest.fn();
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => mockData(),
}));

describe('AllInOneCard', () => {
  beforeEach(() => {
    mockData.mockReturnValue({ salePrice: 169900 });
  });

  it('올인원 혜택 5줄을 모두 그린다', () => {
    render(<AllInOneCard />);
    for (const item of ALL_IN_ONE_ITEMS) {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    }
  });

  it('가격은 연동 챌린지의 특가다 (하드코딩 아님)', () => {
    // 시안 값(169,900)과 다른 값을 내려 하드코딩이 남아 있으면 실패하게 한다.
    mockData.mockReturnValue({ salePrice: 149000 });
    render(<AllInOneCard />);
    expect(screen.getByText('149,000원')).toBeInTheDocument();
    expect(
      screen.getByText('하반기 공채 준비 올인원 패스'),
    ).toBeInTheDocument();
  });

  it('첫 줄만 강조 플래그가 붙는다', () => {
    const { container } = render(<AllInOneCard />);
    const emphasized = container.querySelectorAll(
      '.cmp-row[data-emphasized="true"]',
    );
    expect(emphasized).toHaveLength(1);
    expect(emphasized[0]).toHaveTextContent('챌린지 10종');
  });
});
