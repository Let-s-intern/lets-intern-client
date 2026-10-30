import type { MembershipVodPassProduct } from '@/domain/all-in-one-pass/api/purchase';
import type { VodPassOrderSelection } from '@/domain/all-in-one-pass/utils/vodPassOrder';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import VodPassOption, { VOD_PASS_UNAVAILABLE_MESSAGE } from './VodPassOption';

const PRODUCT: MembershipVodPassProduct = {
  id: 7,
  title: 'VOD 전체 이용권',
  price: 20000,
  additionalMonthPrice: 10000,
  durationDays: 30,
  maxPurchaseMonths: 3,
  availableMonths: 2,
};

// 실제 화면처럼 onChange 로 받은 선택을 다시 내려주는 부모
function Harness({
  product,
  onChange,
}: {
  product: MembershipVodPassProduct | null | undefined;
  onChange: (selection: VodPassOrderSelection) => void;
}) {
  const [months, setMonths] = useState<number | null>(null);
  return (
    <VodPassOption
      product={product}
      selectedMonths={months}
      onChange={(selection) => {
        setMonths(selection.vodPassMonths);
        onChange(selection);
      }}
    />
  );
}

const renderOption = (product: MembershipVodPassProduct | null | undefined) => {
  const onChange = jest.fn();
  render(<Harness product={product} onChange={onChange} />);
  return onChange;
};

describe('VodPassOption', () => {
  it.each([null, undefined])('상품이 %s 이면 그리지 않는다', (product) => {
    renderOption(product);
    expect(screen.queryByText('VOD 이용권 추가 (선택)')).toBeNull();
  });

  it('체크하면 1개월 선택을, 해제하면 빈 선택을 올린다', () => {
    const onChange = renderOption(PRODUCT);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith({
      vodPassProductId: 7,
      vodPassPrice: 20000,
      vodPassDurationDays: 30,
      vodPassMonths: 1,
    });

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith({
      vodPassProductId: null,
      vodPassPrice: null,
      vodPassDurationDays: null,
      vodPassMonths: null,
    });
    expect(screen.queryByText('이용 기간')).toBeNull();
  });

  it('개월 수는 구매 가능 개월 수를 넘지 않는다', () => {
    const onChange = renderOption(PRODUCT);
    fireEvent.click(screen.getByRole('checkbox'));

    const increase = screen.getByRole('button', {
      name: '이용 개월 수 늘리기',
    });
    fireEvent.click(increase);

    expect(onChange).toHaveBeenLastCalledWith({
      vodPassProductId: 7,
      vodPassPrice: 30000,
      vodPassDurationDays: 60,
      vodPassMonths: 2,
    });
    expect(screen.getByText('2개월')).toBeTruthy();
    expect(screen.getByText('최대 2개월까지 선택할 수 있어요')).toBeTruthy();
    expect(increase).toHaveProperty('disabled', true);
    expect(
      screen.getByRole('button', { name: '이용 개월 수 줄이기' }),
    ).toHaveProperty('disabled', false);
  });

  it('추가 월 가격이 없는 상품은 개월 선택 없이 1개월이다', () => {
    const onChange = renderOption({
      ...PRODUCT,
      additionalMonthPrice: null,
    });
    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ vodPassMonths: 1, vodPassPrice: 20000 }),
    );
    expect(screen.queryByText('이용 기간')).toBeNull();
  });

  it('availableMonths 가 0 이면 고를 수 없고 사유를 보여준다', () => {
    const onChange = renderOption({ ...PRODUCT, availableMonths: 0 });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveProperty('disabled', true);
    expect(screen.getByText(VOD_PASS_UNAVAILABLE_MESSAGE)).toBeTruthy();

    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });
});
