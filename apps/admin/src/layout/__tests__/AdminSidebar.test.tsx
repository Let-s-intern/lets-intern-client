import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSidebar } from '../AdminSidebar';

const isAdminQuery = vi.fn();

// 사이드바는 어드민 여부만 확인하고 그린다. 조회 자체는 이 테스트의 관심사가 아니다.
vi.mock('@/api/user/user', () => ({
  useIsAdminQuery: () => isAdminQuery(),
}));

const renderSidebar = () =>
  render(
    <MemoryRouter>
      <AdminSidebar />
    </MemoryRouter>,
  );

/** `히스토리` 제목을 가진 그룹 블록. 다른 그룹의 링크가 섞이지 않게 범위를 좁힌다. */
const historyGroup = () =>
  screen.getByRole('heading', { name: '히스토리' }).closest('div')!
    .parentElement!;

beforeEach(() => {
  isAdminQuery.mockReturnValue({ data: true, isLoading: false });
});

describe('AdminSidebar 히스토리 그룹', () => {
  it('결제 관리 대신 히스토리 그룹을 그린다', () => {
    renderSidebar();

    expect(
      screen.getByRole('heading', { name: '히스토리' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('결제 관리')).not.toBeInTheDocument();
  });

  it('환불 히스토리와 이용 히스토리 두 항목을 둔다', () => {
    renderSidebar();

    const links = within(historyGroup()).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([
      '환불 히스토리',
      '이용 히스토리',
    ]);
  });

  it('환불 히스토리 경로는 /refund-history 그대로다', () => {
    // 경로를 바꾸면 기존 북마크가 깨진다. 회귀를 여기서 잡는다.
    renderSidebar();

    expect(
      within(historyGroup()).getByRole('link', { name: '환불 히스토리' }),
    ).toHaveAttribute('href', '/refund-history');
  });

  it('이용 히스토리 경로는 /usage-history 다', () => {
    renderSidebar();

    expect(
      within(historyGroup()).getByRole('link', { name: '이용 히스토리' }),
    ).toHaveAttribute('href', '/usage-history');
  });
});

/**
 * 화면을 만들어도 메뉴에 없으면 운영은 존재를 모른다 (LC-3208, PRD 6.3).
 */
describe('AdminSidebar SSO 그룹', () => {
  it('리다이렉트 화이트리스트 메뉴가 목록 경로로 이어진다', () => {
    renderSidebar();

    const group = screen
      .getByRole('heading', { name: 'SSO 관리' })
      .closest('div')!.parentElement!;

    expect(
      within(group).getByRole('link', { name: '리다이렉트 화이트리스트' }),
    ).toHaveAttribute('href', '/sso/redirect-whitelist');
  });
});
