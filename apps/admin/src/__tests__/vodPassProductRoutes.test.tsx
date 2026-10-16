import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { RouteObject } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

/**
 * 화면을 다 만들고도 라우트에 붙이지 않아 운영이 접근하지 못하는 일이 잦다.
 * 여기서 보는 것은 **경로가 실제 컴포넌트로 이어지는가** 하나다.
 */

vi.mock('@/api/vodPassProduct', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/vodPassProduct')>()),
  useVodPassProductQuery: () => ({
    data: {
      vodPassProductId: 1,
      title: 'VOD 이용권',
      price: 49000,
      additionalMonthPrice: 10000,
      durationDays: 30,
      isActive: true,
    },
    isLoading: false,
    error: null,
  }),
}));

const { router } = await import('../router');

const flatten = (routes: RouteObject[]): RouteObject[] =>
  routes.flatMap((route) => [route, ...flatten(route.children ?? [])]);

const routeOf = (path: string) =>
  flatten(router.routes).find((route) => route.path === path);

/** 라우트 element 는 `lazy()` 라 첫 렌더가 동적 import 를 기다린다. 대기 시간을 넉넉히 준다. */
const LAZY_TIMEOUT = { timeout: 10_000 };

describe('VOD 이용권 설정 라우트', () => {
  it('설정 경로가 등록돼 있다', () => {
    expect(routeOf('/vod-pass-product')).toBeDefined();
  });

  it('설정 경로가 설정 화면을 그린다', async () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>{routeOf('/vod-pass-product')?.element}</MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole(
        'heading',
        { name: 'VOD 이용권 설정' },
        LAZY_TIMEOUT,
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('기본 가격(원)')).toBeInTheDocument();
  }, 15_000);
});
