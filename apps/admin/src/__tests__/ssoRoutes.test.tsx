import { render, screen } from '@testing-library/react';
import type { RouteObject } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

/**
 * 화면을 다 만들고도 라우트에 붙이지 않아 운영이 접근하지 못하는 일이 잦다.
 * 여기서 보는 것은 **경로가 실제 컴포넌트로 이어지는가** 하나다.
 *
 * 경로 문자열도 함께 못 박는다. 나중에 바꾸면 사이드바 링크와 북마크가 같이 깨진다.
 */

vi.mock('@/api/sso', () => ({
  useSsoRedirectWhitelistListQuery: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
  useToggleSsoRedirectWhitelistActive: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteSsoRedirectWhitelist: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateSsoRedirectWhitelist: () => ({ mutate: vi.fn(), isPending: false }),
}));

const { router } = await import('../router');

const flatten = (routes: RouteObject[]): RouteObject[] =>
  routes.flatMap((route) => [route, ...flatten(route.children ?? [])]);

const routeOf = (path: string) =>
  flatten(router.routes).find((route) => route.path === path);

const renderRoute = (path: string) =>
  render(<MemoryRouter>{routeOf(path)?.element}</MemoryRouter>);

/**
 * 라우트 element 는 `lazy()` 라 첫 렌더가 동적 import 를 기다린다. 전체 스위트를 함께
 * 돌리면 그 import 가 기본 대기 시간(1초)을 넘겨 화면이 아니라 시간이 부족해 실패한다.
 * 여기서 보려는 것은 속도가 아니라 연결 여부라 대기 시간을 넉넉히 준다.
 */
const LAZY_TIMEOUT = { timeout: 10_000 };

describe('SSO 리다이렉트 화이트리스트 라우트', () => {
  it('목록 경로가 등록돼 있다', () => {
    expect(routeOf('/sso/redirect-whitelist')).toBeDefined();
  });

  it('등록 경로가 등록돼 있다', () => {
    expect(routeOf('/sso/redirect-whitelist/new')).toBeDefined();
  });

  it('목록 경로가 목록 화면을 그린다', async () => {
    renderRoute('/sso/redirect-whitelist');

    expect(
      await screen.findByRole(
        'heading',
        { name: 'SSO 리다이렉트 화이트리스트' },
        LAZY_TIMEOUT,
      ),
    ).toBeInTheDocument();
  }, 15_000);

  it('등록 경로가 등록 화면을 그린다', async () => {
    renderRoute('/sso/redirect-whitelist/new');

    expect(
      await screen.findByLabelText(
        '허용 리다이렉트 URL',
        undefined,
        LAZY_TIMEOUT,
      ),
    ).toBeInTheDocument();
  }, 15_000);
});
