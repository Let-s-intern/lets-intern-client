import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const put = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    put: (...args: unknown[]) => put(...args),
  },
}));

import {
  useUpdateVodPassProductMutation,
  useVodPassProductQuery,
  vodPassProductQueryKey,
  vodPassProductSchema,
  vodPassProductUpdateSchema,
} from './vodPassProduct';

const product = {
  vodPassProductId: 1,
  title: 'VOD 이용권',
  price: 49000,
  durationDays: 30,
  isActive: true,
};

const createClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };

afterEach(() => {
  get.mockReset();
  put.mockReset();
});

describe('vodPassProductSchema', () => {
  it('상품 응답을 파싱한다', () => {
    expect(vodPassProductSchema.parse(product)).toEqual(product);
  });

  it('필수 값이 빠지면 거절한다', () => {
    const { durationDays: _durationDays, ...rest } = product;

    expect(() => vodPassProductSchema.parse(rest)).toThrow();
  });
});

describe('vodPassProductUpdateSchema', () => {
  it('양의 정수 두 값을 받는다', () => {
    expect(
      vodPassProductUpdateSchema.parse({ price: 49000, durationDays: 30 }),
    ).toEqual({ price: 49000, durationDays: 30 });
  });

  it.each([
    ['0', 0],
    ['음수', -1],
    ['소수', 1.5],
  ])('가격이 %s 이면 거절한다', (_label, price) => {
    expect(() =>
      vodPassProductUpdateSchema.parse({ price, durationDays: 30 }),
    ).toThrow();
  });

  it.each([
    ['0', 0],
    ['음수', -1],
    ['소수', 0.5],
  ])('이용일수가 %s 이면 거절한다', (_label, durationDays) => {
    expect(() =>
      vodPassProductUpdateSchema.parse({ price: 49000, durationDays }),
    ).toThrow();
  });
});

describe('useVodPassProductQuery', () => {
  it('상품 경로를 조회해 파싱된 값을 돌려준다', async () => {
    get.mockResolvedValue({ data: { data: product } });

    const { result } = renderHook(() => useVodPassProductQuery(), {
      wrapper: createWrapper(createClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/admin/vod-pass-product');
    expect(result.current.data).toEqual(product);
  });
});

describe('useUpdateVodPassProductMutation', () => {
  it('PUT 으로 가격과 이용일수를 보내고 성공하면 조회 쿼리를 무효화한다', async () => {
    put.mockResolvedValue({ data: { data: null } });
    const client = createClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useUpdateVodPassProductMutation({ onSuccess }),
      { wrapper: createWrapper(client) },
    );

    result.current.mutate({ price: 59000, durationDays: 60 });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(put).toHaveBeenCalledWith('/admin/vod-pass-product', {
      price: 59000,
      durationDays: 60,
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: vodPassProductQueryKey,
    });
  });

  it('0 이하·소수 값은 요청을 보내지 않고 실패한다', async () => {
    const onError = vi.fn();

    const { result } = renderHook(
      () => useUpdateVodPassProductMutation({ onError }),
      { wrapper: createWrapper(createClient()) },
    );

    result.current.mutate({ price: 0, durationDays: 30 });

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(put).not.toHaveBeenCalled();
  });

  it('서버 실패는 서버 문구 그대로 onError 에 넘기고 무효화하지 않는다', async () => {
    put.mockRejectedValue(new Error('가격은 1원 이상이어야 합니다.'));
    const client = createClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const onError = vi.fn();

    const { result } = renderHook(
      () => useUpdateVodPassProductMutation({ onError }),
      { wrapper: createWrapper(client) },
    );

    result.current.mutate({ price: 59000, durationDays: 60 });

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith('가격은 1원 이상이어야 합니다.'),
    );
    expect(invalidate).not.toHaveBeenCalled();
  });
});
