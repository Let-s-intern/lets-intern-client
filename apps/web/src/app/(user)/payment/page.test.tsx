/*
  결제 화면 (LC-3438): Toss 위젯에 넘기는 금액과 주문명.
  금액은 스토어 totalPrice(이용권 합산)를 그대로 쓰고, 이용권을 담았을 때만 주문명에
  ` + VOD 이용권` 이 붙는다.
*/
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

const setAmountMock = jest.fn().mockResolvedValue(undefined);
const requestPaymentMock = jest.fn().mockResolvedValue(undefined);
const widgetsMock = {
  setAmount: setAmountMock,
  renderPaymentMethods: jest.fn().mockResolvedValue({
    getSelectedPaymentMethod: async () => ({ code: 'CARD' }),
  }),
  renderAgreement: jest.fn().mockResolvedValue(undefined),
  requestPayment: requestPaymentMock,
};

jest.mock('@tosspayments/tosspayments-sdk', () => ({
  loadTossPayments: async () => ({ widgets: () => widgetsMock }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/api/program', () => ({
  useProgramQuery: () => ({ query: { data: { title: 'QA 챌린지' } } }),
}));

jest.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: { id: 'user-1234567890abcdef' } }),
}));

jest.mock('@/common/boundary/AsyncBoundary', () => ({
  AsyncBoundary: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import {
  initProgramApplicationForm,
  setProgramApplicationForm,
} from '@/store/useProgramStore';
import PaymentPage from './page';

const FORM = {
  priceId: 2,
  price: 100000,
  discount: 10000,
  couponId: '',
  couponPrice: 0,
  contactEmail: 'qa@letscareer.test',
  question: '',
  email: 'qa@letscareer.test',
  phone: '010-0000-0000',
  name: 'QA',
  programTitle: 'QA 챌린지',
  programType: 'challenge' as const,
  progressType: 'none',
  programId: 406,
  programOrderId: 'letsAB12',
  isFree: false,
  deposit: 0,
};

beforeEach(() => {
  setAmountMock.mockClear();
  requestPaymentMock.mockClear();
  initProgramApplicationForm();
});

async function payAndGetRequest() {
  render(<PaymentPage />);
  const button = await screen.findByRole('button', { name: /결제하기/ });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  await waitFor(() => expect(requestPaymentMock).toHaveBeenCalledTimes(1));
  return requestPaymentMock.mock.calls[0][0];
}

describe('payment 결제 화면', () => {
  it('이용권을 담으면 합산 금액으로 위젯 금액을 정하고 주문명에 + VOD 이용권 을 붙인다', async () => {
    setProgramApplicationForm({
      ...FORM,
      totalPrice: 119000,
      vodPassProductId: 7,
      vodPassPrice: 29000,
      vodPassDurationDays: 30,
    });

    const request = await payAndGetRequest();

    expect(setAmountMock).toHaveBeenCalledWith({
      currency: 'KRW',
      value: 119000,
    });
    expect(request.orderName).toBe('QA 챌린지 + VOD 이용권');
    expect(request.orderId).toBe('letsAB12');
    expect(
      screen.getByRole('button', { name: '결제하기 119,000원' }),
    ).toBeInTheDocument();
  });

  it('이용권이 없으면 주문명과 금액이 기존과 같다', async () => {
    setProgramApplicationForm({ ...FORM, totalPrice: 90000 });

    const request = await payAndGetRequest();

    expect(setAmountMock).toHaveBeenCalledWith({
      currency: 'KRW',
      value: 90000,
    });
    expect(request.orderName).toBe('QA 챌린지');
  });
});
