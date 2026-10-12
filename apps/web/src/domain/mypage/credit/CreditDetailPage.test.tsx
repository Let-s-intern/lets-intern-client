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
  useUserQuery: () => ({
    data: { name: '김렛츠', phoneNum: '010-0000-0000', email: 'a@b.c' },
    isLoading: false,
    isError: false,
  }),
}));
jest.mock('next/navigation', () => ({
  useParams: () => ({ paymentId: '502' }),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));
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

import axios from '@/utils/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import CreditDetailPage from './CreditDetailPage';

const mockGet = axios.get as jest.Mock;

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
  // PG 거래 전체. 챌린지 60,000원 + 이용권 29,000원
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
      title: '챌린지',
      paidAmount: 60000,
    },
    {
      paymentId: 502,
      applicationId: 11,
      programType: 'VOD_PASS',
      title: 'VOD 전체 이용권',
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

function mockApi({
  detail = passDetail,
  passes,
}: {
  detail?: unknown;
  passes: unknown[] | 'error';
}) {
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
  return render(
    <QueryClientProvider client={client}>
      <CreditDetailPage />
    </QueryClientProvider>,
  );
}

describe('CreditDetailPage VOD_PASS (LC-3438)', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('미활성 이용권은 활성화 안내와 이용 일수를 보인다', async () => {
    mockApi({ passes: [pass] });

    renderPage();

    expect(
      await screen.findByText(
        '아직 활성화하지 않았습니다. VOD 사이트에서 활성화하면 30일 동안 시청할 수 있습니다',
      ),
    ).toBeInTheDocument();
    // 이용권 행에 챌린지 기간이 그려지지 않는다
    expect(screen.queryByText('진행 일정')).not.toBeInTheDocument();
  });

  it('이용 중인 이용권은 종료일을 보인다', async () => {
    mockApi({
      passes: [
        {
          ...pass,
          status: 'ACTIVE',
          startsAt: '2026-10-12T12:00:00+09:00',
          endsAt: '2026-11-11T12:00:00+09:00',
          refundable: false,
        },
      ],
    });

    renderPage();

    expect(await screen.findByText('이용 중')).toBeInTheDocument();
    expect(screen.getByText('2026.11.11')).toBeInTheDocument();
  });

  it('이용권 조회가 실패해도 결제 상세는 보이고 상태만 빠진다', async () => {
    mockApi({ passes: 'error' });

    renderPage();

    expect(await screen.findByText('VOD 전체 이용권')).toBeInTheDocument();
    expect(screen.getByText('결제 정보')).toBeInTheDocument();
    expect(screen.queryByText('이용권 상태')).not.toBeInTheDocument();
  });

  it('같은 거래의 챌린지를 함께 결제한 항목으로 보이고 총 결제금액은 이 행의 금액이다', async () => {
    mockApi({ passes: [pass] });

    renderPage();

    expect(await screen.findByText('함께 결제한 항목')).toBeInTheDocument();
    expect(screen.getByText('챌린지')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    // 거래 전체(89,000원)는 합계 한 곳에만, 이 행의 총 결제금액은 29,000원이다
    expect(screen.getAllByText('89,000원')).toHaveLength(1);
    expect(screen.getAllByText('29,000원').length).toBeGreaterThan(0);
  });
});
