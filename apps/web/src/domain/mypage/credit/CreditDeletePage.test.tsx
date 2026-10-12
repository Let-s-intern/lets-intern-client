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

function mockApi(passes: unknown[] | 'error') {
  mockGet.mockImplementation(async (url: string) => {
    if (url === '/vod-pass') {
      if (passes === 'error') throw new Error('network');
      return { data: { data: { passes } } };
    }
    if (url.startsWith('/payment/')) {
      return { data: { data: passDetail } };
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
