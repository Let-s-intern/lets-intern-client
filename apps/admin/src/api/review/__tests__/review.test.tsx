import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const getMock = vi.fn();

vi.mock('@/utils/axiosV2', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
  },
}));

import { reviewTypeSchema, useGetAdminProgramReview } from '../review';

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

/**
 * 1:1 라이브 멘토링 후기(LIVE_MENTORING_REVIEW)도 범용 어드민 후기 조회 훅으로 그대로
 * 요청되는지 확인한다. 백엔드는 `GET /api/v2/admin/review/{type}` 하나로 모든 후기 타입을
 * 처리하므로, 프론트 쪽 타입 유니온에 값만 추가되면 별도 분기 없이 동작해야 한다.
 */
describe('reviewTypeSchema', () => {
  it('LIVE_MENTORING_REVIEW 를 유효한 타입으로 허용한다', () => {
    expect(reviewTypeSchema.safeParse('LIVE_MENTORING_REVIEW').success).toBe(
      true,
    );
  });
});

describe('useGetAdminProgramReview', () => {
  it('type=LIVE_MENTORING_REVIEW 로 /admin/review/LIVE_MENTORING_REVIEW 를 요청한다', async () => {
    getMock.mockResolvedValue({
      data: {
        data: {
          reviewList: [],
          pageInfo: { pageNum: 0, pageSize: 20, totalElements: 0, totalPages: 0 },
        },
      },
    });

    const { result } = renderHook(
      () =>
        useGetAdminProgramReview({
          type: 'LIVE_MENTORING_REVIEW',
          page: 0,
          size: 20,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMock).toHaveBeenCalledWith('/admin/review/LIVE_MENTORING_REVIEW', {
      params: { page: 0, size: 20 },
    });
  });
});
