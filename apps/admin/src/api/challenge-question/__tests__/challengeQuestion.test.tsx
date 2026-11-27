import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CHALLENGE_QUESTIONS_QUERY_KEY,
  useAllChallengeQuestionsQuery,
} from '../challengeQuestion';

const get = vi.hoisted(() => vi.fn());
vi.mock('@/utils/axiosV2', () => ({ default: { get } }));

const emptyResponse = {
  data: {
    data: {
      questionList: [],
      pageInfo: { totalElements: 0, totalPages: 0, pageNum: 0, pageSize: 20 },
    },
  },
};

const setup = (
  options: Parameters<typeof useAllChallengeQuestionsQuery>[0],
) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const rendered = renderHook(() => useAllChallengeQuestionsQuery(options), {
    wrapper,
  });
  return { queryClient, ...rendered };
};

describe('useAllChallengeQuestionsQuery', () => {
  beforeEach(() => {
    get.mockReset();
    get.mockResolvedValue(emptyResponse);
  });

  it('userId 를 주면 요청 파라미터와 쿼리 키에 넣는다', async () => {
    const { queryClient, result } = setup({ page: 1, size: 20, userId: 7 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(get).toHaveBeenCalledWith('/admin/challenge/questions', {
      params: { answerStatus: undefined, page: 0, size: 20, userId: 7 },
    });
    expect(queryClient.getQueryCache().getAll()[0].queryKey).toEqual([
      CHALLENGE_QUESTIONS_QUERY_KEY,
      'all',
      undefined,
      1,
      20,
      7,
    ]);
  });

  it('userId 가 없으면 전체 조회로 userId 파라미터가 비어 있다', async () => {
    const { queryClient, result } = setup({ page: 2, size: 20 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(get.mock.calls[0][1].params.userId).toBeUndefined();
    expect(get.mock.calls[0][1].params.page).toBe(1);
    expect(queryClient.getQueryCache().getAll()[0].queryKey).toEqual([
      CHALLENGE_QUESTIONS_QUERY_KEY,
      'all',
      undefined,
      2,
      20,
      undefined,
    ]);
  });

  it('유저가 다르면 다른 캐시 항목을 쓴다', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const first = renderHook(
      () => useAllChallengeQuestionsQuery({ page: 1, size: 20, userId: 7 }),
      { wrapper },
    );
    const second = renderHook(
      () => useAllChallengeQuestionsQuery({ page: 1, size: 20, userId: 8 }),
      { wrapper },
    );
    await waitFor(() => {
      expect(first.result.current.isSuccess).toBe(true);
      expect(second.result.current.isSuccess).toBe(true);
    });

    expect(queryClient.getQueryCache().getAll()).toHaveLength(2);
    expect(get).toHaveBeenCalledTimes(2);
  });
});
