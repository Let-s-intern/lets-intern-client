/*
  결제 결과 페이지 (LC-3438): 주문 생성 요청 본문, 409 사유별 문구, 이용권 안내.
  요청 본문·문구 분기는 `orderResult.ts` 단위 테스트가 따로 있고, 여기서는 페이지가
  그 함수를 실제로 쓰는지(배선)를 본다.
*/
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

const postMock = jest.fn();
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: (...args: unknown[]) => postMock(...args) },
}));

// 페이지가 `@/api/application` 의 쿼리 키를 가져오므로 그 모듈이 딸고 오는 네트워크 계층을 막는다
jest.mock('@/utils/axiosV2', () => ({ __esModule: true, default: {} }));
jest.mock('@letscareer/api', () => ({
  __esModule: true,
  fetchJson: jest.fn(),
}));

const replaceMock = jest.fn();
let mockSearch = '';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: replaceMock }),
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

jest.mock('@/api/program', () => ({
  useProgramQuery: () => ({
    type: 'challenge',
    query: {
      data: {
        title: 'QA 챌린지',
        thumbnail: '',
        startDate: null,
        endDate: null,
      },
    },
  }),
}));

jest.mock('@/common/boundary/AsyncBoundary', () => ({
  AsyncBoundary: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/domain/program/ProgramCard', () => ({
  __esModule: true,
  default: () => null,
}));

import useProgramStore, {
  initProgramApplicationForm,
  setProgramApplicationForm,
} from '@/store/useProgramStore';
import PaymentResult from './page';

const FORM = {
  priceId: 2,
  price: 100000,
  discount: 10000,
  couponId: '3',
  couponPrice: 20000,
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

const VOD_PASS = {
  vodPassProductId: 7,
  vodPassPrice: 40000,
  vodPassDurationDays: 90,
  vodPassMonths: 3,
};

function seed(withVodPass: boolean, totalPrice: number) {
  initProgramApplicationForm();
  setProgramApplicationForm({
    ...FORM,
    ...(withVodPass ? VOD_PASS : {}),
    totalPrice,
  });
  useProgramStore.setState({ _hasHydrated: true });
}

const TOSS_QUERY = (amount: number) =>
  `orderId=letsAB12&paymentKey=pk_1&amount=${amount}&paymentMethodKey=CARD`;

const SUCCESS_RESPONSE = {
  data: {
    data: {
      tossInfo: { method: '카드', approvedAt: '2026-10-12T10:00:00' },
    },
  },
};

function successWithVodPass(vodPass: Record<string, unknown>) {
  return {
    data: {
      data: {
        tossInfo: { method: '카드', approvedAt: '2026-10-16T10:00:00' },
        vodPass: {
          applicationId: 91,
          paymentId: 2,
          durationDays: 90,
          purchasedMonths: 3,
          ...vodPass,
        },
      },
    },
  };
}

let queryClient: QueryClient;

function renderPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <PaymentResult />
    </QueryClientProvider>,
  );
}

function apiError(status: number, code: string) {
  return Object.assign(new Error(code), { status, code });
}

beforeEach(() => {
  queryClient = new QueryClient();
  postMock.mockReset();
  replaceMock.mockReset();
  jest.spyOn(console, 'log').mockImplementation(() => undefined);
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('order/result 주문 생성 요청', () => {
  it('이용권을 고르지 않았으면 기존 본문 그대로 보낸다', async () => {
    seed(false, 70000);
    mockSearch = TOSS_QUERY(70000);
    postMock.mockResolvedValue(SUCCESS_RESPONSE);

    renderPage();

    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(1));
    const [url, body] = postMock.mock.calls[0];
    expect(url).toBe('/application/406?type=CHALLENGE');
    expect(body.paymentInfo).toEqual({
      couponId: 3,
      priceId: 2,
      paymentKey: 'pk_1',
      orderId: 'letsAB12',
      amount: '70000',
    });
    expect(Object.keys(body)).not.toContain('vodPassProductId');
    expect(Object.keys(body)).not.toContain('vodPassExpectedPrice');
    expect(Object.keys(body)).not.toContain('vodPassExpectedDurationDays');
    expect(Object.keys(body)).not.toContain('vodPassMonths');
  });

  it('이용권을 골랐으면 네 필드를 담고 amount 는 Toss 쿼리 값(이용권 합산)을 쓴다', async () => {
    seed(true, 110000);
    mockSearch = TOSS_QUERY(110000);
    postMock.mockResolvedValue(SUCCESS_RESPONSE);

    renderPage();

    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(1));
    const body = postMock.mock.calls[0][1];
    expect(body.vodPassProductId).toBe(7);
    expect(body.vodPassExpectedPrice).toBe(40000);
    expect(body.vodPassExpectedDurationDays).toBe(90);
    expect(body.vodPassMonths).toBe(3);
    expect(body.paymentInfo.amount).toBe('110000');
  });
});

