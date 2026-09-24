import { act, render, screen, waitFor } from '@testing-library/react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

import OrderPaymentPage from './OrderPaymentPage';
import {
  useOrderDraftStore,
  type CreatedLiveMentoringApplication,
} from './hooks/useOrderDraft';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace }),
}));

jest.mock('@tosspayments/tosspayments-sdk', () => ({
  __esModule: true,
  loadTossPayments: jest.fn(),
}));

jest.mock('@/api/user/user', () => ({
  __esModule: true,
  useUserQuery: () => ({ data: { id: 'user-customer-key-0001' } }),
}));

const loadTossPaymentsMock = loadTossPayments as jest.Mock;

const widgets = {
  setAmount: jest.fn(),
  renderPaymentMethods: jest.fn(),
  renderAgreement: jest.fn(),
  requestPayment: jest.fn(),
};

const APPLICATION: CreatedLiveMentoringApplication = {
  applicationId: 15,
  orderId: 'gKEMQwWav2Lh',
  finalAmount: 60000,
  orderName: '어드민 1:1 LIVE 멘토링',
  customerName: '로컬어드민',
  customerEmail: 'local-admin@letscareer.test',
  customerMobilePhone: '01000000000',
  expiresAt: '2026-08-21T16:23:16.283507',
  reservationLabel: '2026.09.19 (토) 12:00 ~ 13:00',
};

/* 선점 중인 시각. `APPLICATION.expiresAt`(KST)보다 5분 앞이다. */
const WHILE_HELD = new Date('2026-08-21T16:18:16+09:00').getTime();

/*
  새로고침한 결제 페이지를 흉내 낸다. 메모리는 비고 스토리지에만 신청이 남은 상태에서
  복원을 돌린다. `setState` 로 메모리를 비우면 persist 가 스토리지까지 덮어써 버린다.
*/
const reloadWithStorage = async (
  application: CreatedLiveMentoringApplication | null,
) => {
  localStorage.setItem(
    'liveMentoringOrderApplication',
    JSON.stringify({ state: { application }, version: 0 }),
  );
  await act(() => useOrderDraftStore.persist.rehydrate());
};

let nowSpy: jest.SpyInstance;

beforeEach(() => {
  replace.mockClear();
  nowSpy = jest.spyOn(Date, 'now').mockReturnValue(WHILE_HELD);
  widgets.setAmount.mockReset().mockResolvedValue(undefined);
  widgets.renderPaymentMethods.mockReset().mockResolvedValue({
    getSelectedPaymentMethod: jest.fn(),
  });
  widgets.renderAgreement.mockReset().mockResolvedValue(undefined);
  loadTossPaymentsMock.mockReset().mockResolvedValue({
    widgets: () => widgets,
  });
  useOrderDraftStore.getState().clearDraft();
  // 새 문서의 첫 렌더. 스토리지 복원이 아직 끝나지 않았다
  useOrderDraftStore.setState({ _hasHydrated: false });
});

afterEach(() => {
  nowSpy.mockRestore();
});

describe('OrderPaymentPage — 새로고침한 결제 페이지', () => {
  it('복원이 끝나기 전에는 상세로 되돌려보내지 않는다', () => {
    render(<OrderPaymentPage />);

    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByText('이동 중…')).toBeInTheDocument();
  });

  it('신청이 복원되면 되돌려보내지 않고 서버 금액으로 위젯을 띄운다', async () => {
    render(<OrderPaymentPage />);
    await reloadWithStorage(APPLICATION);

    await waitFor(() =>
      expect(widgets.setAmount).toHaveBeenCalledWith({
        currency: 'KRW',
        value: 60000,
      }),
    );
    expect(replace).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: '60,000원 결제하기' }),
    ).toBeInTheDocument();
  });

  it('복원할 신청이 없으면 목록으로 되돌려보낸다', async () => {
    render(<OrderPaymentPage />);
    await reloadWithStorage(null);

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/live-mentoring'),
    );
  });
});
