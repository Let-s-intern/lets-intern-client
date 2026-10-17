import { render, screen } from '@testing-library/react';
import VodClassSection from './VodClassSection';

jest.mock('../ui/VodPassHoldingBanner', () => ({
  __esModule: true,
  default: () => <div>보유 배너</div>,
}));

jest.mock('../../ui/card/NewApplicationCard', () => ({
  __esModule: true,
  default: () => <div>VOD 클래스 카드</div>,
}));

describe('VodClassSection', () => {
  it('구매한 VOD 클래스가 없어도 이용권 배너는 목록 위에 보인다', () => {
    render(<VodClassSection applicationList={[]} />);

    expect(screen.getByText('보유 배너')).toBeInTheDocument();
    expect(
      screen.getByText('아직 구매한 VOD 클래스가 없어요'),
    ).toBeInTheDocument();
  });

  it('VOD 클래스가 있으면 배너 아래에 목록을 그린다', () => {
    render(
      <VodClassSection applicationList={[{ id: 1 } as unknown as never]} />,
    );

    const banner = screen.getByText('보유 배너');
    const card = screen.getByText('VOD 클래스 카드');
    expect(
      banner.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
