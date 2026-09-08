import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import axiosV2 from '@/utils/axiosV2';

import { useCreateLiveMentoringReviewMutation } from './review';

// review.ts 가 axios/axiosV2/@letscareer/api 를 임포트 그래프로 물고 있다.
// 그 중 `@letscareer/api`(packages/api)는 import.meta 를 쓰는 실제 모듈이라
// 모킹하지 않으면 jest 변환 단계에서 SyntaxError 로 죽는다.
jest.mock('@letscareer/api', () => ({
  createDefaultAxios: jest.fn(() => ({})),
  createV2Axios: jest.fn(() => ({})),
  fetchJson: jest.fn(),
}));
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

const axiosPost = axiosV2.post as jest.Mock;

function newClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

function createWrapper(client: QueryClient) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryWrapper';
  return Wrapper;
}

beforeEach(() => {
  axiosPost.mockReset();
});

describe('useCreateLiveMentoringReviewMutation', () => {
  it('applicationId 쿼리파라미터와 LIVE_MENTORING_REVIEW 바디로 POST 한다', async () => {
    axiosPost.mockResolvedValue({ data: { data: null } });

    const { result } = renderHook(
      () => useCreateLiveMentoringReviewMutation(42),
      { wrapper: createWrapper(newClient()) },
    );

    result.current.mutate({ score: 5, content: '많은 도움이 됐어요.' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosPost).toHaveBeenCalledWith('/review?applicationId=42', {
      type: 'LIVE_MENTORING_REVIEW',
      score: 5,
      content: '많은 도움이 됐어요.',
    });
  });

  it('npsScore·reviewItemList는 바디에 실지 않는다', async () => {
    axiosPost.mockResolvedValue({ data: { data: null } });

    const { result } = renderHook(
      () => useCreateLiveMentoringReviewMutation(1),
      { wrapper: createWrapper(newClient()) },
    );

    result.current.mutate({ score: 4, content: '좋았습니다.' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const body = axiosPost.mock.calls[0][1];
    expect(body).not.toHaveProperty('npsScore');
    expect(body).not.toHaveProperty('reviewItemList');
  });
});
