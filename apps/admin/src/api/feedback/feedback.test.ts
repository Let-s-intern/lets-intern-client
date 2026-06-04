import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  serializeFeedbackListParams,
  serializeMentorSlotParams,
  useChangeAdminFeedbackSlotMutation,
} from './feedback';

const post = vi.fn();
vi.mock('@/utils/axios', () => ({
  default: {
    post: (...args: unknown[]) => post(...args),
  },
}));

describe('serializeFeedbackListParams', () => {
  it('빈 파라미터는 모두 생략한다', () => {
    expect(serializeFeedbackListParams({})).toEqual({});
  });

  it('빈 배열은 생략한다', () => {
    expect(
      serializeFeedbackListParams({
        challengeIdList: [],
        mentorIdList: [],
        menteeIdList: [],
      }),
    ).toEqual({});
  });

  it('값이 있는 배열·날짜만 직렬화한다', () => {
    const result = serializeFeedbackListParams({
      challengeIdList: [1, 2],
      mentorIdList: [],
      feedbackStartDate: '2026-06-01T00:00:00',
      feedbackEndDate: '2026-06-30T23:59:59',
      createStartDate: '',
    });
    expect(result).toEqual({
      challengeIdList: [1, 2],
      feedbackStartDate: '2026-06-01T00:00:00',
      feedbackEndDate: '2026-06-30T23:59:59',
    });
    expect(result).not.toHaveProperty('mentorIdList');
    expect(result).not.toHaveProperty('createStartDate');
  });

  it('모든 필터를 직렬화한다', () => {
    const result = serializeFeedbackListParams({
      challengeIdList: [1],
      mentorIdList: [2],
      menteeIdList: [3],
      feedbackStartDate: '2026-06-01T00:00:00',
      feedbackEndDate: '2026-06-30T23:59:59',
      createStartDate: '2026-05-01T00:00:00',
      createEndDate: '2026-05-31T23:59:59',
    });
    expect(Object.keys(result)).toHaveLength(7);
  });
});

describe('serializeMentorSlotParams', () => {
  it('빈 파라미터는 생략한다', () => {
    expect(serializeMentorSlotParams({})).toEqual({});
  });

  it('범위와 statusList 를 직렬화한다', () => {
    const result = serializeMentorSlotParams({
      startDate: '2026-06-01T00:00:00',
      endDate: '2026-06-07T23:59:59',
      statusList: ['OPEN', 'RESERVED'],
    });
    expect(result).toEqual({
      startDate: '2026-06-01T00:00:00',
      endDate: '2026-06-07T23:59:59',
      statusList: ['OPEN', 'RESERVED'],
    });
  });

  it('빈 statusList 는 생략한다', () => {
    const result = serializeMentorSlotParams({
      startDate: '2026-06-01T00:00:00',
      statusList: [],
    });
    expect(result).toEqual({ startDate: '2026-06-01T00:00:00' });
  });
});

describe('useChangeAdminFeedbackSlotMutation', () => {
  let queryClient: QueryClient;

  function wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    post.mockReset();
    post.mockResolvedValue({ data: { data: null } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /admin/feedback/{feedbackId}/slot/{feedbackSlotId} 를 호출한다 (바디 없음)', async () => {
    const { result } = renderHook(() => useChangeAdminFeedbackSlotMutation(), {
      wrapper,
    });

    result.current.mutate({
      feedbackId: 1,
      feedbackSlotId: 10107,
      mentorId: 101,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('/admin/feedback/1/slot/10107');
  });

  it('성공 시 목록·상세·변경내역·멘토 슬롯 쿼리를 invalidate 한다', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useChangeAdminFeedbackSlotMutation(), {
      wrapper,
    });

    result.current.mutate({
      feedbackId: 7,
      feedbackSlotId: 10301,
      mentorId: 103,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const invalidatedKeys = invalidateSpy.mock.calls.map(
      ([arg]) => (arg as { queryKey: unknown[] }).queryKey,
    );

    expect(invalidatedKeys).toContainEqual(['adminFeedbackList']);
    expect(invalidatedKeys).toContainEqual(['adminFeedbackDetail', 7]);
    expect(invalidatedKeys).toContainEqual(['adminFeedbackHistory', 7]);
    expect(invalidatedKeys).toContainEqual(['mentorFeedbackSlots', 103]);
  });
});
