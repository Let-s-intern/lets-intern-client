import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import axios from '@/utils/axios';
import { useBlogPopupQuery } from './useBlogPopupQuery';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;

function createWrapper(client: QueryClient) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryWrapper';
  return Wrapper;
}

function newClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

function response(blogPopupInfo: unknown) {
  return { data: { data: { blogPopupInfo } } };
}

describe('useBlogPopupQuery', () => {
  beforeEach(() => {
    axiosGet.mockReset();
  });

  it('정상 응답이면 blogPopupInfo 를 그대로 돌려준다', async () => {
    axiosGet.mockResolvedValue(
      response({
        blogPopupId: 7,
        imageUrl: 'https://example.com/popup.png',
        link: 'https://example.com/subscribe',
        triggerRatio: 0.6,
      }),
    );

    const { result } = renderHook(() => useBlogPopupQuery(42), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/blog-popup', {
      params: { blogId: 42 },
    });
    expect(result.current.data).toEqual({
      blogPopupId: 7,
      imageUrl: 'https://example.com/popup.png',
      link: 'https://example.com/subscribe',
      triggerRatio: 0.6,
    });
  });

  it('노출할 팝업이 없으면(blogPopupInfo null) null 을 돌려준다', async () => {
    axiosGet.mockResolvedValue(response(null));

    const { result } = renderHook(() => useBlogPopupQuery(42), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('네트워크 실패는 에러 상태로만 남고 재시도하지 않는다', async () => {
    axiosGet.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useBlogPopupQuery(42), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(axiosGet).toHaveBeenCalledTimes(1);
  });

  it('응답 형태가 계약과 다르면 에러로 처리하고 데이터를 만들어내지 않는다', async () => {
    axiosGet.mockResolvedValue(response({ blogPopupId: '7' }));

    const { result } = renderHook(() => useBlogPopupQuery(42), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
