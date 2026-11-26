import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import GuidebookPurchaseView from './GuidebookPurchaseView';

const mockReplace = jest.fn();
const mockPush = jest.fn();
let mockAuth = { isLoggedIn: true, isInitialized: true };
let mockSearch = new URLSearchParams();
let mockGuidebook: unknown = {
  data: { title: '산업 리포트', thumbnail: 'https://img/t.png' },
  isLoading: false,
  isError: false,
};
const paidApplication = {
  applied: false,
  price: {
    priceId: 7,
    price: 1000,
    discount: 10,
    guideBookPriceType: 'CHARGE',
  },
};
const mockApplication = {
  data: paidApplication as unknown,
  isLoading: false,
  isError: false,
};

const mockRefetch = jest.fn();
const privilegeResult = (hasPrivilege: boolean) => ({
  data: { hasPrivilege },
  isPending: false,
  isFetching: false,
  isError: false,
  refetch: mockRefetch,
});
let mockPrivilege: Record<string, unknown> = privilegeResult(false);

jest.mock('@/domain/all-in-one-pass/api/privilege', () => ({
  useGetMembershipPrivilege: () => mockPrivilege,
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  useSearchParams: () => mockSearch,
}));
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: () => mockAuth,
}));
let mockUser: unknown;
jest.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: mockUser }),
}));
jest.mock('@/api/program', () => ({
  useProgramQuery: () => ({ type: 'guidebook', query: mockGuidebook }),
}));
jest.mock('@/api/application', () => ({
  useProgramApplicationQuery: () => mockApplication,
  useProgramApplicationQueryKey: 'useProgramApplicationQueryKey',
}));
jest.mock('@/utils/random', () => ({
  generateRandomString: () => 'abc',
  generateRandomNumber: () => '1',
}));
jest.mock('@tosspayments/tosspayments-sdk', () => ({
  loadTossPayments: jest.fn(),
}));
jest.mock('@/common/loading/LoadingContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="loading" />,
}));

