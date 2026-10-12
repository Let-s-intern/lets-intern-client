/*
  `@/utils/axios`, `@/utils/axiosV2`, `@letscareer/api` 는 jest 가 파싱하지 못하는
  모듈을 끌고 오므로 네트워크 계층을 목으로 막는다. 응답은 실제 zod 스키마를 거친다.
*/
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock('@letscareer/api', () => ({
  __esModule: true,
  fetchJson: jest.fn(),
}));
jest.mock('@/api/user/user', () => ({
  useUserQueryKey: 'userQueryKey',
}));

const mockPush = jest.fn();
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
jest.mock('next/navigation', () => ({
  useParams: () => ({ paymentId: '502' }),
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

import axios from '@/utils/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditDeletePage from './CreditDeletePage';

const mockGet = axios.get as jest.Mock;
const mockDelete = axios.delete as jest.Mock;

const passDetail = {
  programInfo: {
    id: 7,
    title: 'VOD 전체 이용권',
    thumbnail: null,
    programType: 'VOD_PASS',
    progressType: null,
    isCanceled: false,
    startDate: null,
    endDate: null,
    applicationId: 11,
  },
  priceInfo: { id: 7, price: 29000, discount: 0, refund: 0, option: 0 },
  paymentInfo: {
    id: 502,
    finalPrice: 29000,
    couponDiscount: null,
    isRefunded: false,
    createDate: '2026-10-12T10:00:00',
  },
  tossInfo: {
    status: 'DONE',
    paymentKey: 'pk-A',
    totalAmount: 89000,
    balanceAmount: 89000,
    method: '카드',
    requestedAt: '2026-10-12T10:00:00',
  },
  paymentItems: [
    {
      paymentId: 501,
      applicationId: 10,
      programType: 'CHALLENGE',
      paidAmount: 60000,
    },
    {
      paymentId: 502,
      applicationId: 11,
      programType: 'VOD_PASS',
      paidAmount: 29000,
    },
  ],
  orderTotalPaidAmount: 89000,
};

const pass = {
  applicationId: 11,
  paymentId: 502,
  startsAt: null,
  endsAt: null,
  status: 'UNACTIVATED',
  paidAmount: 29000,
  refundable: true,
  durationDays: 30,
};

function mockApi(passes: unknown[] | 'error', detail: unknown = passDetail) {
  mockGet.mockImplementation(async (url: string) => {
    if (url === '/vod-pass') {
      if (passes === 'error') throw new Error('network');
      return { data: { data: { passes } } };
    }
    if (url.startsWith('/payment/')) {
      return { data: { data: detail } };
    }
    throw new Error(`unexpected GET ${url}`);
  });
}

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidate = jest.spyOn(client, 'invalidateQueries');
  render(
    <QueryClientProvider client={client}>
      <CreditDeletePage />
    </QueryClientProvider>,
  );
  return { invalidate };
}

describe('CreditDeletePage VOD_PASS (LC-3438)', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    mockGet.mockReset();
    mockDelete.mockReset();
    mockPush.mockReset();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('환불 가능한 이용권은 거래 합계가 아니라 이용권 금액 전액을 예정 환불금액으로 보인다', async () => {
    mockApi([pass]);

    renderPage();

    expect(await screen.findByText('예정 환불금액')).toBeInTheDocument();
    // 예정 환불금액·결제금액 모두 이 이용권의 29,000원이고 챌린지 금액은 섞이지 않는다
    expect(screen.getAllByText('29,000원').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('89,000원')).not.toBeInTheDocument();
    expect(screen.getByText('-0원')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: '결제 취소하기' }),
    ).toBeInTheDocument();
  });

  it('환불하면 type=VOD_PASS 로 이용권 신청을 취소하고 이용권 목록을 다시 받는다', async () => {
    mockApi([pass]);
    mockDelete.mockResolvedValue({ data: {} });
    const user = userEvent.setup();

    const { invalidate } = renderPage();

    await user.click(await screen.findByText('환불 정보를 확인하셨나요?'));
    await user.click(screen.getByRole('button', { name: '결제 취소하기' }));

    await waitFor(() =>
      expect(mockDelete).toHaveBeenCalledWith('/application/11', {
        params: { type: 'VOD_PASS' },
      }),
    );
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith('/mypage/credit/502'),
    );
    const invalidatedKeys = invalidate.mock.calls.map(
      ([filters]) => (filters as { queryKey: unknown[] }).queryKey[0],
    );
    expect(invalidatedKeys).toEqual(
      expect.arrayContaining([
        'usePaymentQueryKey',
        'usePaymentDetailQueryKey',
        'useVodPassQueryKey',
      ]),
    );
  });

  it('환불 확인 중인 409 는 BE 가 내려준 사유를 그대로 알려준다', async () => {
    mockApi([pass]);
    mockDelete.mockRejectedValue({
      status: 409,
      code: 'VOD_PASS_REFUND_PENDING',
      serverMessage: 'VOD 이용권 환불 결과 확인 중입니다.',
    });
    const user = userEvent.setup();

    renderPage();

    await user.click(await screen.findByText('환불 정보를 확인하셨나요?'));
    await user.click(screen.getByRole('button', { name: '결제 취소하기' }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '[결제 취소 실패]\nVOD 이용권 환불 결과 확인 중입니다.',
      ),
    );
  });

  it('그 밖의 실패는 기존 실패 안내를 쓴다', async () => {
    mockApi([pass]);
    mockDelete.mockRejectedValue({ status: 500, serverMessage: '서버 오류' });
    const user = userEvent.setup();

    renderPage();

    await user.click(await screen.findByText('환불 정보를 확인하셨나요?'));
    await user.click(screen.getByRole('button', { name: '결제 취소하기' }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '[결제 취소 실패]\n문제가 계속되는 경우 아래 채팅으로 문의 부탁드립니다.',
      ),
    );
  });

  it('활성화한 이용권은 환불 버튼 없이 이유를 알려준다', async () => {
    mockApi([
      {
        ...pass,
        status: 'ACTIVE',
        startsAt: '2026-10-12T12:00:00+09:00',
        endsAt: '2026-11-11T12:00:00+09:00',
        refundable: false,
      },
    ]);

    renderPage();

    expect(
      await screen.findByText('활성화한 이용권은 환불할 수 없습니다'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '결제 취소하기' }),
    ).not.toBeInTheDocument();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('이용권 조회가 실패하면 환불 버튼 없이 다시 시도하라고 알려준다', async () => {
    mockApi('error');

    renderPage();

    expect(
      await screen.findByText(
        '이용권 정보를 불러오지 못해 환불할 수 없습니다. 잠시 후 다시 시도해 주세요',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '결제 취소하기' }),
    ).not.toBeInTheDocument();
  });
});

