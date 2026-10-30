import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const put = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    put: (...args: unknown[]) => put(...args),
  },
}));

import {
  toVodPassSaleKey,
  useUpdateVodPassSaleMutation,
  VOD_PASS_SALE_PROGRAM_TYPES,
} from './vodPassSale';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children);

afterEach(() => {
  put.mockReset();
});

describe('VOD 이용권 판매 유형', () => {
  it('올인원패스(MEMBERSHIP)를 판매 유형에 포함한다', () => {
    expect(VOD_PASS_SALE_PROGRAM_TYPES).toContain('MEMBERSHIP');
  });

  it('올인원패스 판매 키는 유형과 id 로 만든다', () => {
    expect(toVodPassSaleKey('MEMBERSHIP', 3)).toBe('MEMBERSHIP:3');
  });

  it('올인원패스 판매 켜기 요청을 MEMBERSHIP 유형으로 보낸다', async () => {
    put.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useUpdateVodPassSaleMutation(), {
      wrapper,
    });

    result.current.mutate({
      programType: 'MEMBERSHIP',
      programId: 3,
      enabled: true,
    });

    await waitFor(() =>
      expect(put).toHaveBeenCalledWith('/admin/vod-pass-sale', {
        programType: 'MEMBERSHIP',
        programId: 3,
        enabled: true,
      }),
    );
  });
});
