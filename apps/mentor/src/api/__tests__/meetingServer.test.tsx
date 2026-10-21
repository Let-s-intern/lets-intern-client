import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import { useMeetingServerBaseUrls } from '../meetingServer';

vi.mock('@/utils/axios', () => ({ default: { get: vi.fn() } }));

const getMock = vi.mocked(axios.get);

const respond = (baseUrls: string[]) =>
  getMock.mockResolvedValue({
    data: {
      data: {
        meetingServerList: baseUrls.map((baseUrl, priority) => ({
          baseUrl,
          priority,
        })),
      },
    },
  });

const renderBaseUrls = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useMeetingServerBaseUrls(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
};

beforeEach(() => {
  getMock.mockReset();
});

describe('useMeetingServerBaseUrls', () => {
  it('서버가 준 순서 그대로 base 주소만 돌려준다', async () => {
    respond(['https://a.example.com/', 'https://b.example.com/']);

    const { result } = renderBaseUrls();

    await waitFor(() =>
      expect(result.current.baseUrls).toEqual([
        'https://a.example.com/',
        'https://b.example.com/',
      ]),
    );
    expect(getMock).toHaveBeenCalledWith('/meeting-servers');
  });

  it('입장 직전 loadBaseUrls 는 다시 받아 어드민 변경을 반영한다', async () => {
    respond(['https://a.example.com/']);
    const { result } = renderBaseUrls();
    await waitFor(() =>
      expect(result.current.baseUrls).toEqual(['https://a.example.com/']),
    );

    respond(['https://b.example.com/']);

    await expect(result.current.loadBaseUrls()).resolves.toEqual([
      'https://b.example.com/',
    ]);
  });

  it('받기 전에는 빈 목록이다', () => {
    getMock.mockReturnValue(new Promise(() => {}));

    const { result } = renderBaseUrls();

    expect(result.current.baseUrls).toEqual([]);
  });
});
