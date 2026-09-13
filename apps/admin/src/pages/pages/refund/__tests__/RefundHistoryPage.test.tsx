import type { PlanChangeLog } from '@/api/planChange';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RefundHistoryPage from '../RefundHistoryPage';

const adminQuery = vi.fn();
const userQuery = vi.fn();

// 탭 전환만 확인한다. 조회는 각 훅의 스키마 테스트가 따로 덮는다.
vi.mock('@/api/adminRefund', () => ({
  useAdminRefundHistoryQuery: (...args: unknown[]) => adminQuery(...args),
  useUserRefundHistoryQuery: (...args: unknown[]) => userQuery(...args),
}));

const planChangeQuery = vi.fn();
const manualRefundMutate = vi.fn();

vi.mock('@/api/planChange', () => ({
  usePlanChangeHistoryQuery: (...args: unknown[]) => planChangeQuery(...args),
  useManualRefundCompleteMutation: () => ({
    mutate: manualRefundMutate,
    isPending: false,
  }),
}));

/** 새로고침 후에도 같은 탭이 뜨는지 보기 위해 URL 을 그대로 읽는다. */
const UrlProbe = () => {
  const [searchParams] = useSearchParams();
  return <div data-testid="tab-param">{searchParams.get('tab') ?? ''}</div>;
};

const renderPage = (initialUrl = '/admin/refund-history') =>
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <RefundHistoryPage />
      <UrlProbe />
    </MemoryRouter>,
  );

const tabParam = () => screen.getByTestId('tab-param').textContent;

beforeEach(() => {
  adminQuery.mockReturnValue({ data: undefined, isLoading: false });
  userQuery.mockReturnValue({ data: undefined, isLoading: false });
  planChangeQuery.mockReset();
  planChangeQuery.mockReturnValue({ data: undefined, isLoading: false });
  manualRefundMutate.mockReset();
});

describe('RefundHistoryPage 탭', () => {
  it('기본은 어드민 주도 환불 탭이다', () => {
    renderPage();

    expect(
      screen.getByText(/어드민에서 실행한 환불입니다/),
    ).toBeInTheDocument();
    expect(adminQuery).toHaveBeenCalled();
    expect(userQuery).not.toHaveBeenCalled();
  });

  it('탭을 바꾸면 URL 에 남는다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: '유저 환불' }));

    expect(tabParam()).toBe('user');
    expect(userQuery).toHaveBeenCalled();
  });

  it('URL 의 탭을 그대로 연다', () => {
    // 새로고침해도 보던 탭이 유지된다.
    renderPage('/admin/refund-history?tab=user');

    expect(
      screen.getByText(/유저가 직접 신청한 환불입니다/),
    ).toBeInTheDocument();
    expect(userQuery).toHaveBeenCalled();
  });

  it('알 수 없는 탭 값은 어드민 탭으로 떨어진다', () => {
    renderPage('/admin/refund-history?tab=unknown');

    expect(
      screen.getByText(/어드민에서 실행한 환불입니다/),
    ).toBeInTheDocument();
  });

  it('배치 자동환불이 섞인다는 사실을 유저 탭에서 밝힌다', () => {
    // 서버가 구분할 단서가 없어 유저 환불로 분류된다. 라벨만으로는 오독한다.
    renderPage('/admin/refund-history?tab=user');

    expect(
      screen.getByText(
        /리포트 배치 자동환불과 수동 SQL 처리 건이 함께 표시됩니다/,
      ),
    ).toBeInTheDocument();
  });
});

describe('RefundHistoryPage 필터', () => {
  it('유저 탭에는 담당자·상태 필터를 두지 않는다', () => {
    renderPage('/admin/refund-history?tab=user');

    expect(screen.queryByText('담당자')).not.toBeInTheDocument();
    expect(screen.queryByText('상태')).not.toBeInTheDocument();
    expect(screen.getByText('참여자')).toBeInTheDocument();
  });

  it('어드민 탭에는 담당자·상태 필터가 있다', () => {
    renderPage();

    expect(screen.getByText('담당자')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
  });
});

const planChangeLog = (over: Partial<PlanChangeLog> = {}): PlanChangeLog => ({
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

const withPlanChangeLogs = (logs: PlanChangeLog[]) =>
  planChangeQuery.mockReturnValue({
    data: {
      planChangeLogList: logs,
      pageInfo: {
        pageNum: 0,
        pageSize: 20,
        totalElements: logs.length,
        totalPages: 1,
      },
    },
    isLoading: false,
  });

const PLAN_CHANGE_URL = '/admin/refund-history?tab=plan-change';

describe('RefundHistoryPage 플랜 변경', () => {
  it('플랜 변경 탭을 열면 이력을 조회하고 URL 에 남긴다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: '플랜 변경' }));

    expect(tabParam()).toBe('plan-change');
    expect(planChangeQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 0, size: 20 }),
    );
  });

  it('플랜 변경 목록을 보여준다', () => {
    // 위 기본 설정은 호출 기록을 지우지 않는다. 이 탭만 조회하는지 보려면 비워 둔다.
    adminQuery.mockClear();
    withPlanChangeLogs([planChangeLog()]);
    renderPage(PLAN_CHANGE_URL);

    expect(screen.getByText('BASIC → PREMIUM')).toBeInTheDocument();
    expect(adminQuery).not.toHaveBeenCalled();
  });

  it('별도 환불 대기만 보기를 요청 조건에 싣는다', async () => {
    const user = userEvent.setup();
    renderPage(PLAN_CHANGE_URL);

    await user.click(screen.getByLabelText('별도 환불 대기만'));
    expect(planChangeQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ pendingManualRefundOnly: true, page: 0 }),
    );

    await user.click(screen.getByLabelText('별도 환불 대기만'));
    expect(planChangeQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ pendingManualRefundOnly: undefined }),
    );
  });

  it('별도 수납이고 환불 완료 전인 건에만 환불 완료 버튼을 둔다', () => {
    // 결제 키가 있는 차액은 환불할 때 시스템이 함께 취소한다 (D12).
    withPlanChangeLogs([
      planChangeLog({ planChangeLogId: 1, hasPaymentKey: true }),
      planChangeLog({ planChangeLogId: 2 }),
      planChangeLog({
        planChangeLogId: 3,
        manualRefundedAt: '2026-09-12T16:00:00',
        manualRefundedBy: '홍길동',
      }),
    ]);
    renderPage(PLAN_CHANGE_URL);

    const [, tossRow, pendingRow, doneRow] = screen.getAllByRole('row');

    expect(within(tossRow).queryByRole('button')).not.toBeInTheDocument();
    expect(
      within(pendingRow).getByRole('button', { name: '환불 완료' }),
    ).toBeInTheDocument();
    expect(within(doneRow).queryByRole('button')).not.toBeInTheDocument();
    expect(within(doneRow).getByText('완료 9/12 홍길동')).toBeInTheDocument();
  });

  it('담당자 이름을 적어 환불 완료를 요청한다', async () => {
    const user = userEvent.setup();
    withPlanChangeLogs([planChangeLog()]);
    renderPage(PLAN_CHANGE_URL);

    await user.click(screen.getByRole('button', { name: '환불 완료' }));
    await user.type(screen.getByLabelText('환불 담당자'), ' 홍길동 ');
    await user.click(screen.getByRole('button', { name: '확정' }));

    expect(manualRefundMutate).toHaveBeenCalledWith({
      planChangeLogId: 71,
      challengeId: 319,
      body: { managerName: '홍길동' },
    });
  });
});
