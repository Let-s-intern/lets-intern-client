import useMembershipOrderStore from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import { fireEvent, render, screen } from '@testing-library/react';
import MembershipPlanBottomSheet from './MembershipPlanBottomSheet';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/order', () => ({ generateOrderId: () => 'order-1' }));

let mockForm: Record<string, unknown> = {};
// 실제 모듈은 axios 를 거쳐 import.meta 를 읽어 jest 에서 못 불러온다
jest.mock('@/domain/all-in-one-pass/api/purchase', () => ({
  getPlanFinalAmount: (plan: { price: number; discount: number }) =>
    Math.max(plan.price - plan.discount, 0),
  useGetMembershipApplicationForm: () => ({ data: mockForm }),
}));

const VOD_PRODUCT = {
  id: 7,
  title: 'VOD 전체 이용권',
  price: 20000,
  additionalMonthPrice: 10000,
  durationDays: 30,
  maxPurchaseMonths: 3,
  availableMonths: 2,
};

const formWith = (vodPassProduct: unknown) => ({
  title: '올인원패스',
  email: 'a@b.com',
  name: '홍길동',
  phoneNumber: '010',
  planList: [
    { membershipPlanId: 11, title: '기본 플랜', price: 100000, discount: 0 },
  ],
  vodPassProduct,
});

const renderSheet = () =>
  render(
    <MembershipPlanBottomSheet membershipId={1} isOpen onClose={jest.fn()} />,
  );

describe('MembershipPlanBottomSheet', () => {
  beforeEach(() => {
    useMembershipOrderStore.getState().initOrder();
    mockPush.mockClear();
  });

  it('VOD 이용권을 고르면 합계에 더하고 주문 스토어에 담는다', () => {
    mockForm = formWith(VOD_PRODUCT);
    renderSheet();

    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByText('120,000원')).toBeTruthy();

    fireEvent.click(screen.getByText('신청하기'));
    expect(useMembershipOrderStore.getState().data).toMatchObject({
      membershipPlanId: 11,
      vodPassProductId: 7,
      vodPassPrice: 20000,
      vodPassMonths: 1,
      totalPrice: 120000,
      isFree: false,
    });
    expect(mockPush).toHaveBeenCalledWith('/all-in-one-pass/1/payment-input');
  });

  it.each([
    ['판매가 꺼진 패스', null],
    ['구매 가능 개월 수가 0', { ...VOD_PRODUCT, availableMonths: 0 }],
  ])('%s 이면 VOD 카드를 숨긴다', (_, product) => {
    mockForm = formWith(product);
    renderSheet();

    expect(screen.queryByText('VOD 이용권 추가 (선택)')).toBeNull();
    fireEvent.click(screen.getByText('신청하기'));
    expect(useMembershipOrderStore.getState().data).toMatchObject({
      vodPassProductId: null,
      totalPrice: 100000,
    });
  });
});
