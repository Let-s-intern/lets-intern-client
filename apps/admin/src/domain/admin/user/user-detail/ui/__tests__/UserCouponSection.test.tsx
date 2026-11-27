import UserDetail from '@/pages/pages/user/UserDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserCouponSection from '../UserCouponSection';

const get = vi.hoisted(() => vi.fn());
vi.mock('@/utils/axios', () => ({ default: { get } }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

const detail = vi.hoisted(() => ({
  userInfo: { id: '7', name: '김유저' },
  applicationInfo: [],
}));
vi.mock('@/api/user/user', () => ({
  useUserDetailAdminQuery: () => ({ data: detail, isLoading: false }),
}));
vi.mock('@/pages/pages/user/PersonalInfo', () => ({ default: () => null }));
vi.mock('@/pages/pages/user/PersonalHistory', () => ({ default: () => null }));
vi.mock('@/pages/pages/user/PersonalExperience', () => ({
  default: () => null,
}));

const coupon = (overrides: Record<string, unknown>) => ({
  couponId: 1,
  couponType: 'EVENT',
  couponProgramTypeList: ['CHALLENGE', 'LIVE_MENTORING'],
  name: '신규 가입 쿠폰',
  discount: 5000,
  discountType: 'AMOUNT',
  time: 3,
  remainTime: 2,
  startDate: '2000-01-01T00:00:00',
  endDate: '2999-12-31T23:59:59',
  registered: true,
  ...overrides,
});

const respond = (payload: unknown) =>
  get.mockResolvedValue({ data: { data: payload } });

const withClient = (ui: React.ReactNode) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {ui}
  </QueryClientProvider>
);

describe('UserCouponSection', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('쿠폰의 할인, 프로그램, 기간, 사용 횟수, 구분을 글자로 보인다', async () => {
    respond({ couponList: [coupon({})] });
    render(withClient(<UserCouponSection userId={7} />));

    expect(await screen.findByText('신규 가입 쿠폰')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/coupon/admin/user/7');
    expect(screen.getByText('5,000원 할인')).toBeInTheDocument();
    expect(screen.getByText('챌린지, 1:1 멘토링')).toBeInTheDocument();
    expect(screen.getByText('2000-01-01 ~ 2999-12-31')).toBeInTheDocument();
    expect(screen.getByText('1회 사용 / 한도 3회')).toBeInTheDocument();
    expect(screen.getByText('등록형')).toBeInTheDocument();
    expect(screen.getByText('사용 가능')).toBeInTheDocument();
  });

  it('소진된 쿠폰은 소진이라는 글자로 표시한다', async () => {
    respond([coupon({ remainTime: 0 })]);
    render(withClient(<UserCouponSection userId={7} />));

    expect(await screen.findByText('소진')).toBeInTheDocument();
    expect(screen.queryByText('사용 가능')).not.toBeInTheDocument();
  });

  it('서버가 소진 여부를 내려주면 그 값을 따른다', async () => {
    respond([coupon({ remainTime: 2, exhausted: true, registered: false })]);
    render(withClient(<UserCouponSection userId={7} />));

    expect(await screen.findByText('소진')).toBeInTheDocument();
    expect(screen.getByText('발급형')).toBeInTheDocument();
  });

  it('전액 무료 쿠폰과 정률 쿠폰, 무제한 쿠폰을 구분해 적는다', async () => {
    respond([
      coupon({ couponId: 1, name: '전액 무료', discount: -1, time: -1 }),
      coupon({
        couponId: 2,
        name: '정률',
        discount: 20,
        discountType: 'RATE',
        time: -1,
      }),
    ]);
    render(withClient(<UserCouponSection userId={7} />));

    expect(
      await screen.findByText('100% 할인 (전액 무료)'),
    ).toBeInTheDocument();
    expect(screen.getByText('20% 할인')).toBeInTheDocument();
    expect(screen.getAllByText('무제한')).toHaveLength(2);
  });

  it('기간 전과 기간 만료도 글자로 표시한다', async () => {
    respond([
      coupon({ couponId: 1, name: '예정', startDate: '2999-01-01T00:00:00' }),
      coupon({
        couponId: 2,
        name: '지난 쿠폰',
        endDate: '2000-01-02T00:00:00',
      }),
    ]);
    render(withClient(<UserCouponSection userId={7} />));

    expect(await screen.findByText('사용 전')).toBeInTheDocument();
    expect(screen.getByText('기간 만료')).toBeInTheDocument();
  });

  it('쿠폰이 없으면 빈 상태를 보인다', async () => {
    respond({ couponList: [] });
    render(withClient(<UserCouponSection userId={7} />));

    expect(
      await screen.findByText('보유한 쿠폰이 없습니다.'),
    ).toBeInTheDocument();
  });

  it('조회에 실패하면 불러오지 못했다고 보인다', async () => {
    get.mockImplementation(async () => {
      throw new Error('404');
    });
    render(withClient(<UserCouponSection userId={7} />));

    expect(
      await screen.findByText('쿠폰을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});

describe('유저 상세의 쿠폰 탭', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('탭을 열기 전에는 조회하지 않고 열면 조회한다', async () => {
    respond({ couponList: [] });
    render(
      withClient(
        <MemoryRouter initialEntries={['/users/7']}>
          <Routes>
            <Route path="/users/:userId" element={<UserDetail />} />
          </Routes>
        </MemoryRouter>,
      ),
    );

    expect(get).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('tab', { name: '쿠폰' }));

    await waitFor(() => expect(get).toHaveBeenCalledTimes(1));
    expect(get).toHaveBeenCalledWith('/coupon/admin/user/7');
  });
});
