import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuidebookCouponSection from './GuidebookCouponSection';

let mockCoupons: unknown[] = [];
let mockRegisterError: string | null = null;
let mockApplyResult = { id: 3, price: 300 };
const mockRegister = jest.fn();
const mockApplyCode = jest.fn();

jest.mock('@/api/coupon/coupon', () => ({
  useMyCoupons: () => ({ data: mockCoupons }),
  useRegisterCoupon: () => ({
    register: mockRegister,
    isPending: false,
    errorMessage: mockRegisterError,
    clearError: jest.fn(),
  }),
}));
jest.mock('@/domain/program/program-detail/apply/hooks/useApplyCoupon', () => ({
  useApplyCoupon: (params: {
    setCoupon: (c: { id: number | null; price: number }) => void;
  }) => ({
    applyCoupon: (code: string) => {
      mockApplyCode(code);
      params.setCoupon(mockApplyResult);
    },
    applyError: null,
  }),
}));

const coupon = (overrides: Record<string, unknown>) => ({
  couponId: 3,
  couponType: 'EVENT',
  couponProgramTypeList: ['GUIDEBOOK'],
  name: '가이드북 300원 할인',
  code: 'GB300',
  discount: 300,
  discountType: 'AMOUNT',
  ...overrides,
});

const renderSection = (selectedCouponId: number | null = null) => {
  const onChange = jest.fn();
  render(
    <GuidebookCouponSection
      amount={990}
      selectedCouponId={selectedCouponId}
      onChange={onChange}
    />,
  );
  return onChange;
};

describe('GuidebookCouponSection', () => {
  beforeEach(() => {
    mockCoupons = [];
    mockRegisterError = null;
    mockApplyResult = { id: 3, price: 300 };
    mockRegister.mockClear();
    mockApplyCode.mockClear();
  });

  it('쿠폰이 없으면 등록 안내를 보인다', async () => {
    renderSection();

    await userEvent.click(screen.getByRole('button', { name: '쿠폰 사용' }));

    expect(screen.getByText(/적용 가능한 쿠폰이 없습니다/)).toBeInTheDocument();
  });

  it('보유 쿠폰 목록을 펼치면 보인다', async () => {
    mockCoupons = [
      coupon({}),
      coupon({
        couponId: 4,
        name: '10% 쿠폰',
        code: 'R10',
        discount: 10,
        discountType: 'RATE',
      }),
    ];
    renderSection();

    expect(screen.queryByText('가이드북 300원 할인')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: '쿠폰 사용' }));

    expect(screen.getByText('가이드북 300원 할인')).toBeInTheDocument();
    expect(screen.getByText('300원 할인')).toBeInTheDocument();
    expect(screen.getByText('10% 할인')).toBeInTheDocument();
  });

  it('쿠폰을 고르면 조회한 id 와 할인액을 위로 올린다', async () => {
    mockCoupons = [coupon({})];
    const onChange = renderSection();

    await userEvent.click(screen.getByRole('button', { name: '쿠폰 사용' }));
    await userEvent.click(
      screen.getByRole('button', { name: /가이드북 300원 할인/ }),
    );

    expect(mockApplyCode).toHaveBeenCalledWith('GB300');
    expect(onChange).toHaveBeenCalledWith({ id: 3, price: 300 });
  });

  it('선택한 쿠폰을 다시 누르거나 해제하면 id null, 할인 0 을 올린다', async () => {
    mockCoupons = [coupon({})];
    const onChange = renderSection(3);

    await userEvent.click(screen.getByRole('button', { name: '쿠폰 해제' }));
    expect(onChange).toHaveBeenLastCalledWith({ id: null, price: 0 });

    await userEvent.click(screen.getByRole('button', { name: '쿠폰 사용' }));
    await userEvent.click(
      screen.getByRole('button', { name: /가이드북 300원 할인/ }),
    );
    expect(onChange).toHaveBeenLastCalledWith({ id: null, price: 0 });
    expect(mockApplyCode).not.toHaveBeenCalled();
  });

  it('코드를 등록하고 등록 오류 문구를 보인다', async () => {
    mockRegisterError = '존재하지 않는 쿠폰 코드입니다.';
    renderSection();

    await userEvent.click(screen.getByRole('button', { name: '쿠폰 사용' }));
    await userEvent.type(
      screen.getByPlaceholderText('쿠폰 코드를 입력해주세요.'),
      'BAD',
    );
    await userEvent.click(screen.getByRole('button', { name: '등록하기' }));

    expect(mockRegister).toHaveBeenCalledWith('BAD');
    expect(
      screen.getByText('존재하지 않는 쿠폰 코드입니다.'),
    ).toBeInTheDocument();
  });
});
