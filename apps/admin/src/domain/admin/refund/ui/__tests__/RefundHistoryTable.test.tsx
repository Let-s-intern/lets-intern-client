import type { AdminRefundLog } from '@/api/adminRefund';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import RefundHistoryTable from '../RefundHistoryTable';

const log = (over: Partial<AdminRefundLog> = {}): AdminRefundLog => ({
  id: 1,
  refundedAt: '2026-08-03T15:20:00',
  programType: 'CHALLENGE',
  programId: 319,
  programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
  userId: 13023,
  userName: '김채원',
  userEmail: 'chaewon@example.com',
  managerName: '임호정',
  refundedAmount: 330000,
  reason: '프로그램 오결제',
  status: 'SUCCESS',
  failureMessage: null,
  applicationId: 5003,
  orderId: 'letsMOCK5003',
  paymentKey: 'tviva20260720100000aaaa',
  originalAmount: 330000,
  paidAt: '2026-07-20T10:00:00',
  couponName: null,
  couponDiscount: null,
  isDeleted: false,
  ...over,
});

const renderTable = (logs: AdminRefundLog[]) =>
  render(
    <MemoryRouter>
      <RefundHistoryTable logs={logs} isLoading={false} />
    </MemoryRouter>,
  );

const row = () => screen.getAllByRole('row')[1];

describe('RefundHistoryTable 금액 표시', () => {
  it('환불액과 원 결제액이 같으면 전액 배지를 붙인다', () => {
    renderTable([log()]);

    expect(within(row()).getByText('전액')).toBeInTheDocument();
  });

  it('환불액이 원 결제액보다 작으면 부분 배지를 붙인다', () => {
    renderTable([log({ refundedAmount: 220000, originalAmount: 330000 })]);

    expect(within(row()).getByText('부분')).toBeInTheDocument();
  });

  it('원 결제액을 컬럼으로 함께 보여준다', () => {
    // 부분일 때 비교 대상이 있어야 금액이 의미를 갖는다.
    renderTable([log({ refundedAmount: 220000, originalAmount: 330000 })]);

    expect(screen.getByText('원 결제액')).toBeInTheDocument();
    expect(within(row()).getByText('330,000원')).toBeInTheDocument();
    expect(within(row()).getByText(/220,000원/)).toBeInTheDocument();
  });

  it('원 결제액을 모르는 과거 이력은 배지를 붙이지 않는다', () => {
    renderTable([log({ originalAmount: null })]);

    expect(within(row()).queryByText('전액')).not.toBeInTheDocument();
    expect(within(row()).queryByText('부분')).not.toBeInTheDocument();
  });

  it('실패한 건은 배지를 붙이지 않는다', () => {
    // 돈이 나가지 않았는데 환불액 0 을 부분으로 읽으면 이력이 잘못 보인다.
    renderTable([
      log({ status: 'FAILED', refundedAmount: 0, originalAmount: 330000 }),
    ]);

    expect(within(row()).queryByText('부분')).not.toBeInTheDocument();
  });
});

describe('RefundHistoryTable 삭제 표시', () => {
  it('삭제된 건은 삭제됨 배지를 붙인다', () => {
    renderTable([log({ isDeleted: true })]);

    expect(within(row()).getByText('삭제됨')).toBeInTheDocument();
  });

  it('삭제하지 않은 건에는 배지가 없다', () => {
    renderTable([log()]);

    expect(within(row()).queryByText('삭제됨')).not.toBeInTheDocument();
  });
});
