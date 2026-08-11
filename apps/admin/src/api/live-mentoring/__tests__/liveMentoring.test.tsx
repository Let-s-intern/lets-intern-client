import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const patchMock = vi.fn().mockResolvedValue({ data: {} });

vi.mock('@/utils/axios', () => ({
  default: {
    patch: (...args: unknown[]) => patchMock(...args),
  },
}));

import * as liveMentoringApi from '../liveMentoring';

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

/**
 * 백엔드 `LiveMentoringV1AdminController` 에는 목록 조회와 강제 종료 두 엔드포인트뿐이다.
 * `approve`/`reject` 훅은 존재하지 않는 PATCH 를 호출하므로 완전히 제거되어야 한다.
 */
describe('liveMentoring API', () => {
  it('승인·반려 훅은 더 이상 export 되지 않는다', () => {
    expect(
      (liveMentoringApi as Record<string, unknown>)
        .useApproveLiveMentoringMutation,
    ).toBeUndefined();
    expect(
      (liveMentoringApi as Record<string, unknown>)
        .useRejectLiveMentoringMutation,
    ).toBeUndefined();
  });

  it('강제 종료 훅은 개설 id 로 close 엔드포인트를 호출한다', async () => {
    const { result } = renderHook(
      () => liveMentoringApi.useCloseLiveMentoringOpeningMutation(),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.mutate(100);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(patchMock).toHaveBeenCalledWith(
      '/admin/live-mentoring/openings/100/close',
    );
  });
});
