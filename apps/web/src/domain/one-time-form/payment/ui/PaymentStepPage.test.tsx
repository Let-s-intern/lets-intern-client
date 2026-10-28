import {
  useCreateOneTimeFormApplicationMutation,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import type { OneTimeForm } from '@/api/one-time-form/oneTimeFormSchema';
import { ApiError } from '@letscareer/api/errors';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { paidFormFixture } from '../../__fixtures__/oneTimeFormFixtures';
import {
  draftStorageKey,
  readDraft,
  saveDraft,
  type OneTimeFormDraft,
} from '../../utils/applicationDraft';
import { saveUtmOnce, utmStorageKey } from '../../utils/utmStorage';
import PaymentStepPage from './PaymentStepPage';

const push = jest.fn();
const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

jest.mock('@/api/one-time-form/oneTimeForm', () => ({
  ONE_TIME_FORM_NOT_FOUND: 'ONE_TIME_FORM_NOT_FOUND',
  ONE_TIME_FORM_ALREADY_APPLIED: 'ONE_TIME_FORM_ALREADY_APPLIED',
  getOneTimeFormErrorCode: (error: { code?: string } | null) => error?.code,
  useOneTimeFormQuery: jest.fn(),
  useCreateOneTimeFormApplicationMutation: jest.fn(),
}));

jest.mock('@/api/user/user', () => ({
  useUserQuery: () => ({
    data: { id: 'user-customer-key-0001', name: '김렛커' },
  }),
}));

// 실제 모듈은 신청 API 를 거쳐 jest 가 변환하지 못하는 nanoid 까지 불러온다
let orderSeq = 0;
jest.mock('@/lib/order', () => ({
  generateOrderId: () => `letsOrder${++orderSeq}`,
}));

jest.mock('@tosspayments/tosspayments-sdk', () => ({
  __esModule: true,
  loadTossPayments: jest.fn(),
}));

const widgets = {
  setAmount: jest.fn(),
  renderPaymentMethods: jest.fn(),
  requestPayment: jest.fn(),
};
const loadTossPaymentsMock = loadTossPayments as jest.Mock;
const mutate = jest.fn();

// 계약 13.3 폼 9(0원 결제 테스트 폼)
const zeroFormFixture: OneTimeForm = {
  form: {
    formId: 9,
    slug: 'zero-test',
    title: '0원 결제 테스트 폼',
    categoryText: '테스트',
    scheduleText: '내부 QA용',
    thumbnailUrl: null,
    isPaid: true,
    basePrice: 0,
    paymentProductName: null,
    startDate: '2026-10-01T00:00:00',
    endDate: '2026-12-31T23:59:59',
    cancelDeadline: '2026-12-31T23:59:59',
    applyStatus: 'OPEN',
    completionMessage: null,
  },
  optionGroups: [
    {
      optionGroupId: 91,
      title: '참여 방식',
      description: null,
      selectType: 'SINGLE',
      isRequired: true,
      sortOrder: 0,
      options: [
        {
          optionId: 911,
          name: '온라인',
          description: null,
          additionalPrice: 0,
          badge: null,
          sortOrder: 0,
        },
      ],
    },
  ],
  questions: [],
};

const PAID_DRAFT: OneTimeFormDraft = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptionIds: [311, 321],
  answers: { '101': '프론트엔드' },
  orderId: null,
  amount: 49000,
};

const ZERO_DRAFT: OneTimeFormDraft = {
  ...PAID_DRAFT,
  selectedOptionIds: [911],
  answers: {},
  amount: 0,
};

const mockForm = (data: OneTimeForm | undefined, extra = {}) =>
  (useOneTimeFormQuery as jest.Mock).mockReturnValue({
    data,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    ...extra,
  });

const agreeAll = () =>
  fireEvent.click(screen.getByRole('checkbox', { name: '모두 동의합니다' }));

beforeEach(() => {
  window.sessionStorage.clear();
  push.mockClear();
  replace.mockClear();
  mutate.mockReset();
  orderSeq = 0;
  (useCreateOneTimeFormApplicationMutation as jest.Mock).mockReturnValue({
    mutate,
    isPending: false,
  });
  widgets.setAmount.mockReset().mockResolvedValue(undefined);
  widgets.renderPaymentMethods.mockReset().mockResolvedValue(undefined);
  widgets.requestPayment.mockReset().mockResolvedValue(undefined);
  loadTossPaymentsMock.mockReset().mockResolvedValue({
    widgets: () => widgets,
  });
});