/*
  챌린지 환불 화면. 함께 결제한 이용권은 자동으로 환불되지 않으므로 별도 환불을 안내하되,
  챌린지 환불 금액은 이용권 유무와 상관없이 같아야 한다.
*/
describe('CreditDeletePage 챌린지 환불 안내 (LC-3438)', () => {
  const challengeDetail = (paymentItems: unknown) => ({
    programInfo: {
      id: 3,
      title: '챌린지',
      thumbnail: '/thumb.png',
      programType: 'CHALLENGE',
      progressType: null,
      isCanceled: false,
      // 시작 전이라 전액 환불 구간이다
      startDate: '2099-01-01T00:00:00',
      endDate: '2099-01-31T00:00:00',
      applicationId: 10,
    },
    priceInfo: { id: 3, price: 60000, discount: 0, refund: 0, option: 0 },
    paymentInfo: {
      id: 502,
      finalPrice: 60000,
      couponDiscount: null,
      isRefunded: false,
      createDate: '2026-10-12T10:00:00',
    },
    tossInfo: {
      status: 'DONE',
      paymentKey: 'pk-A',
      // 이용권을 함께 결제한 거래만 PG 합계가 챌린지 금액보다 크다
      totalAmount:
        Array.isArray(paymentItems) && paymentItems.length > 1 ? 89000 : 60000,
      balanceAmount:
        Array.isArray(paymentItems) && paymentItems.length > 1 ? 89000 : 60000,
      method: '카드',
      requestedAt: '2026-10-12T10:00:00',
    },
    paymentItems,
  });

  const challengeItem = {
    paymentId: 502,
    applicationId: 10,
    programType: 'CHALLENGE',
    title: '챌린지',
    paidAmount: 60000,
  };
  const passItem = {
    paymentId: 601,
    applicationId: 11,
    programType: 'VOD_PASS',
    title: 'VOD 전체 이용권',
    paidAmount: 29000,
  };
  const NOTICE = '함께 결제한 VOD 이용권은 별도로 환불해야 합니다';

  beforeEach(() => {
    mockGet.mockReset();
    mockDelete.mockReset();
    mockPush.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('미활성 이용권을 함께 결제했으면 별도 환불 안내와 이용권 환불 링크를 보이고 환불 금액은 챌린지 금액이다', async () => {
    mockApi(
      [{ ...pass, paymentId: 601 }],
      challengeDetail([challengeItem, passItem]),
    );

    renderPage();

    expect(await screen.findByText(NOTICE)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'VOD 이용권 환불하러 가기' }),
    ).toHaveAttribute('href', '/mypage/credit/601/delete');
    // 이용권 29,000원이 환불 금액이나 차감에 섞이지 않는다
    expect(screen.getAllByText('60,000원').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('89,000원')).not.toBeInTheDocument();
    expect(screen.queryByText('-29,000원')).not.toBeInTheDocument();
    expect(screen.getByText('-0원')).toBeInTheDocument();
  });

  it('이용권 없이 결제한 챌린지는 안내가 없고 이용권 목록도 조회하지 않는다', async () => {
    mockApi([], challengeDetail([]));

    renderPage();

    expect(await screen.findByText('예정 환불금액')).toBeInTheDocument();
    expect(screen.getAllByText('60,000원').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText(NOTICE)).not.toBeInTheDocument();
    expect(mockGet).not.toHaveBeenCalledWith('/vod-pass');
  });

  it('이용권을 이미 활성화했다면 안내가 없다', async () => {
    mockApi(
      [
        {
          ...pass,
          paymentId: 601,
          status: 'ACTIVE',
          startsAt: '2026-10-12T12:00:00+09:00',
          endsAt: '2026-11-11T12:00:00+09:00',
          refundable: false,
        },
      ],
      challengeDetail([challengeItem, passItem]),
    );

    renderPage();

    expect(await screen.findByText('예정 환불금액')).toBeInTheDocument();
    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/vod-pass'));
    expect(screen.queryByText(NOTICE)).not.toBeInTheDocument();
  });

  it('이용권을 이미 환불했다면 안내가 없다', async () => {
    mockApi(
      [{ ...pass, paymentId: 601, status: 'CANCELED', refundable: false }],
      challengeDetail([challengeItem, { ...passItem, isCanceled: true }]),
    );

    renderPage();

    expect(await screen.findByText('예정 환불금액')).toBeInTheDocument();
    expect(screen.queryByText(NOTICE)).not.toBeInTheDocument();
  });
});
