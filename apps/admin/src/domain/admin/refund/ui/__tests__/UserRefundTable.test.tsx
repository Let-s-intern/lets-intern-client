import type { UserRefundItem } from '@/api/adminRefund';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import UserRefundTable from '../UserRefundTable';

const refund = (over: Partial<UserRefundItem> = {}): UserRefundItem => ({
  applicationId: 5301,
  paymentId: 9301,
  refundedAt: '2026-08-01T09:12:00',
  paidAt: '2026-07-20T10:00:00',
  programType: 'CHALLENGE',
  programId: 319,
  programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
  userId: 13301,
  userName: '한소희',
  userEmail: 'sohee@example.com',
  refundedAmount: 330000,
  originalAmount: 330000,
  orderId: 'letsMOCK5301',
  paymentKey: 'tviva20260720100000eeee',
  refundType: 'ALL',
  source: 'USER',
  ...over,
});

const renderTable = (refunds: UserRefundItem[]) =>
  render(
    <MemoryRouter>
      <UserRefundTable refunds={refunds} isLoading={false} />
    </MemoryRouter>,
  );

const row = (index = 0) => screen.getAllByRole('row')[index + 1];

describe('UserRefundTable 컬럼', () => {
  it('담당자·사유·상태 컬럼을 두지 않는다', () => {
    // 유저 환불에 존재하지 않는 값이라 빈칸으로 남는다.
    renderTable([refund()]);

    expect(screen.queryByText('담당자')).not.toBeInTheDocument();
    expect(screen.queryByText('사유')).not.toBeInTheDocument();
    expect(screen.queryByText('상태')).not.toBeInTheDocument();
  });

  it('환불액과 원 결제액을 함께 보여준다', () => {
    renderTable([refund({ refundedAmount: 220000, refundScope: 'PARTIAL' })]);

    expect(within(row()).getByText(/220,000원/)).toBeInTheDocument();
    expect(within(row()).getByText('330,000원')).toBeInTheDocument();
  });

  it('이력이 없으면 안내 문구를 보여준다', () => {
    renderTable([]);

    expect(
      screen.getByText('조건에 맞는 환불 이력이 없습니다.'),
    ).toBeInTheDocument();
  });
});

describe('UserRefundTable 환불 범위', () => {
  it('서버가 준 FULL 을 전액으로 표시한다', () => {
    renderTable([refund()]);

    expect(within(row()).getByText('전액')).toBeInTheDocument();
  });

  it('환불액이 원 결제액보다 적으면 부분으로 표시한다', () => {
    // 두 값 모두 기록 시점의 사실이라 화면에서 비교해도 흔들리지 않는다.
    renderTable([refund({ refundedAmount: 220000, originalAmount: 330000 })]);

    expect(within(row()).getByText('부분')).toBeInTheDocument();
  });

  it('규정 비율을 함께 보여준다', () => {
    // 금액만으로는 왜 이 금액인지 되짚을 수 없다.
    renderTable([
      refund({ refundedAmount: 220000, originalAmount: 330000, refundType: 'TWO_THIRD' }),
    ]);

    expect(within(row()).getByText('2/3')).toBeInTheDocument();
  });
});

describe('UserRefundTable 처리경로', () => {
  it('유저 환불은 환불일시를 그대로 보여준다', () => {
    renderTable([refund()]);

    expect(within(row()).getByText('2026-08-01 09:12')).toBeInTheDocument();
    expect(within(row()).getByText('유저 환불')).toBeInTheDocument();
  });

  it('배치 자동환불은 자동 환불로 표시한다', () => {
    // 유저가 직접 취소한 것이 아니다. 같은 라벨로 두면 운영이 오독한다.
    renderTable([refund({ source: 'BATCH' })]);

    expect(within(row()).getByText('자동 환불')).toBeInTheDocument();
  });

  it('환불일시가 없으면 - 로 둔다', () => {
    renderTable([refund({ refundedAt: null })]);

    const cells = within(row()).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('-');
  });

  it('두 처리경로가 한 목록에 함께 보인다', () => {
    renderTable([
      refund(),
      refund({ paymentId: 9302, source: 'BATCH', userName: '오세훈' }),
    ]);

    expect(within(row(0)).getByText('유저 환불')).toBeInTheDocument();
    expect(within(row(1)).getByText('자동 환불')).toBeInTheDocument();
  });
});
