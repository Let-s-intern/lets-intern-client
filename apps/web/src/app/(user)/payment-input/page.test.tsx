/*
  결제 입력 페이지의 합계 검증 (LC-3438).
  화면의 결제금액, 쿠폰 적용 시 스토어에 담기는 totalPrice, 결제 화면으로 가는 분기가
  모두 같은 합계(max(정가 - 할인 - 쿠폰, 0) + 이용권)에서 나오는지 본다.
  네트워크·UI 하위 섹션은 목으로 막고 스토어는 실제 zustand 스토어를 쓴다.
*/
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/api/program', () => ({
  useProgramQuery: () => ({
    query: {
      isLoading: false,
      data: {
        title: 'QA 챌린지',
        thumbnail: '',
        challengeType: 'PORTFOLIO',
        priceInfo: [
          {
            challengePricePlanType: 'BASIC',
            price: 100000,
            refund: 0,
            discount: 10000,
          },
        ],
      },
    },
  }),
}));

jest.mock('@/api/user/user', () => ({
  usePatchUser: () => ({ mutateAsync: jest.fn().mockResolvedValue({}) }),
}));

jest.mock('@/hooks/useInstallmentPayment', () => ({
  useInstallmentPayment: () => ({ isLoading: true, months: 0, banks: [] }),
}));

jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({ isLoggedIn: true, isInitialized: true }),
}));

jest.mock('@letscareer/api', () => ({
  ApiError: class ApiError extends Error {},
}));

jest.mock('@letscareer/ui', () => ({
  NoticeDialog: () => <div>잘못된 접근입니다.</div>,
}));

jest.mock('@/utils/captureError', () => ({ captureDomainError: jest.fn() }));

