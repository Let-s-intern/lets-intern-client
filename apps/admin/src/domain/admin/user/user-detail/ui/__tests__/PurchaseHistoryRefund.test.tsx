import type { UserAdminDetail } from '@/schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PurchaseHistorySection from '../PurchaseHistorySection';

const renderSection = (data: UserAdminDetail) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PurchaseHistorySection data={data} />
    </QueryClientProvider>,
  );

vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

const mutate = vi.hoisted(() => vi.fn());
vi.mock('@/api/adminRefund', () => ({
  useAdminRefundMutation: () => ({ mutate, isPending: false }),
}));

// 실제 모달은 이용 이력 조회까지 하므로, 받은 값만 드러내는 대역으로 바꾼다
vi.mock('@/domain/admin/program/program-user/ui/RefundModal', () => ({
  default: ({
    target,
    mode,
    onSubmit,
  }: {
    target: Record<string, unknown>;
    mode: string;
    onSubmit: (body: unknown) => void;
  }) => (
    <div role="dialog">
      <pre data-testid="target">{JSON.stringify({ ...target, mode })}</pre>
      <button onClick={() => onSubmit({ managerName: 'm', reason: 'r' })}>
        환불 실행
      </button>
    </div>
  ),
}));

const data = {
  userInfo: {
    id: '7',
    name: '김유저',
    email: 'u@test.com',
    phoneNum: '010-1111-2222',
  },
  applicationInfo: [],
  applicationDetailInfo: [
    {
      applicationId: 1,
      programType: 'CHALLENGE',
      programTitle: '환불 가능 챌린지',
      programEndDate: '2999-01-01T00:00:00',
      orderId: 'ORD-1',
      couponName: '쿠폰',
      couponDiscount: 1000,
      finalPrice: 50000,
      challengePricePlanType: 'PREMIUM',
      additionalPaidAmount: 7000,
      pendingManualRefundAmount: 2000,
    },
    {
      applicationId: 2,
      programType: 'LIVE',
      programTitle: '환불된 라이브',
      isCanceled: true,
      finalPrice: 30000,
    },
    {
      applicationId: 3,
      programType: 'CHALLENGE',
      programTitle: '0원 챌린지',
      programEndDate: '2999-01-01T00:00:00',
      finalPrice: 0,
    },
    {
      applicationId: 4,
      programType: 'VOD_PASS',
      programTitle: 'VOD 이용권 3개월',
      finalPrice: 90000,
    },
    {
      membershipApplicationId: 9,
      programId: 2,
      programType: 'MEMBERSHIP',
      programTitle: '올인원패스',
      finalPrice: 100000,
    },
  ],
} as unknown as UserAdminDetail;

const rowOf = (title: string) =>
  screen.getByRole('heading', { name: title }).closest('li') as HTMLElement;

describe('구매·참여 이력의 환불 버튼', () => {
  beforeEach(() => mutate.mockClear());

  it('환불 가능한 행에만 환불 버튼이 있다', () => {
    renderSection(data);

    expect(
      within(rowOf('환불 가능 챌린지')).getByRole('button', {
        name: '전체 환불',
      }),
    ).toBeEnabled();
    expect(
      within(rowOf('환불된 라이브')).queryByRole('button', {
        name: '전체 환불',
      }),
    ).not.toBeInTheDocument();
    // 신청 id 가 없는 올인원패스는 이 환불 경로가 아니다
    expect(
      within(rowOf('올인원패스')).queryByRole('button', { name: '전체 환불' }),
    ).not.toBeInTheDocument();
  });

  it('0원 결제는 전체 환불만 가능하다', () => {
    renderSection(data);

    const row = within(rowOf('0원 챌린지'));
    expect(row.getByRole('button', { name: '전체 환불' })).toBeEnabled();
    expect(row.getByRole('button', { name: '부분 환불' })).toBeDisabled();
  });

  it('누르면 행 값으로 만든 RefundTarget 으로 모달이 열린다', () => {
    renderSection(data);

    fireEvent.click(
      within(rowOf('환불 가능 챌린지')).getByRole('button', {
        name: '부분 환불',
      }),
    );

    expect(
      JSON.parse(screen.getByTestId('target').textContent as string),
    ).toMatchObject({
      applicationId: 1,
      name: '김유저',
      email: 'u@test.com',
      phoneNum: '010-1111-2222',
      programTitle: '환불 가능 챌린지',
      orderId: 'ORD-1',
      pricePlanType: 'PREMIUM',
      couponName: '쿠폰',
      couponDiscount: 1000,
      finalPrice: 50000,
      additionalPaidAmount: 7000,
      pendingManualRefundAmount: 2000,
      mode: 'partial',
    });
  });

  it('VOD 이용권은 안내 문구를 채운다', () => {
    renderSection(data);

    fireEvent.click(
      within(rowOf('VOD 이용권 3개월')).getByRole('button', {
        name: '전체 환불',
      }),
    );

    const target = JSON.parse(
      screen.getByTestId('target').textContent as string,
    );
    expect(target.notice).toContain('이용권이 취소되어 시청이 중단됩니다');
    expect(target.pricePlanType).toBeNull();
  });

  it('모달에서 실행하면 신청 id 로 환불을 요청한다', () => {
    renderSection(data);

    fireEvent.click(
      within(rowOf('환불 가능 챌린지')).getByRole('button', {
        name: '전체 환불',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: '환불 실행' }));

    expect(mutate).toHaveBeenCalledWith({
      applicationId: 1,
      body: { managerName: 'm', reason: 'r' },
    });
  });
});
