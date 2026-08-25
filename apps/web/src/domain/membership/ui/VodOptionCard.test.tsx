import { render, screen } from '@testing-library/react';
import { VOD_OPTION_PRICE } from '../data/plans';
import VodOptionCard from './VodOptionCard';

// 훅 자체(챌린지 조회·옵션 탐색)는 이 테스트의 대상이 아니다. 카드가 훅이 내려준 값을
// 그리는지, 훅이 폴백을 내려줬을 때도 화면이 비지 않는지만 본다.
const mockData = jest.fn();
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => mockData(),
}));

describe('VodOptionCard 가격 표시', () => {
  it('챌린지 VOD 옵션가가 있으면 그 값을 그린다 (하드코딩 아님)', () => {
    // 폴백(300,000 / 30,000)과 다른 값을 내려 하드코딩이 남아 있으면 실패하게 한다.
    mockData.mockReturnValue({ vodRegularPrice: 250000, vodSalePrice: 25000 });
    render(<VodOptionCard />);

    expect(screen.getByText('250,000원')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
    expect(screen.getByText('90% 할인')).toBeInTheDocument();
  });

  it('옵션을 못 찾아 폴백이 내려오면 시안 값을 그린다', () => {
    mockData.mockReturnValue({
      vodRegularPrice: VOD_OPTION_PRICE.original,
      vodSalePrice: VOD_OPTION_PRICE.sale,
    });
    render(<VodOptionCard />);

    expect(screen.getByText('300,000원')).toBeInTheDocument();
    expect(screen.getByText('30,000')).toBeInTheDocument();
    expect(screen.getByText('90% 할인')).toBeInTheDocument();
  });

  it('할인이 성립하지 않으면 할인율 배지를 그리지 않는다', () => {
    // 어드민이 할인 금액을 0 으로 두면 실제로 생기는 조합이다. "0% 할인" 이 남으면
    // 할인 상품처럼 보이는데 깎인 게 없어 더 나쁘다.
    mockData.mockReturnValue({ vodRegularPrice: 30000, vodSalePrice: 30000 });
    render(<VodOptionCard />);

    expect(screen.queryByText(/할인$/)).not.toBeInTheDocument();
  });

  it('구매자 전용 배지 문구는 유지한다', () => {
    mockData.mockReturnValue({ vodRegularPrice: 300000, vodSalePrice: 30000 });
    render(<VodOptionCard />);

    expect(
      screen.getByText('렛츠커리어 하반기 멤버십 구매자 전용'),
    ).toBeInTheDocument();
  });
});