describe('GuidebookPurchaseView', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    mockAuth = { isLoggedIn: true, isInitialized: true };
    mockSearch = new URLSearchParams();
    mockGuidebook = {
      data: { title: '산업 리포트', thumbnail: 'https://img/t.png' },
      isLoading: false,
      isError: false,
    };
    mockApplication.data = paidApplication;
    mockUser = undefined;
    mockPrivilege = privilegeResult(false);
    mockRefetch.mockClear();
  });

  it('혜택 조회 중에는 결제 위젯과 신청 버튼 없이 로딩을 보인다', () => {
    mockPrivilege = {
      data: undefined,
      isPending: true,
      isFetching: true,
      isError: false,
      refetch: mockRefetch,
    };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('혜택 조회가 실패하면 결제 위젯을 열지 않고 안내와 다시 불러오기를 보인다', async () => {
    mockPrivilege = {
      data: undefined,
      isPending: false,
      isFetching: false,
      isError: true,
      refetch: mockRefetch,
    };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(
      screen.getByText('구매 정보를 불러오지 못했어요'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /결제하기/ })).toBeNull();
    expect(
      screen.queryByRole('button', { name: '무료로 신청하기' }),
    ).toBeNull();
    await userEvent.click(
      screen.getByRole('button', { name: '다시 불러오기' }),
    );
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('비로그인이면 로그인 후 이 구매 화면으로 돌아오게 보낸다', async () => {
    mockAuth = { isLoggedIn: false, isInitialized: true };

    render(<GuidebookPurchaseView guidebookId={12} />);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith(
        '/login?redirect=%2Fguidebook%2Fpurchase%2F12',
      ),
    );
  });

  it('로그인 뒤 돌아올 주소에 returnUrl 을 유지한다', async () => {
    mockAuth = { isLoggedIn: false, isInitialized: true };
    mockSearch = new URLSearchParams({ returnUrl: 'https://ogonggo.co.kr/r' });

    render(<GuidebookPurchaseView guidebookId={12} />);

    await waitFor(() => expect(mockReplace).toHaveBeenCalled());
    const url = new URL(mockReplace.mock.calls[0][0], 'https://x.test');
    expect(url.searchParams.get('redirect')).toBe(
      '/guidebook/purchase/12?returnUrl=https%3A%2F%2Fogonggo.co.kr%2Fr',
    );
  });

  it('로그인 복원 전에는 로그인으로 보내지 않는다', () => {
    mockAuth = { isLoggedIn: false, isInitialized: false };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('상품 제목과 신청 조회로 정한 결제 금액(정가 - 할인)을 보여준다', () => {
    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByText('산업 리포트')).toBeInTheDocument();
    expect(screen.getByText('990원')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '990원 결제하기' }),
    ).toBeDisabled();
  });

  it('상품 정보를 읽지 못하면 안내를 보여준다', () => {
    mockGuidebook = { data: undefined, isLoading: false, isError: true };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(
      screen.getByText('상품 정보를 불러오지 못했어요.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('0원이면 토스 위젯 대신 무료 신청 버튼을 보이고, 결제 키 없이 결과 화면으로 보낸다', async () => {
    mockApplication.data = {
      applied: false,
      price: {
        priceId: 7,
        price: 1000,
        discount: 1000,
        guideBookPriceType: 'FREE',
      },
    };
    mockSearch = new URLSearchParams({ returnUrl: 'https://ogonggo.co.kr/r' });

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByText('무료')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /결제하기/ })).toBeNull();
    await userEvent.click(
      screen.getByRole('button', { name: '무료로 신청하기' }),
    );

    const url = new URL(mockPush.mock.calls[0][0], 'https://x.test');
    expect(url.pathname).toBe('/guidebook/purchase/12/result');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      priceId: '7',
      orderId: 'letsabc1',
      amount: '0',
      free: 'true',
      returnUrl: 'https://ogonggo.co.kr/r',
    });
  });

  it('이미 구매했으면 결제 위젯 대신 안내와 확인하기를 보인다', () => {
    mockApplication.data = { ...paidApplication, applied: true };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByText('이미 구매했어요.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '확인하기' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /결제하기/ })).toBeNull();
    expect(
      screen.queryByRole('button', { name: '무료로 신청하기' }),
    ).toBeNull();
  });

  it('결제 성공·실패 주소가 결과·실패 경로이고 priceId 와 returnUrl 을 그대로 넘긴다', async () => {
    const requestPayment = jest.fn();
    jest.mocked(loadTossPayments).mockResolvedValue({
      widgets: () => ({
        setAmount: jest.fn(),
        renderPaymentMethods: async () => ({
          getSelectedPaymentMethod: async () => ({ code: 'CARD' }),
        }),
        renderAgreement: jest.fn(),
        requestPayment,
      }),
    } as never);
    mockUser = {
      id: 'user-1',
      name: '홍길동',
      email: 'a@b.c',
      phoneNum: '010',
    };
    mockSearch = new URLSearchParams({ returnUrl: 'https://ogonggo.co.kr/r' });

    render(<GuidebookPurchaseView guidebookId={12} />);

    const pay = screen.getByRole('button', { name: '990원 결제하기' });
    await waitFor(() => expect(pay).toBeEnabled());
    await userEvent.click(pay);

    const { successUrl, failUrl, orderId, orderName } =
      requestPayment.mock.calls[0][0];
    expect(orderId).toBe('letsabc1');
    expect(orderName).toBe('산업 리포트');

    const success = new URL(successUrl);
    expect(success.pathname).toBe('/guidebook/purchase/12/result');
    expect(success.searchParams.get('priceId')).toBe('7');
    expect(success.searchParams.get('paymentMethodKey')).toBe('CARD');
    expect(success.searchParams.get('returnUrl')).toBe(
      'https://ogonggo.co.kr/r',
    );

    const fail = new URL(failUrl);
    expect(fail.pathname).toBe('/guidebook/purchase/12/fail');
    expect(fail.searchParams.get('returnUrl')).toBe('https://ogonggo.co.kr/r');
  });
});
