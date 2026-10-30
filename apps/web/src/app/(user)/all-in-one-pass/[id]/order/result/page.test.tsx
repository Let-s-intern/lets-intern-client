import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import MembershipOrderResultPage from './page';

const replaceMock = jest.fn();
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '3' }),
  useRouter: () => ({ replace: replaceMock, push: jest.fn() }),
  useSearchParams: () =>
    new URLSearchParams('orderId=order-1&paymentKey=pk&amount=120000'),
}));

const invalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries }),
}));

jest.mock('@/common/boundary/AsyncBoundary', () => ({
  AsyncBoundary: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

let mockData: Record<string, unknown> = {};
jest.mock('@/domain/all-in-one-pass/store/useMembershipOrderStore', () => ({
  __esModule: true,
  default: () => ({ data: mockData, _hasHydrated: true }),
}));

const postMembershipApplication = jest.fn();
jest.mock('@/domain/all-in-one-pass/api/purchase', () => ({
  postMembershipApplication: (...args: unknown[]) =>
    postMembershipApplication(...args),
  postMembershipExtension: jest.fn(),
}));

const BASE_ORDER = {
  orderType: 'PURCHASE',
  membershipId: 3,
  membershipPlanId: 1,
  passTitle: '올인원패스 3개월',
  price: 100000,
  discount: 10000,
  couponCode: null,
  couponPrice: 0,
  totalPrice: 90000,
  contactEmail: 'a@b.com',
  orderId: 'order-1',
  isFree: false,
  vodPassProductId: null,
  vodPassPrice: null,
  vodPassDurationDays: null,
  vodPassMonths: null,
};

const TOSS_INFO = {
  approvedAt: '2026-10-30T12:00:00+09:00',
  method: '카드',
  receipt: { url: 'https://receipt' },
};

describe('올인원패스 결제 결과 화면의 VOD 이용권', () => {
  beforeEach(() => {
    postMembershipApplication.mockReset();
  });

  it('VOD 를 함께 결제하면 개월 수와 이용 기간을 보여준다', async () => {
    mockData = {
      ...BASE_ORDER,
      totalPrice: 120000,
      vodPassProductId: 7,
      vodPassPrice: 30000,
      vodPassDurationDays: 60,
      vodPassMonths: 2,
    };
    postMembershipApplication.mockResolvedValue({
      data: {
        data: {
          tossInfo: TOSS_INFO,
          vodPass: {
            applicationId: 11,
            paymentId: 12,
            durationDays: 60,
            purchasedMonths: 2,
            status: 'SCHEDULED',
            startsAt: '2026-11-10T12:00:00+09:00',
            endsAt: '2027-01-09T12:00:00+09:00',
          },
          payments: [],
        },
      },
    });

    render(<MembershipOrderResultPage />);

    expect(await screen.findByText('VOD 이용 기간')).toBeTruthy();
    expect(screen.getByText('2026.11.10 ~ 2027.01.09')).toBeTruthy();
    expect(
      screen.getByText('이용 중인 이용권이 끝나면 이어서 시작돼요'),
    ).toBeTruthy();
    expect(screen.getAllByText('VOD 이용권 2개월')).toHaveLength(2);
    expect(screen.getByText('+30,000원')).toBeTruthy();
    expect(postMembershipApplication).toHaveBeenCalledWith(
      3,
      expect.objectContaining({
        amount: '120000',
        paymentKey: 'pk',
        vodPassProductId: 7,
        vodPassMonths: 2,
      }),
    );
  });

  it('VOD 를 담지 않았으면 VOD 정보를 보여주지 않는다', async () => {
    mockData = BASE_ORDER;
    postMembershipApplication.mockResolvedValue({
      data: { data: { tossInfo: TOSS_INFO, vodPass: null, payments: [] } },
    });

    render(<MembershipOrderResultPage />);

    expect(await screen.findByText('영수증 보기')).toBeTruthy();
    expect(screen.queryByText('VOD 이용 기간')).toBeNull();
    expect(screen.queryByText(/VOD 이용권/)).toBeNull();
    expect(postMembershipApplication.mock.calls[0][1]).not.toHaveProperty(
      'vodPassProductId',
    );
  });
});

describe('올인원패스 결제 결과 화면의 거절 안내', () => {
  beforeEach(() => {
    postMembershipApplication.mockReset();
    invalidateQueries.mockReset();
  });

  it('VOD 판매가 꺼져 거절되면 안내하고 신청폼을 다시 받게 한 뒤 랜딩으로 보낸다', async () => {
    mockData = BASE_ORDER;
    postMembershipApplication.mockRejectedValue({
      status: 409,
      code: 'VOD_PASS_SALE_NOT_ENABLED',
    });

    render(<MembershipOrderResultPage />);

    expect(
      await screen.findByText(
        'VOD 이용권 판매가 종료되었어요. VOD 이용권 없이 다시 신청해 주세요',
      ),
    ).toBeTruthy();
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['membershipApplicationForm', 3],
    });
    expect(
      screen.getByRole('link', { name: '다시 결제하기' }).getAttribute('href'),
    ).toBe('/all-in-one-pass/3');
  });

  it('구분할 수 없는 실패는 기존 실패 화면 그대로다', async () => {
    mockData = BASE_ORDER;
    postMembershipApplication.mockRejectedValue(new Error('network'));

    render(<MembershipOrderResultPage />);

    expect(
      (await screen.findByRole('link', { name: '다시 결제하기' })).getAttribute(
        'href',
      ),
    ).toBe('/all-in-one-pass/3/payment-input');
    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
