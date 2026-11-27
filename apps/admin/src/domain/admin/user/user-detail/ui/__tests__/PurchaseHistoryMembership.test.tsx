import { UseUserDetailAdminQueryKey } from '@/api/user/user';
import type { UserAdminDetail } from '@/schema';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PurchaseHistorySection from '../PurchaseHistorySection';

vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));
vi.mock('@/api/adminRefund', () => ({
  useAdminRefundMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

const revoke = vi.hoisted(() => vi.fn());
const passIdOfHook = vi.hoisted(() => vi.fn());
vi.mock('@/api/all-in-one-pass/useParticipants', () => ({
  useRevokeParticipantMutation: (passId?: number) => {
    passIdOfHook(passId);
    return { mutate: revoke, isPending: false };
  },
}));

const snackbar = vi.hoisted(() => vi.fn());
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar }),
}));

const data = {
  userInfo: { id: '7', name: '김유저', email: 'u@test.com', phoneNum: '010' },
  applicationInfo: [],
  applicationDetailInfo: [
    {
      membershipApplicationId: 9,
      programId: 2,
      programType: 'MEMBERSHIP',
      programTitle: '올인원패스 12개월',
      programEndDate: '2999-01-01T00:00:00',
      finalPrice: 100000,
    },
    {
      membershipApplicationId: 8,
      programId: 2,
      programType: 'MEMBERSHIP',
      programTitle: '이미 처리된 올인원패스',
      isCanceled: true,
      finalPrice: 100000,
    },
  ],
} as unknown as UserAdminDetail;

const renderSection = () => {
  const queryClient = new QueryClient();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  render(
    <QueryClientProvider client={queryClient}>
      <PurchaseHistorySection data={data} />
    </QueryClientProvider>,
  );
  return { invalidate };
};

const rowOf = (title: string) =>
  screen.getByRole('heading', { name: title }).closest('li') as HTMLElement;

describe('올인원패스 수동 환불', () => {
  beforeEach(() => {
    revoke.mockClear();
    snackbar.mockClear();
  });

  it('처리되지 않은 건에만 이용 권한 회수 버튼이 있고 일반 환불 버튼은 없다', () => {
    renderSection();

    const open = within(rowOf('올인원패스 12개월'));
    expect(
      open.getByRole('button', { name: '이용 권한 회수(수동 환불)' }),
    ).toBeInTheDocument();
    expect(
      open.queryByRole('button', { name: '전체 환불' }),
    ).not.toBeInTheDocument();

    expect(
      within(rowOf('이미 처리된 올인원패스')).queryByRole('button'),
    ).not.toBeInTheDocument();
  });

  it('확인 창에 토스 수동 환불 안내를 그대로 보인다', () => {
    renderSection();

    fireEvent.click(
      screen.getByRole('button', { name: '이용 권한 회수(수동 환불)' }),
    );

    expect(
      screen.getByText(
        /이용 권한을 회수하고 환불 표시만 합니다\. 결제 금액의 실제 환불은 토스에서 따로 처리해야 합니다/,
      ),
    ).toBeInTheDocument();
    expect(revoke).not.toHaveBeenCalled();
  });

  it('확인하면 멤버십 id 로 권한을 회수하고 성공 뒤 유저 상세를 무효화한다', () => {
    const { invalidate } = renderSection();

    fireEvent.click(
      screen.getByRole('button', { name: '이용 권한 회수(수동 환불)' }),
    );
    fireEvent.click(screen.getByRole('button', { name: '이용 권한 회수' }));

    expect(passIdOfHook).toHaveBeenLastCalledWith(2);
    expect(revoke).toHaveBeenCalledWith(9, expect.any(Object));
    expect(invalidate).not.toHaveBeenCalled();

    revoke.mock.calls[0][1].onSuccess();

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [UseUserDetailAdminQueryKey],
    });
    expect(snackbar).toHaveBeenCalledWith('이용 권한을 회수했습니다.');
  });
});
