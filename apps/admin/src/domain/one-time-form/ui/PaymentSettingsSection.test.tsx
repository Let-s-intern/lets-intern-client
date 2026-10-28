import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import PaymentSettingsSection, {
  ZERO_PRICE_NOTICE,
} from './PaymentSettingsSection';

const renderSection = (isPaid: boolean, basePrice: number) => {
  const setField = vi.fn();
  render(
    <PaymentSettingsSection
      values={{ isPaid, basePrice, paymentProductName: '' }}
      errors={{}}
      setField={setField}
    />,
  );
  return setField;
};

describe('PaymentSettingsSection', () => {
  it('유료인데 기본 금액이 0원이면 금액 칸 아래에 테스트용 안내를 띄운다', () => {
    renderSection(true, 0);
    expect(screen.getByText(ZERO_PRICE_NOTICE)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '기본 금액' })).toHaveValue('0');
  });

  it('무료이거나 금액이 있으면 안내가 없다', () => {
    renderSection(false, 0);
    expect(screen.queryByText(ZERO_PRICE_NOTICE)).not.toBeInTheDocument();
  });

  it('금액은 천 단위 쉼표로 보이고 빼기 기호는 들어가지 않는다', async () => {
    const setField = renderSection(true, 29000);
    const input = screen.getByRole('textbox', { name: '기본 금액' });
    expect(input).toHaveValue('29,000');
    expect(screen.queryByText(ZERO_PRICE_NOTICE)).not.toBeInTheDocument();

    await userEvent.type(input, '-');
    expect(setField).toHaveBeenLastCalledWith('basePrice', 29000);
  });

  it('결제 받기를 끄면 isPaid 를 false 로 바꾼다', async () => {
    const setField = renderSection(true, 29000);
    expect(screen.getByText('유료')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: '결제 받기' }));
    expect(setField).toHaveBeenCalledWith('isPaid', false);
  });
});
