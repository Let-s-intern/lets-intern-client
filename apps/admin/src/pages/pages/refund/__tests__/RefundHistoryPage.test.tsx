import { render, screen } from '@testing-library/react';
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
