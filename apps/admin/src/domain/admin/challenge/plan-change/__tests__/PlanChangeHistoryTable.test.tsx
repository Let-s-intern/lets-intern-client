import type { PlanChangeLog } from '@/api/planChange';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PlanChangeHistoryTable from '../PlanChangeHistoryTable';

type MutationOptions = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

let mutationOptions: MutationOptions = {};
const mutate = vi.fn();
const snackbar = vi.fn();

// 요청 자체는 훅 테스트가 덮는다. 여기서는 결과를 화면이 어떻게 받는지만 본다.
vi.mock('@/api/planChange', () => ({
  useManualRefundCompleteMutation: (options: MutationOptions) => {
    mutationOptions = options;
    return { mutate, isPending: false };
  },
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar }),
}));

const log = (over: Partial<PlanChangeLog> = {}): PlanChangeLog => ({
  planChangeLogId: 71,
  applicationId: 5001,
  programId: 319,
  programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
  userName: '박서현',
  userEmail: 'seohyun@example.com',
  fromPlan: 'BASIC',
  toPlan: 'PREMIUM',
  calculatedAmount: 100000,
  additionalAmount: 100000,
  hasPaymentKey: false,
  changedBy: '임호정',
  reason: '계좌이체 입금 확인',
  paidAt: null,
  manualRefundedAt: null,
  manualRefundedBy: null,
  createDate: '2026-09-12T14:30:00',
  ...over,
});

const renderTable = (logs: PlanChangeLog[]) =>
  render(<PlanChangeHistoryTable logs={logs} isLoading={false} />);

const row = () => screen.getAllByRole('row')[1];

const openManualRefund = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: '환불 완료' }));
};

beforeEach(() => {
  mutationOptions = {};
  mutate.mockReset();
  snackbar.mockReset();
});

describe('PlanChangeHistoryTable 표시', () => {
  it('변경 전후 플랜을 화살표로 잇는다', () => {
    renderTable([log()]);

    expect(within(row()).getByText('BASIC → PREMIUM')).toBeInTheDocument();
  });

  it('계산값과 수납액을 따로 보여준다', () => {
    // 운영이 수납액을 고칠 수 있다. 둘이 다른 건을 이력에서 가려낼 수 있어야 한다 (D10).
    renderTable([log({ calculatedAmount: 100000, additionalAmount: 80000 })]);

    expect(within(row()).getByText('100,000원')).toBeInTheDocument();
    expect(within(row()).getByText('80,000원')).toBeInTheDocument();
  });

  it('결제 키가 있으면 토스 수납이고 별도 환불할 일이 없다', () => {
    renderTable([log({ hasPaymentKey: true, changedBy: 'USER' })]);

    expect(within(row()).getByText('토스')).toBeInTheDocument();
    expect(within(row()).getByText('-')).toBeInTheDocument();
    expect(within(row()).queryByRole('button')).not.toBeInTheDocument();
  });

  it('환불 완료 기록은 날짜와 담당자로 보여준다', () => {
    renderTable([
      log({
        manualRefundedAt: '2026-09-12T16:00:00',
        manualRefundedBy: '홍길동',
      }),
    ]);

    expect(within(row()).getByText('별도 수납')).toBeInTheDocument();
    expect(within(row()).getByText('완료 9/12 홍길동')).toBeInTheDocument();
  });

  it('이력이 없으면 빈 목록 안내를 보여준다', () => {
    renderTable([]);

    expect(
      screen.getByText('조건에 맞는 플랜 변경 이력이 없습니다.'),
    ).toBeInTheDocument();
  });
});

describe('PlanChangeHistoryTable 환불 완료 기록', () => {
  it('담당자 이름이 비면 확정할 수 없다', async () => {
    // 어드민 계정을 함께 쓰므로 이 이름이 누가 돈을 돌려줬는지의 유일한 기록이다.
    const user = userEvent.setup();
    renderTable([log()]);

    await openManualRefund(user);
    const confirm = screen.getByRole('button', { name: '확정' });
    expect(confirm).toBeDisabled();

    await user.type(screen.getByLabelText('환불 담당자'), '   ');
    expect(confirm).toBeDisabled();
  });

  it('성공하면 입력을 닫고 알린다', async () => {
    const user = userEvent.setup();
    renderTable([log()]);

    await openManualRefund(user);
    await user.type(screen.getByLabelText('환불 담당자'), '홍길동');
    await user.click(screen.getByRole('button', { name: '확정' }));
    act(() => mutationOptions.onSuccess?.());

    expect(snackbar).toHaveBeenCalledWith('환불 완료를 기록했습니다.');
    expect(screen.queryByLabelText('환불 담당자')).not.toBeInTheDocument();
  });

  it('실패하면 서버 문구를 그대로 알리고 입력을 남긴다', async () => {
    const user = userEvent.setup();
    renderTable([log()]);

    await openManualRefund(user);
    await user.type(screen.getByLabelText('환불 담당자'), '홍길동');
    await user.click(screen.getByRole('button', { name: '확정' }));
    act(() => mutationOptions.onError?.('이미 환불 완료로 기록된 건입니다.'));

    expect(snackbar).toHaveBeenCalledWith('이미 환불 완료로 기록된 건입니다.');
    expect(screen.getByLabelText('환불 담당자')).toHaveValue('홍길동');
  });
});
