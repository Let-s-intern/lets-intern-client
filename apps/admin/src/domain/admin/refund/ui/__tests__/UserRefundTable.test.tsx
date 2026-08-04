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
  refundScope: 'FULL',
  refundSource: 'USER',
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

  it('서버가 준 PARTIAL 을 부분으로 표시한다', () => {
    // 금액을 다시 비교하지 않는다. 판별은 서버 한 곳에서만 한다.
    renderTable([
      refund({
        refundScope: 'PARTIAL',
        refundedAmount: 330000,
        originalAmount: 330000,
      }),
    ]);

    expect(within(row()).getByText('부분')).toBeInTheDocument();
  });
});

describe('UserRefundTable 처리경로', () => {
  it('유저 환불은 환불일시를 그대로 보여준다', () => {
    renderTable([refund()]);

    expect(within(row()).getByText('2026-08-01 09:12')).toBeInTheDocument();
    expect(within(row()).getByText('유저 환불')).toBeInTheDocument();
  });

  it('SQL 환불은 환불일시를 - 로 둔다', () => {
    // payment.lastModifiedDate 가 결제 시각과 사실상 같아 환불 시각이 아니다.
    // 시각 칸에 "SQL 환불"이라고 쓰면 시각을 기대하고 보는 눈에 걸린다.
    renderTable([refund({ refundSource: 'SQL' })]);

    const cells = within(row()).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('-');
    expect(within(row()).getByText('SQL 환불')).toBeInTheDocument();
  });

  it('두 처리경로가 한 목록에 함께 보인다', () => {
    renderTable([
      refund(),
      refund({ paymentId: 9302, refundSource: 'SQL', userName: '오세훈' }),
    ]);

    expect(within(row(0)).getByText('유저 환불')).toBeInTheDocument();
    expect(within(row(1)).getByText('SQL 환불')).toBeInTheDocument();
  });
});
