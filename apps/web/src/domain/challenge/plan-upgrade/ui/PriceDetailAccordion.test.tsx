import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriceDetailAccordion from './PriceDetailAccordion';

const renderAccordion = () =>
  render(
    <PriceDetailAccordion
      currentPlanType="BASIC"
      currentSalePrice={84000}
      targetPlanType="STANDARD"
      targetSalePrice={168000}
      additionalAmount={84000}
    />,
  );

describe('PriceDetailAccordion', () => {
  it('접힌 상태로 시작한다', () => {
    renderAccordion();

    expect(
      screen.getByRole('button', { name: '결제 금액 상세 보기' }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('STANDARD 플랜 금액')).not.toBeInTheDocument();
  });

  it('펼치면 판매가 차액 행과 안내 세 줄을 보여주고 다시 접힌다', async () => {
    const user = userEvent.setup();
    renderAccordion();
    const toggle = screen.getByRole('button', { name: '결제 금액 상세 보기' });

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText('STANDARD 플랜 금액').nextSibling,
    ).toHaveTextContent('168,000원');
    expect(
      screen.getByText('현재 BASIC 플랜 금액').nextSibling,
    ).toHaveTextContent('-84,000원');
    expect(screen.getByText('추가 결제 금액').nextSibling).toHaveTextContent(
      '84,000원',
    );
    expect(
      screen.getByText('처음 결제할 때 받은 할인은 그대로 유지돼요.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('추가 결제에는 쿠폰을 사용할 수 없어요.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '환불할 때는 처음 결제 금액과 추가 결제 금액을 합쳐 환불 규정에 따라 계산돼요.',
      ),
    ).toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('STANDARD 플랜 금액')).not.toBeInTheDocument();
  });
});