jest.mock('@/common/boundary/AsyncBoundary', () => ({
  AsyncBoundary: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/domain/program/OrderProgramInfo', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock(
  '@/domain/program/program-detail/apply/section/UserInputSection',
  () => ({
    __esModule: true,
    default: () => null,
  }),
);

jest.mock(
  '@/domain/program/program-detail/apply/section/PaymentSubmitSection',
  () => ({
    __esModule: true,
    default: ({
      onSubmit,
      buttonText,
    }: {
      onSubmit: () => void;
      buttonText: string;
    }) => <button onClick={onSubmit}>{buttonText}</button>,
  }),
);

// 쿠폰 모달·API 는 이 테스트의 관심사가 아니다. 쿠폰 금액을 직접 흘려 보내는 버튼과
// 쿠폰 계산 기준(maxAmount·salePrice)이 이용권을 포함하지 않는지 보는 값만 노출한다.
jest.mock(
  '@/domain/program/program-detail/apply/section/CouponSection',
  () => ({
    __esModule: true,
    default: ({
      setCoupon,
      maxAmount,
      salePrice,
    }: {
      setCoupon: (coupon: { id: number | null; price: number }) => void;
      maxAmount: number;
      salePrice: number;
    }) => (
      <div>
        <span data-testid="coupon-max">{maxAmount}</span>
        <span data-testid="coupon-sale">{salePrice}</span>
        <button onClick={() => setCoupon({ id: 3, price: 20000 })}>
          일부쿠폰
        </button>
        <button onClick={() => setCoupon({ id: 4, price: maxAmount })}>
          전액쿠폰
        </button>
      </div>
    ),
  }),
);

import useProgramStore, {
  initProgramApplicationForm,
  setProgramApplicationForm,
} from '@/store/useProgramStore';
import PaymentInputPage from './page';

const BASE_FORM = {
  priceId: 1,
  price: 100000,
  discount: 10000,
  couponId: '',
  couponPrice: 0,
  contactEmail: 'qa@letscareer.test',
  question: '',
  email: 'qa@letscareer.test',
  phone: '010-0000-0000',
  name: 'QA',
  programTitle: 'QA 챌린지',
  programType: 'challenge' as const,
  progressType: 'none',
  programId: 406,
  programOrderId: 'order-1',
  isFree: false,
  deposit: 0,
};

const VOD_PASS = {
  vodPassProductId: 7,
  vodPassPrice: 29000,
  vodPassDurationDays: 30,
};

function seed(withVodPass: boolean) {
  setProgramApplicationForm({
    ...BASE_FORM,
    ...(withVodPass ? VOD_PASS : {}),
    totalPrice: 90000 + (withVodPass ? 29000 : 0),
  });
}

/** '결제금액' 줄의 값 */
function payableAmount() {
  return screen.getByText('결제금액').nextElementSibling?.textContent;
}

beforeEach(() => {
  pushMock.mockReset();
  initProgramApplicationForm();
});

describe('payment-input 합계 (LC-3438)', () => {
  it('이용권을 담으면 정가 - 할인에 이용권을 더한 금액과 이용권 줄을 보여준다', () => {
    seed(true);
    render(<PaymentInputPage />);

    expect(payableAmount()).toBe('119,000원');
    expect(screen.getByText('VOD 이용권')).toBeInTheDocument();
    expect(screen.getByText('+29,000원')).toBeInTheDocument();
  });

  it('이용권이 없으면 기존 화면과 같다 (이용권 줄 없음, 이용권 없는 합계)', () => {
    seed(false);
    render(<PaymentInputPage />);

    expect(payableAmount()).toBe('90,000원');
    expect(screen.queryByText('VOD 이용권')).not.toBeInTheDocument();
  });

  it('이용권 필드가 없던 시절의 저장 상태여도 NaN 없이 기존 합계를 보여준다', () => {
    seed(false);
    // persist 복원 상태를 흉내 낸다: 새 필드가 undefined
    useProgramStore.setState((state) => ({
      data: {
        ...state.data,
        vodPassProductId: undefined as unknown as number,
        vodPassPrice: undefined as unknown as number,
        vodPassDurationDays: undefined as unknown as number,
      },
    }));
    render(<PaymentInputPage />);

    expect(payableAmount()).toBe('90,000원');
    expect(screen.queryByText('VOD 이용권')).not.toBeInTheDocument();
  });

  it('쿠폰을 적용하면 쿠폰 적용 뒤에 이용권이 더해지고 스토어 totalPrice 와 화면이 같다', () => {
    seed(true);
    render(<PaymentInputPage />);

    fireEvent.click(screen.getByText('일부쿠폰'));

    // (100,000 - 10,000 - 20,000) + 29,000
    expect(payableAmount()).toBe('99,000원');
    expect(useProgramStore.getState().data.totalPrice).toBe(99000);
    expect(useProgramStore.getState().data.price).toBe(100000);
    expect(useProgramStore.getState().data.discount).toBe(10000);
  });

  it('쿠폰 상한·적용 기준 금액에는 이용권이 들어가지 않는다', () => {
    seed(true);
    render(<PaymentInputPage />);

    // 상한 = 베이직 정가 + 보증금 - 할인, 기준 금액 = 정가 - 할인
    expect(screen.getByTestId('coupon-max')).toHaveTextContent('90000');
    expect(screen.getByTestId('coupon-sale')).toHaveTextContent('90000');
  });

  it('전액 쿠폰이어도 이용권 금액이 남아 0원 결제 경로가 아니라 결제 화면으로 간다', async () => {
    seed(true);
    render(<PaymentInputPage />);

    fireEvent.click(screen.getByText('전액쿠폰'));
    expect(payableAmount()).toBe('29,000원');
    expect(useProgramStore.getState().data.totalPrice).toBe(29000);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '결제하기' }));
    });

    expect(pushMock).toHaveBeenCalledWith('/payment');
  });

  it('이용권 없이 전액 쿠폰이면 기존처럼 0원 결제 경로로 간다', async () => {
    seed(false);
    render(<PaymentInputPage />);

    fireEvent.click(screen.getByText('전액쿠폰'));
    expect(payableAmount()).toBe('0원');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '결제하기' }));
    });

    expect(pushMock).toHaveBeenCalledWith('/order/result?orderId=order-1');
  });
});
