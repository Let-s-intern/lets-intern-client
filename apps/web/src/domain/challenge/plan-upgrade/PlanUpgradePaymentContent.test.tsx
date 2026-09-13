import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

import useAuthStore from '@/store/useAuthStore';

import { usePlanUpgradeQuery } from './api/planUpgrade';
import PlanUpgradePaymentContent from './PlanUpgradePaymentContent';

const replace = jest.fn();
let search = '';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace }),
  useSearchParams: () => new URLSearchParams(search),
}));

jest.mock('@tosspayments/tosspayments-sdk', () => ({
  __esModule: true,
  loadTossPayments: jest.fn(),
}));

jest.mock('@/api/user/user', () => ({
  __esModule: true,
  useUserQuery: () => ({
    data: {
      id: 'user-customer-key-0001',
      name: '홍길동',
      email: 'user@example.com',
      phoneNum: '010-1234-5678',
    },
  }),
}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./api/planUpgrade', () => ({
  usePlanUpgradeQuery: jest.fn(),
}));

const loadTossPaymentsMock = loadTossPayments as jest.Mock;
const usePlanUpgradeQueryMock = usePlanUpgradeQuery as jest.Mock;
const useAuthStoreMock = useAuthStore as unknown as jest.Mock;

const widgets = {
  setAmount: jest.fn(),
  renderPaymentMethods: jest.fn(),
  renderAgreement: jest.fn(),
  requestPayment: jest.fn(),
};

const upgradable = {
  applicationId: 7,
  programId: 3,
  challengeTitle: '경험정리 챌린지 20기',
  currentPlan: {
    planType: 'BASIC',
    description: '미션 자료 제공',
    salePrice: 84000,
    paidAmount: 74000,
  },
  deadline: '2026-10-01T23:59:59',
  unavailableReason: null,
  options: [
    {
      planType: 'STANDARD',
      title: '스탠다드',
      description: '서면 피드백 포함',
      salePrice: 169000,
      additionalAmount: 85000,
      feedbackMissions: [],
    },
  ],
};

const renderPage = (query: string) => {
  search = query;
  return render(<PlanUpgradePaymentContent applicationId="7" />);
};

/** 위젯 렌더가 끝나야 결제 버튼이 풀린다 */
const findEnabledPayButton = async () => {
  const button = await screen.findByRole('button', {
    name: '85,000원 결제하기',
  });
  await waitFor(() => expect(button).toBeEnabled());
  return button;
};

beforeEach(() => {
  replace.mockClear();
  useAuthStoreMock.mockReturnValue({ isLoggedIn: true, isInitialized: true });
  usePlanUpgradeQueryMock.mockReturnValue({
    data: upgradable,
    isError: false,
  });
  widgets.setAmount.mockReset().mockResolvedValue(undefined);
  widgets.renderPaymentMethods.mockReset().mockResolvedValue({});
  widgets.renderAgreement.mockReset().mockResolvedValue(undefined);
  widgets.requestPayment.mockReset().mockResolvedValue(undefined);
  loadTossPaymentsMock.mockReset().mockResolvedValue({
    widgets: () => widgets,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('PlanUpgradePaymentContent', () => {
  it('쿼리 금액이 아니라 조회 API 의 추가 결제 금액으로 위젯을 띄운다', async () => {
    renderPage('plan=STANDARD&amount=1');

    await waitFor(() =>
      expect(widgets.setAmount).toHaveBeenCalledWith({
        currency: 'KRW',
        value: 85000,
      }),
    );
    await findEnabledPayButton();
    expect(screen.getByText('BASIC → STANDARD')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it.each(['PREMIUM', 'LIGHT', ''])(
    '선택지에 없는 plan 쿼리(%s)면 업그레이드 화면으로 되돌린다',
    async (plan) => {
      renderPage(`plan=${plan}`);

      await waitFor(() =>
        expect(replace).toHaveBeenCalledWith('/plan-upgrade/7'),
      );
      expect(loadTossPaymentsMock).not.toHaveBeenCalled();
    },
  );

  it('불가 사유가 있으면 업그레이드 화면으로 되돌린다', async () => {
    usePlanUpgradeQueryMock.mockReturnValue({
      data: { ...upgradable, unavailableReason: 'DEADLINE_PASSED' },
      isError: false,
    });

    renderPage('plan=STANDARD');

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/plan-upgrade/7'),
    );
    expect(loadTossPaymentsMock).not.toHaveBeenCalled();
  });

  it('비로그인이면 지금 주소로 돌아오게 로그인으로 보낸다', async () => {
    useAuthStoreMock.mockReturnValue({
      isLoggedIn: false,
      isInitialized: true,
    });
    window.history.pushState({}, '', '/plan-upgrade/7/payment?plan=STANDARD');

    renderPage('plan=STANDARD');

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        `/login?redirect=${encodeURIComponent('/plan-upgrade/7/payment?plan=STANDARD')}`,
      ),
    );
    window.history.pushState({}, '', '/');
  });

  it('결제 요청에 주문 번호 형식과 성공·실패 주소를 싣는다', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1760000000000);
    renderPage('plan=STANDARD');

    fireEvent.click(await findEnabledPayButton());

    await waitFor(() => expect(widgets.requestPayment).toHaveBeenCalled());
    const [request] = widgets.requestPayment.mock.calls[0];
    expect(request).toMatchObject({
      orderId: 'plan-upgrade-7-1760000000000',
      orderName: '경험정리 챌린지 20기 STANDARD 플랜 업그레이드',
      successUrl: `${window.location.origin}/plan-upgrade/7/result?plan=STANDARD`,
      failUrl: `${window.location.origin}/plan-upgrade/7/fail?plan=STANDARD`,
      customerMobilePhone: '01012345678',
    });
    expect(request.orderId).toMatch(/^[A-Za-z0-9_-]{6,64}$/);
  });

  it('주문명은 100자에서 자른다', async () => {
    usePlanUpgradeQueryMock.mockReturnValue({
      data: { ...upgradable, challengeTitle: '가'.repeat(120) },
      isError: false,
    });
    renderPage('plan=STANDARD');

    fireEvent.click(await findEnabledPayButton());

    await waitFor(() => expect(widgets.requestPayment).toHaveBeenCalled());
    expect(widgets.requestPayment.mock.calls[0][0].orderName).toHaveLength(100);
  });

  it('위젯을 불러오지 못하면 오류 문구를 보이고 버튼을 막는다', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    loadTossPaymentsMock.mockRejectedValue(new Error('load failed'));

    renderPage('plan=STANDARD');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    );
    expect(
      screen.getByRole('button', { name: '85,000원 결제하기' }),
    ).toBeDisabled();
  });

  it('결제 요청이 실패하면 오류 문구를 보이고 다시 누를 수 있다', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    widgets.requestPayment.mockRejectedValue(new Error('request failed'));

    renderPage('plan=STANDARD');
    const button = await findEnabledPayButton();
    fireEvent.click(button);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    );
    expect(button).toBeEnabled();
  });
});
