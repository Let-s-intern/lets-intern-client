import type { ChallengePricePlan } from '@/schema';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { PlanUpgradeOption } from '../api/planUpgradeSchema';
import PlanOptionRadioGroup from './PlanOptionRadioGroup';

const options: PlanUpgradeOption[] = [
  {
    planType: 'STANDARD',
    title: '스탠다드',
    description: '학습 콘텐츠, 미션 템플릿, 피드백 2회',
    salePrice: 168000,
    additionalAmount: 84000,
    feedbackMissions: [],
  },
  {
    planType: 'PREMIUM',
    title: '프리미엄',
    description: '학습 콘텐츠, 미션 템플릿, 피드백 4회',
    salePrice: 250000,
    additionalAmount: 166000,
    feedbackMissions: [],
  },
];

const SelectableGroup = () => {
  const [plan, setPlan] = useState<ChallengePricePlan>('STANDARD');
  return (
    <PlanOptionRadioGroup
      options={options}
      selectedPlan={plan}
      onChange={setPlan}
    />
  );
};

const cardOf = (radio: HTMLElement) => radio.closest('label') as HTMLElement;

describe('PlanOptionRadioGroup', () => {
  it('라벨로 이름 붙은 radiogroup 이다', () => {
    render(
      <PlanOptionRadioGroup
        options={options}
        selectedPlan="STANDARD"
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('radiogroup', { name: '업그레이드할 플랜' }),
    ).toBeInTheDocument();
  });

  it('추천 뱃지는 첫 선택지에만 있다', () => {
    render(
      <PlanOptionRadioGroup
        options={options}
        selectedPlan="PREMIUM"
        onChange={jest.fn()}
      />,
    );

    const [first, second] = screen.getAllByRole('radio');
    expect(within(cardOf(first)).getByText('추천')).toBeInTheDocument();
    expect(within(cardOf(second)).queryByText('추천')).not.toBeInTheDocument();
  });

  it('선택한 플랜만 aria-checked 이고 카드·금액이 강조된다', () => {
    render(
      <PlanOptionRadioGroup
        options={options}
        selectedPlan="PREMIUM"
        onChange={jest.fn()}
      />,
    );

    const standard = screen.getByRole('radio', { name: /STANDARD/ });
    const premium = screen.getByRole('radio', { name: /PREMIUM/ });

    expect(premium).toBeChecked();
    expect(premium).toHaveAttribute('aria-checked', 'true');
    expect(standard).toHaveAttribute('aria-checked', 'false');
    expect(cardOf(premium)).toHaveClass('bg-primary-5');
    expect(cardOf(standard)).not.toHaveClass('bg-primary-5');
    expect(within(cardOf(premium)).getByText('+166,000원')).toHaveClass(
      'text-primary',
    );
  });

  it('카드 안 설명을 눌러도 그 플랜을 고른다', async () => {
    const onChange = jest.fn();
    render(
      <PlanOptionRadioGroup
        options={options}
        selectedPlan="STANDARD"
        onChange={onChange}
      />,
    );

    await userEvent.click(
      screen.getByText('학습 콘텐츠, 미션 템플릿, 피드백 4회'),
    );

    expect(onChange).toHaveBeenCalledWith('PREMIUM');
  });

  it('화살표 키로 선택을 옮긴다', async () => {
    const user = userEvent.setup();
    render(<SelectableGroup />);

    const standard = screen.getByRole('radio', { name: /STANDARD/ });
    const premium = screen.getByRole('radio', { name: /PREMIUM/ });
    standard.focus();

    await user.keyboard('{ArrowDown}');
    expect(premium).toBeChecked();
    expect(premium).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(standard).toBeChecked();
  });
});