describe('order/result 화면', () => {
  it('즉시 시작된 이용권이면 지금부터 이용할 수 있다는 안내와 기간을 보여준다', async () => {
    seed(true, 110000);
    mockSearch = TOSS_QUERY(110000);
    postMock.mockResolvedValue(
      successWithVodPass({
        status: 'ACTIVE',
        startsAt: '2026-10-16T10:00:00+09:00',
        endsAt: '2027-01-14T10:00:00+09:00',
      }),
    );

    renderPage();

    expect(
      await screen.findByText(
        'VOD 이용권을 지금부터 이용할 수 있습니다. 이용 기간은 2026.10.16 ~ 2027.01.14 입니다',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/활성화/)).not.toBeInTheDocument();
  });

  it('앞선 이용권 뒤에 예약된 이용권이면 시작 예정일을 안내한다', async () => {
    seed(true, 110000);
    mockSearch = TOSS_QUERY(110000);
    postMock.mockResolvedValue(
      successWithVodPass({
        status: 'SCHEDULED',
        startsAt: '2026-11-15T10:00:00+09:00',
        endsAt: '2027-02-13T10:00:00+09:00',
      }),
    );

    renderPage();

    expect(
      await screen.findByText(
        '이미 이용 중인 이용권이 있어 2026.11.15부터 VOD 이용권 이용이 시작됩니다. 이용 기간은 2026.11.15 ~ 2027.02.13 입니다',
      ),
    ).toBeInTheDocument();
  });

  it('응답에 이용 기간이 없으면 마이페이지에서 확인하라고 안내한다', async () => {
    seed(true, 110000);
    mockSearch = TOSS_QUERY(110000);
    postMock.mockResolvedValue(SUCCESS_RESPONSE);

    renderPage();

    expect(
      await screen.findByText(/마이페이지 결제 내역에서 확인할 수 있습니다/),
    ).toBeInTheDocument();
  });

  it('성공해도 이용권을 사지 않았으면 안내를 보여주지 않는다', async () => {
    seed(false, 70000);
    mockSearch = TOSS_QUERY(70000);
    postMock.mockResolvedValue(SUCCESS_RESPONSE);

    renderPage();

    expect(await screen.findByText('마이페이지 바로가기')).toBeInTheDocument();
    expect(screen.queryByText(/VOD 이용권/)).not.toBeInTheDocument();
  });

  it('409 VOD_PASS_PRODUCT_CHANGED 는 다시 선택하라는 문구를 보여준다', async () => {
    seed(true, 99000);
    mockSearch = TOSS_QUERY(99000);
    postMock.mockRejectedValue(apiError(409, 'VOD_PASS_PRODUCT_CHANGED'));

    renderPage();

    expect(
      await screen.findByText(
        'VOD 이용권 가격·기간이 변경되었으니 다시 선택해 주세요',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/결제가 승인되지 않았어요/)).toBeInTheDocument();
  });

  it('409 VOD_PASS_PRODUCT_CHANGED 면 신청폼 쿼리를 무효화해 최신 상품을 다시 받게 한다', async () => {
    seed(true, 110000);
    mockSearch = TOSS_QUERY(110000);
    postMock.mockRejectedValue(apiError(409, 'VOD_PASS_PRODUCT_CHANGED'));
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

    renderPage();

    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['useProgramApplicationQueryKey'],
      }),
    );
  });

  it('다른 409 는 신청폼 쿼리를 무효화하지 않는다', async () => {
    seed(true, 110000);
    mockSearch = TOSS_QUERY(110000);
    postMock.mockRejectedValue(apiError(409, 'PAYMENT_ORDER_CONFLICT'));
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');

    renderPage();

    await screen.findByText(/결제 내역을 확인해 주세요/);
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('409 PAYMENT_ORDER_CONFLICT 는 결제 내역을 확인하라는 문구를 보여준다', async () => {
    seed(true, 99000);
    mockSearch = TOSS_QUERY(99000);
    postMock.mockRejectedValue(apiError(409, 'PAYMENT_ORDER_CONFLICT'));

    renderPage();

    expect(
      await screen.findByText(
        '이미 처리된 주문과 정보가 다릅니다. 결제 내역을 확인해 주세요',
      ),
    ).toBeInTheDocument();
  });

  it('그 밖의 실패는 사유 문구 없이 기존 실패 화면만 보여준다', async () => {
    seed(true, 99000);
    mockSearch = TOSS_QUERY(99000);
    postMock.mockRejectedValue(apiError(400, 'INVALID_PRICE'));

    renderPage();

    expect(
      await screen.findByText(/결제가 승인되지 않았어요/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/다시 선택해 주세요/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/결제 내역을 확인해 주세요/),
    ).not.toBeInTheDocument();
  });
});
