import { render, screen, waitFor } from '@testing-library/react';
import { useStandaloneVodPassProductQuery } from '../api';
import VodPassPurchaseView from './VodPassPurchaseView';

const mockReplace = jest.fn();
let mockAuth = { isLoggedIn: true, isInitialized: true };

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: () => mockAuth,
}));
jest.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: undefined }),
}));
jest.mock('@/lib/order', () => ({ generateOrderId: () => 'order1' }));
jest.mock('@tosspayments/tosspayments-sdk', () => ({
  loadTossPayments: jest.fn(),
}));
jest.mock('@/common/loading/LoadingContainer', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../api', () => ({ useStandaloneVodPassProductQuery: jest.fn() }));

const givenProduct = (data: unknown) =>
  jest.mocked(useStandaloneVodPassProductQuery).mockReturnValue({
    data,
    isLoading: false,
    isError: false,
  } as never);

const product = {
  id: 1,
  title: 'VOD 이용권',
  price: 29000,
  additionalMonthPrice: 10000,
  durationDays: 30,
  maxPurchaseMonths: 3,
  availableMonths: 3,
};

describe('VodPassPurchaseView', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockAuth = { isLoggedIn: true, isInitialized: true };
  });

  it('비로그인이면 로그인 후 이 페이지로 돌아오게 보낸다', async () => {
    mockAuth = { isLoggedIn: false, isInitialized: true };
    givenProduct(undefined);

    render(<VodPassPurchaseView />);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith(
        '/login?redirect=%2Fvod-pass%2Fpurchase',
      ),
    );
  });

  it('판매가 꺼져 있으면 결제 화면 대신 안내를 보여준다', () => {
    givenProduct(null);

    render(<VodPassPurchaseView />);

    expect(
      screen.getByText('지금은 VOD 이용권을 판매하지 않아요.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /결제하기/ })).toBeNull();
  });

  it('더 살 수 없는 사용자에게는 안내를 보여준다', () => {
    givenProduct({ ...product, availableMonths: 0 });

    render(<VodPassPurchaseView />);

    expect(
      screen.getByText('보유할 수 있는 VOD 이용 기간을 모두 채웠어요.'),
    ).toBeInTheDocument();
  });

  it('개월 수와 결제 금액을 보여준다', () => {
    givenProduct(product);

    render(<VodPassPurchaseView />);

    expect(screen.getByText('1개월')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '29,000원 결제하기' }),
    ).toBeDisabled();
  });
});
