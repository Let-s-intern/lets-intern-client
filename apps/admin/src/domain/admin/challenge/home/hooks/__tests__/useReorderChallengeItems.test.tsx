import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReorderChallengeItems } from '../useReorderChallengeItems';

const { putMock, snackbarMock } = vi.hoisted(() => ({
  putMock: vi.fn(),
  snackbarMock: vi.fn(),
}));

vi.mock('@/utils/axios', () => ({ default: { put: putMock } }));
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: snackbarMock }),
}));

const noticeKey = ['challenge', 7, 'notices'] as const;
const guideKey = ['challenge', 7, 'guides'] as const;
const original = [{ id: 1 }, { id: 2 }, { id: 3 }];
const reordered = [{ id: 3 }, { id: 1 }, { id: 2 }];

const setup = (key: readonly unknown[], listKey: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  queryClient.setQueryData(key, { [listKey]: original });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

beforeEach(() => {
  putMock.mockReset();
  snackbarMock.mockReset();
});

describe('useReorderChallengeItems', () => {
  it('공지 순서를 challengeNoticeIdList 로 PUT 한다', async () => {
    putMock.mockResolvedValue({});
    const { wrapper } = setup(noticeKey, 'challengeNoticeList');
    const { result } = renderHook(
      () =>
        useReorderChallengeItems({
          target: 'notice',
          challengeId: 7,
          queryKey: noticeKey,
        }),
      { wrapper },
    );

    await act(() => result.current.mutateAsync(reordered));

    expect(putMock).toHaveBeenCalledTimes(1);
    expect(putMock).toHaveBeenCalledWith('/admin/challenge/7/notice/order', {
      challengeNoticeIdList: [3, 1, 2],
    });
  });

  it('가이드 순서를 challengeGuideIdList 로 PUT 한다', async () => {
    putMock.mockResolvedValue({});
    const { wrapper } = setup(guideKey, 'challengeGuideList');
    const { result } = renderHook(
      () =>
        useReorderChallengeItems({
          target: 'guide',
          challengeId: 7,
          queryKey: guideKey,
        }),
      { wrapper },
    );

    await act(() => result.current.mutateAsync(reordered));

    expect(putMock).toHaveBeenCalledWith('/admin/challenge/7/guide/order', {
      challengeGuideIdList: [3, 1, 2],
    });
  });

  it('PUT 응답 전에 캐시를 새 순서로 바꾼다', async () => {
    putMock.mockReturnValue(new Promise(() => {}));
    const { queryClient, wrapper } = setup(noticeKey, 'challengeNoticeList');
    const { result } = renderHook(
      () =>
        useReorderChallengeItems({
          target: 'notice',
          challengeId: 7,
          queryKey: noticeKey,
        }),
      { wrapper },
    );

    act(() => result.current.mutate(reordered));

    await waitFor(() =>
      expect(queryClient.getQueryData(noticeKey)).toEqual({
        challengeNoticeList: reordered,
      }),
    );
  });

  it('실패하면 원래 순서로 되돌리고 알림을 띄운다', async () => {
    putMock.mockRejectedValue(new Error('400'));
    const { queryClient, wrapper } = setup(noticeKey, 'challengeNoticeList');
    const { result } = renderHook(
      () =>
        useReorderChallengeItems({
          target: 'notice',
          challengeId: 7,
          queryKey: noticeKey,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync(reordered).catch(() => {});
    });

    expect(queryClient.getQueryData(noticeKey)).toEqual({
      challengeNoticeList: original,
    });
    expect(snackbarMock).toHaveBeenCalledTimes(1);
  });

  it('성공하면 목록 쿼리를 무효화한다', async () => {
    putMock.mockResolvedValue({});
    const { queryClient, wrapper } = setup(guideKey, 'challengeGuideList');
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(
      () =>
        useReorderChallengeItems({
          target: 'guide',
          challengeId: 7,
          queryKey: guideKey,
        }),
      { wrapper },
    );

    await act(() => result.current.mutateAsync(reordered));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: guideKey });
  });
});
