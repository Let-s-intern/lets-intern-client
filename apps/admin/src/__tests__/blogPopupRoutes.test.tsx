import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { render, screen, within } from '@testing-library/react';
import type { RouteObject } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

/**
 * 화면을 다 만들고도 라우트와 메뉴에 붙이지 않으면 운영은 존재를 모른다.
 * 경로 문자열도 함께 못 박는다. 사이드바 링크와 북마크가 같이 깨지기 때문이다.
 */

vi.mock('@/api/blog/blogPopup', () => ({
  useGetAdminBlogPopupList: () => ({
    data: {
      blogPopupList: [],
      pageInfo: { pageNum: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
    },
  }),
  useGetAdminBlogPopup: () => ({ data: undefined }),
  usePostAdminBlogPopup: () => ({ mutateAsync: vi.fn() }),
  usePatchAdminBlogPopup: () => ({ mutateAsync: vi.fn() }),
  useDeleteAdminBlogPopup: () => ({ mutate: vi.fn() }),
}));

vi.mock('@/api/blog/blog', () => ({
  useBlogListQuery: () => ({ data: { blogInfos: [] }, isLoading: false }),
}));

vi.mock('@/api/user/user', () => ({
  useIsAdminQuery: () => ({ data: true, isLoading: false }),
}));

const { router } = await import('../router');
const { AdminSidebar } = await import('../layout/AdminSidebar');

const flatten = (routes: RouteObject[]): RouteObject[] =>
  routes.flatMap((route) => [route, ...flatten(route.children ?? [])]);

const routeOf = (path: string) =>
  flatten(router.routes).find((route) => route.path === path);

/** main.tsx 와 같은 컨텍스트로 감싼다. DateTimePicker 는 이게 없으면 렌더에서 터진다. */
const renderRoute = (path: string) =>
  render(
    <MemoryRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {routeOf(path)?.element}
      </LocalizationProvider>
    </MemoryRouter>,
  );

/** lazy() 라 첫 렌더가 동적 import 를 기다린다. 여기서 보는 것은 속도가 아니라 연결 여부다. */
const LAZY_TIMEOUT = { timeout: 10_000 };

describe('블로그 팝업 라우트', () => {
  it.each(['/blog/popup', '/blog/popup/create', '/blog/popup/edit/:id'])(
    '%s 경로가 등록돼 있다',
    (path) => {
      expect(routeOf(path)).toBeDefined();
    },
  );

  it('목록 경로가 목록 화면을 그린다', async () => {
    renderRoute('/blog/popup');

    expect(
      await screen.findByRole(
        'heading',
        { name: '블로그 팝업 관리' },
        LAZY_TIMEOUT,
      ),
    ).toBeInTheDocument();
  });

  it('등록 경로가 등록 화면을 그린다', async () => {
    renderRoute('/blog/popup/create');

    expect(
      await screen.findByRole(
        'heading',
        { name: '블로그 팝업 등록' },
        LAZY_TIMEOUT,
      ),
    ).toBeInTheDocument();
  });

  it('수정 경로가 수정 화면으로 이어진다', async () => {
    // 상세 조회 전에는 로딩만 그린다. 여기서 보는 것은 경로가 컴포넌트로 이어지는가다.
    renderRoute('/blog/popup/edit/:id');

    expect(
      await screen.findByAltText('로딩 중', undefined, LAZY_TIMEOUT),
    ).toBeInTheDocument();
  });
});

describe('AdminSidebar 블로그 그룹', () => {
  it('블로그 팝업 관리 메뉴가 목록 경로로 이어진다', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>,
    );

    const group = screen
      .getByRole('heading', { name: '블로그' })
      .closest('div')!.parentElement!;

    expect(
      within(group).getByRole('link', { name: '블로그 팝업 관리' }),
    ).toHaveAttribute('href', '/blog/popup');
  });
});
