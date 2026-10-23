import { render, screen } from '@testing-library/react';
import type { RouteObject } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { navData } from '../layout/AdminSidebar';

/**
 * 경로가 실제 컴포넌트로 이어지는지, 사이드바 링크가 그 경로를 가리키는지 본다.
 * 경로 문자열을 바꾸면 사이드바 링크와 북마크가 같이 깨진다.
 */

vi.mock('@/api/meetingServer', () => ({
  useMeetingServerListQuery: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
  useUpdateMeetingServer: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteMeetingServer: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateMeetingServer: () => ({ mutate: vi.fn(), isPending: false }),
}));

const { router } = await import('../router');

const flatten = (routes: RouteObject[]): RouteObject[] =>
  routes.flatMap((route) => [route, ...flatten(route.children ?? [])]);

const routeOf = (path: string) =>
  flatten(router.routes).find((route) => route.path === path);

const renderRoute = (path: string) =>
  render(<MemoryRouter>{routeOf(path)?.element}</MemoryRouter>);

/** lazy import 를 기다린다. ssoRoutes.test.tsx 와 같은 이유다. */
const LAZY_TIMEOUT = { timeout: 10_000 };

describe('회의 서버 라우트', () => {
  it.each([
    '/meeting-servers',
    '/meeting-servers/new',
    '/meeting-servers/:id/edit',
  ])('%s 경로가 등록돼 있다', (path) => {
    expect(routeOf(path)).toBeDefined();
  });

  it('목록 경로가 목록 화면을 그린다', async () => {
    renderRoute('/meeting-servers');

    expect(
      await screen.findByRole(
        'heading',
        { name: '회의 서버 관리' },
        LAZY_TIMEOUT,
      ),
    ).toBeInTheDocument();
  }, 15_000);

  it('등록 경로가 등록 화면을 그린다', async () => {
    renderRoute('/meeting-servers/new');

    expect(
      await screen.findByLabelText('주소', undefined, LAZY_TIMEOUT),
    ).toBeInTheDocument();
  }, 15_000);

  it('시스템 관리 메뉴가 SSO 와 회의 서버를 함께 담는다', () => {
    const group = navData.find((item) => item.title === '시스템 관리');

    expect(group?.itemList).toEqual([
      { name: 'SSO 리다이렉트 화이트리스트', url: '/sso/redirect-whitelist' },
      { name: '회의 서버 관리', url: '/meeting-servers' },
    ]);
  });
});