describe('PaymentStepPage 유료 결제', () => {
  beforeEach(() => {
    mockForm(paidFormFixture);
    saveDraft('portfolio-1115', PAID_DRAFT);
  });

  it('신청자 정보와 금액 줄, 최종 금액을 그리고 위젯에 합계를 넣는다', async () => {
    render(<PaymentStepPage slug="portfolio-1115" tossFailureMessage={null} />);

    expect(await screen.findByText('결제하기')).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
    expect(screen.getByText('letscareer@example.com')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 집중 클래스')).toBeInTheDocument();
    expect(screen.getByText('온라인 라이브')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 1:1 첨삭')).toBeInTheDocument();
    expect(screen.getByText('49,000원')).toBeInTheDocument();

    await waitFor(() =>
      expect(widgets.renderPaymentMethods).toHaveBeenCalled(),
    );
    expect(widgets.setAmount).toHaveBeenCalledWith({
      currency: 'KRW',
      value: 49000,
    });
  });

  it('동의 3종을 모두 체크해야 결제 버튼이 열린다', async () => {
    render(<PaymentStepPage slug="portfolio-1115" tossFailureMessage={null} />);
    await waitFor(() =>
      expect(widgets.renderPaymentMethods).toHaveBeenCalled(),
    );

    const pay = screen.getByRole('button', { name: '49,000원 결제하기' });
    expect(pay).toBeDisabled();

    fireEvent.click(
      screen.getByRole('checkbox', { name: /개인정보 수집 및 이용 동의/ }),
    );
    fireEvent.click(screen.getByRole('checkbox', { name: /환불 규정 확인/ }));
    expect(pay).toBeDisabled();
    expect(
      screen.getByRole('checkbox', { name: '모두 동의합니다' }),
    ).not.toBeChecked();

    fireEvent.click(
      screen.getByRole('checkbox', { name: /결제 대행 서비스 이용 동의/ }),
    );
    expect(pay).toBeEnabled();
    expect(
      screen.getByRole('checkbox', { name: '모두 동의합니다' }),
    ).toBeChecked();

    agreeAll();
    expect(pay).toBeDisabled();
  });

  it('결제할 때마다 새 주문번호를 보관하고 계약 11.3 값으로 토스를 부른다', async () => {
    render(<PaymentStepPage slug="portfolio-1115" tossFailureMessage={null} />);
    await waitFor(() =>
      expect(widgets.renderPaymentMethods).toHaveBeenCalled(),
    );
    agreeAll();
    const pay = screen.getByRole('button', { name: '49,000원 결제하기' });

    fireEvent.click(pay);
    await waitFor(() => expect(widgets.requestPayment).toHaveBeenCalled());
    expect(widgets.requestPayment).toHaveBeenCalledWith({
      orderId: 'letsOrder1',
      orderName: '포트폴리오 집중 클래스',
      successUrl: 'http://localhost/form/portfolio-1115/payment/result',
      failUrl: 'http://localhost/form/portfolio-1115/payment',
      customerName: '김렛커',
      customerEmail: 'letscareer@example.com',
      customerMobilePhone: '01012345678',
    });
    expect(readDraft('portfolio-1115')).toEqual({
      ...PAID_DRAFT,
      orderId: 'letsOrder1',
      amount: 49000,
    });
    expect(mutate).not.toHaveBeenCalled();
  });

  it('토스 실패로 돌아오면 안내를 보여 주고 다시 결제할 수 있다', async () => {
    render(
      <PaymentStepPage
        slug="portfolio-1115"
        tossFailureMessage="사용자에 의해 결제가 취소되었습니다."
      />,
    );

    expect(
      await screen.findByText('결제가 완료되지 않았어요'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('사용자에 의해 결제가 취소되었습니다.'),
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(widgets.renderPaymentMethods).toHaveBeenCalled(),
    );
    agreeAll();
    fireEvent.click(screen.getByRole('button', { name: '49,000원 결제하기' }));
    await waitFor(() => expect(widgets.requestPayment).toHaveBeenCalled());
  });

  it('"수정"과 이전은 정보 입력으로 돌아가고 보관값은 남긴다', async () => {
    render(<PaymentStepPage slug="portfolio-1115" tossFailureMessage={null} />);

    fireEvent.click(await screen.findByRole('button', { name: '수정' }));
    expect(push).toHaveBeenCalledWith('/form/portfolio-1115');
    fireEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(push).toHaveBeenCalledTimes(2);
    expect(readDraft('portfolio-1115')).toEqual(PAID_DRAFT);
  });
});

describe('PaymentStepPage 0원', () => {
  beforeEach(() => {
    mockForm(zeroFormFixture);
    saveDraft('zero-test', ZERO_DRAFT);
  });

  it('위젯 대신 0원 안내를 보여 주고 토스를 부르지 않는다', async () => {
    render(<PaymentStepPage slug="zero-test" tossFailureMessage={null} />);

    expect(
      await screen.findByText(/결제할 금액이 0원이라/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '0원 신청하기' }),
    ).toBeInTheDocument();
    expect(loadTossPaymentsMock).not.toHaveBeenCalled();
  });

  it('"0원 신청하기"는 동의 뒤 U3 를 paymentKey null, amount 0 으로 바로 부르고 성공하면 보관값을 지우고 완료로 간다', async () => {
    saveUtmOnce('zero-test', {
      utmSource: 'instagram',
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      referrer: null,
    });
    mutate.mockImplementation((_body, { onSuccess }) => onSuccess());
    render(<PaymentStepPage slug="zero-test" tossFailureMessage={null} />);

    const apply = await screen.findByRole('button', { name: '0원 신청하기' });
    expect(apply).toBeDisabled();
    agreeAll();
    fireEvent.click(apply);

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toEqual({
      name: '김렛커',
      email: 'letscareer@example.com',
      phoneNum: '010-1234-5678',
      selectedOptionIds: [911],
      answers: {},
      utmSource: 'instagram',
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      referrer: null,
      payment: { paymentKey: null, orderId: 'letsOrder1', amount: 0 },
    });
    expect(loadTossPaymentsMock).not.toHaveBeenCalled();
    expect(widgets.requestPayment).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(draftStorageKey('zero-test'))).toBe(
      null,
    );
    expect(window.sessionStorage.getItem(utmStorageKey('zero-test'))).toBe(
      null,
    );
    expect(replace).toHaveBeenCalledWith('/form/zero-test/complete');
  });

  it('이미 신청했다는 응답이면 완료로 간다', async () => {
    mutate.mockImplementation((_body, { onError }) =>
      onError({ code: 'ONE_TIME_FORM_ALREADY_APPLIED' }),
    );
    render(<PaymentStepPage slug="zero-test" tossFailureMessage={null} />);

    agreeAll();
    fireEvent.click(
      await screen.findByRole('button', { name: '0원 신청하기' }),
    );

    expect(replace).toHaveBeenCalledWith('/form/zero-test/complete');
  });

  it('그 밖의 오류는 서버 문구를 보여 주고 머문다', async () => {
    mutate.mockImplementation((_body, { onError }) =>
      onError(
        new ApiError({
          code: 'ONE_TIME_FORM_PRICE_MISMATCH',
          message: 'Request failed',
          status: 400,
          endpoint: '/one-time-form/zero-test/applications',
          method: 'POST',
          serverMessage: '결제 금액이 폼 설정과 다릅니다.',
        }),
      ),
    );
    render(<PaymentStepPage slug="zero-test" tossFailureMessage={null} />);

    agreeAll();
    fireEvent.click(
      await screen.findByRole('button', { name: '0원 신청하기' }),
    );

    expect(
      screen.getByText('결제 금액이 폼 설정과 다릅니다.'),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
    expect(readDraft('zero-test')).not.toBeNull();
  });
});

describe('PaymentStepPage 보관값 없음', () => {
  it('정보 입력으로 돌려보낸다', async () => {
    mockForm(paidFormFixture);
    render(<PaymentStepPage slug="portfolio-1115" tossFailureMessage={null} />);

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/form/portfolio-1115'),
    );
    expect(loadTossPaymentsMock).not.toHaveBeenCalled();
  });
});
