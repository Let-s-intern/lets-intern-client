import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PlanSelectSection from './PlanSelectSection';

const DURATION_PRICES = [
  { durationPriceId: 4, duration: 30, price: 35000 },
  { durationPriceId: 5, duration: 60, price: 60000 },
] as const;

function renderSection(
  selectedDuration: 30 | 60 | null,
  onSelect = jest.fn(),
  isLocked = false,
) {
  render(
    <PlanSelectSection
      productTitle="어드민 1대1 라이브 멘토링"
      durationPrices={[...DURATION_PRICES]}
      selectedDuration={selectedDuration}
      isLocked={isLocked}
      onSelect={onSelect}
    />,
  );
  return onSelect;
}

describe('PlanSelectSection', () => {
  it('열려 있는 진행시간만큼 플랜을 렌더한다', () => {
    renderSection(null);

    expect(screen.getByText('어드민 1대1 라이브 멘토링')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(30분\)/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('35,000원')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  it('선택된 플랜 하나만 체크된다', () => {
    renderSection(60);

    const [thirty, sixty] = screen.getAllByRole('radio');
    expect(thirty).not.toBeChecked();
    expect(sixty).toBeChecked();
  });

  it('다른 플랜을 누르면 그 플랜으로 onSelect 를 부른다', () => {
    const onSelect = renderSection(30);

    fireEvent.click(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    );

    expect(onSelect).toHaveBeenCalledWith(60);
  });

  /*
    플랜을 바꾸면 잡아 둔 슬롯이 버려진다. 잠그지 않으면 고른 시간이 소리 없이
    사라지고, 이유를 적지 않으면 잠긴 라디오가 고장으로 읽힌다.
  */
  it('시간을 고르기 전에는 플랜을 바꿀 수 있다', () => {
    renderSection(30);

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeEnabled();
    }
    expect(screen.queryByText(/플랜을 바꿀 수 없습니다/)).toBeNull();
  });

  it('시간을 고른 뒤에는 플랜이 잠기고 이유를 알린다', async () => {
    const onSelect = renderSection(30, jest.fn(), true);

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }
    expect(
      screen.getByText(/예약 시간을 선택한 뒤에는 플랜을 바꿀 수 없습니다/),
    ).toBeInTheDocument();

    /*
      fireEvent 는 disabled 를 무시하고 이벤트를 강제로 넣는다. 잠긴 컨트롤이
      정말 눌리지 않는지는 브라우저 동작을 따르는 userEvent 로 봐야 한다.
    */
    await userEvent.click(
      screen.getByRole('radio', { name: /\[LIVE\] 1:1 멘토링 \(60분\)/ }),
    );
    expect(onSelect).not.toHaveBeenCalled();
  });

  /*
    시안에는 정가 취소선(50,000원)·할인율 배지(30%)·"3개 남음" 이 있지만
    근거 데이터가 없다. productDiscount 는 0 고정이고 정원 개념은 서버에 없다.
    PRD 7-1·4-5 가 결정될 때까지 그리지 않는 것이 **의도한 상태**라 단언으로 못박는다.
  */
  it('근거 없는 정가·할인율·재고 문구를 그리지 않는다', () => {
    renderSection(null);

    expect(screen.queryByText(/50,000원/)).not.toBeInTheDocument();
    expect(screen.queryByText(/100,000원/)).not.toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/남음/)).not.toBeInTheDocument();
  });
});
