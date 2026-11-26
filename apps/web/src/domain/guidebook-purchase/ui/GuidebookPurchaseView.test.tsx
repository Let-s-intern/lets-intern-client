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
// 쿠폰 영역 자체는 GuidebookCouponSection.test 에서 본다. 여기서는 부모와 오가는 값만 본다
jest.mock('./GuidebookCouponSection', () => ({
  __esModule: true,
  default: ({
    amount,
    selectedCouponId,
    onChange,
  }: {
    amount: number;
    selectedCouponId: number | null;
    onChange: (coupon: { id: number | null; price: number }) => void;
  }) => (
    <div data-testid="coupon-section" data-amount={amount}>
      <span>선택 {String(selectedCouponId)}</span>
      <button onClick={() => onChange({ id: 3, price: 300 })}>
        쿠폰 300원
      </button>
      <button onClick={() => onChange({ id: 4, price: 990 })}>쿠폰 전액</button>
      <button onClick={() => onChange({ id: 5, price: 2000 })}>
        쿠폰 초과
      </button>
      <button onClick={() => onChange({ id: null, price: 0 })}>
        쿠폰 끄기
      </button>
    </div>
  ),
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

  it('혜택이 있으면 위젯 없이 혜택 문구와 무료 신청 버튼을 보이고, 0원 무료 신청으로 보낸다', async () => {
    mockPrivilege = privilegeResult(true);
    mockSearch = new URLSearchParams({ returnUrl: 'https://ogonggo.co.kr/r' });

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByText('올인원패스 혜택으로 무료')).toBeInTheDocument();
    expect(screen.queryByText('990원')).toBeNull();
    expect(screen.queryByRole('button', { name: /결제하기/ })).toBeNull();
    await userEvent.click(
      screen.getByRole('button', { name: '무료로 신청하기' }),
    );

    const url = new URL(mockPush.mock.calls[0][0], 'https://x.test');
    expect(url.pathname).toBe('/guidebook/purchase/12/result');
    expect(url.searchParams.get('amount')).toBe('0');
    expect(url.searchParams.get('free')).toBe('true');
    expect(url.searchParams.get('returnUrl')).toBe('https://ogonggo.co.kr/r');
  });

  it('혜택이 없으면 결제 위젯 흐름이 그대로이고 혜택 문구가 없다', () => {
    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.queryByText('올인원패스 혜택으로 무료')).toBeNull();
    expect(
      screen.getByRole('button', { name: '990원 결제하기' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '무료로 신청하기' }),
    ).toBeNull();
  });

  it('가격이 원래 0원이면 혜택이 있어도 무료만 보이고 혜택 문구는 없다', () => {
    mockPrivilege = privilegeResult(true);
    mockApplication.data = {
      applied: false,
      price: {
        priceId: 7,
        price: 1000,
        discount: 1000,
        guideBookPriceType: 'FREE',
      },
    };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByText('무료')).toBeInTheDocument();
    expect(screen.queryByText('올인원패스 혜택으로 무료')).toBeNull();
  });

  it('이미 구매했으면 혜택을 확인하지 않고 안내를 보인다', () => {
    mockPrivilege = privilegeResult(true);
    mockApplication.data = { ...paidApplication, applied: true };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByText('이미 구매했어요.')).toBeInTheDocument();
    expect(screen.queryByText('올인원패스 혜택으로 무료')).toBeNull();
  });

  it('돌아온 구매 화면은 캐시된 혜택 값을 쓰지 않고 새 조회가 끝날 때까지 로딩을 보인다', () => {
    mockPrivilege = { ...privilegeResult(true), isFetching: true };

    render(<GuidebookPurchaseView guidebookId={12} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
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

  describe('쿠폰', () => {
    it('혜택이 없고 금액이 있으면 정가 - 할인 금액을 기준으로 쿠폰 영역을 그린다', () => {
      render(<GuidebookPurchaseView guidebookId={12} />);

      expect(screen.getByTestId('coupon-section')).toHaveAttribute(
        'data-amount',
        '990',
      );
    });

    it('혜택 보유 계정에는 쿠폰 영역이 없다', () => {
      mockPrivilege = privilegeResult(true);

      render(<GuidebookPurchaseView guidebookId={12} />);

      expect(screen.queryByTestId('coupon-section')).toBeNull();
    });

    it('원래 0원인 상품에는 쿠폰 영역이 없다', () => {
      mockApplication.data = {
        applied: false,
        price: {
          priceId: 7,
          price: 1000,
          discount: 1000,
          guideBookPriceType: 'FREE',
        },
      };

      render(<GuidebookPurchaseView guidebookId={12} />);

      expect(screen.queryByTestId('coupon-section')).toBeNull();
    });

    it('쿠폰을 고르면 결제 버튼과 요약 금액이 할인된 값으로 바뀌고, 해제하면 돌아온다', async () => {
      render(<GuidebookPurchaseView guidebookId={12} />);

      await userEvent.click(screen.getByRole('button', { name: '쿠폰 300원' }));

      expect(
        screen.getByRole('button', { name: '690원 결제하기' }),
      ).toBeInTheDocument();
      expect(screen.getByText('690원')).toBeInTheDocument();
      expect(screen.getByText('990원')).toBeInTheDocument();
      expect(screen.getByText('선택 3')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '쿠폰 끄기' }));

      expect(
        screen.getByRole('button', { name: '990원 결제하기' }),
      ).toBeInTheDocument();
      expect(screen.queryByText('690원')).toBeNull();
    });

    it('전액할인 쿠폰이면 결제 위젯 대신 무료 신청 버튼을 보이고, 해제하면 결제 버튼으로 돌아온다', async () => {
      render(<GuidebookPurchaseView guidebookId={12} />);

      await userEvent.click(screen.getByRole('button', { name: '쿠폰 전액' }));

      expect(
        screen.getByRole('button', { name: '무료로 신청하기' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /결제하기/ })).toBeNull();
      expect(screen.getByText('무료')).toBeInTheDocument();
      expect(screen.getByTestId('coupon-section')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '쿠폰 끄기' }));

      expect(
        screen.getByRole('button', { name: '990원 결제하기' }),
      ).toBeInTheDocument();
    });

    it('할인액이 금액보다 커도 결제 금액은 0 아래로 내려가지 않는다', async () => {
      render(<GuidebookPurchaseView guidebookId={12} />);

      await userEvent.click(screen.getByRole('button', { name: '쿠폰 초과' }));

      expect(screen.getByText('무료')).toBeInTheDocument();
      expect(screen.queryByText(/-/)).toBeNull();
      expect(
        screen.getByRole('button', { name: '무료로 신청하기' }),
      ).toBeInTheDocument();
    });

    describe('토스 금액과 주소', () => {
      const setAmount = jest.fn();
      const requestPayment = jest.fn();

      beforeEach(() => {
        setAmount.mockReset();
        requestPayment.mockReset();
        jest.mocked(loadTossPayments).mockResolvedValue({
          widgets: () => ({
            setAmount,
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
      });

      it('쿠폰을 고르면 토스 위젯 금액을 할인된 금액으로 맞춘다', async () => {
        render(<GuidebookPurchaseView guidebookId={12} />);
        await waitFor(() =>
          expect(setAmount).toHaveBeenCalledWith({
            currency: 'KRW',
            value: 990,
          }),
        );
        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: '990원 결제하기' }),
          ).toBeEnabled(),
        );

        await userEvent.click(
          screen.getByRole('button', { name: '쿠폰 300원' }),
        );

        await waitFor(() =>
          expect(setAmount).toHaveBeenLastCalledWith({
            currency: 'KRW',
            value: 690,
          }),
        );
        expect(setAmount).toHaveBeenCalledTimes(2);
      });

      it('결제하면 성공 주소에 couponId 와 할인된 금액이 담긴다', async () => {
        render(<GuidebookPurchaseView guidebookId={12} />);
        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: '990원 결제하기' }),
          ).toBeEnabled(),
        );
        await userEvent.click(
          screen.getByRole('button', { name: '쿠폰 300원' }),
        );

        const pay = screen.getByRole('button', { name: '690원 결제하기' });
        await userEvent.click(pay);

        const { successUrl, failUrl } = requestPayment.mock.calls[0][0];
        expect(new URL(successUrl).searchParams.get('couponId')).toBe('3');
        expect(new URL(failUrl).searchParams.get('couponId')).toBe('3');
        expect(setAmount).toHaveBeenLastCalledWith({
          currency: 'KRW',
          value: 690,
        });
      });

      it('쿠폰이 없으면 성공 주소에 couponId 가 없다', async () => {
        render(<GuidebookPurchaseView guidebookId={12} />);
        const pay = screen.getByRole('button', { name: '990원 결제하기' });
        await waitFor(() => expect(pay).toBeEnabled());
        await userEvent.click(pay);

        const { successUrl } = requestPayment.mock.calls[0][0];
        expect(new URL(successUrl).searchParams.has('couponId')).toBe(false);
      });

      it('전액할인으로 무료 신청하면 이동 주소에 couponId 와 0원이 담긴다', async () => {
        render(<GuidebookPurchaseView guidebookId={12} />);

        await userEvent.click(
          screen.getByRole('button', { name: '쿠폰 전액' }),
        );
        await userEvent.click(
          screen.getByRole('button', { name: '무료로 신청하기' }),
        );

        const url = new URL(mockPush.mock.calls[0][0], 'https://x.test');
        expect(url.pathname).toBe('/guidebook/purchase/12/result');
        expect(url.searchParams.get('couponId')).toBe('4');
        expect(url.searchParams.get('amount')).toBe('0');
        expect(url.searchParams.get('free')).toBe('true');
      });
    });
  });
});
