import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import {
  FEEDBACK_MENTOR_SLOT_QUERY_KEY,
  useCreateFeedbackMentorSlotsMutation,
  useDeleteFeedbackMentorSlotsMutation,
  useFeedbackDetailQuery,
  useFeedbackMentorSlotsQuery,
} from '../feedback';

// axios 모듈 자체를 모킹 (default export)
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const axiosMock = vi.mocked(axios, true);

function createWrapper(client: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

function newClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

beforeEach(() => {
  axiosMock.get.mockReset();
  axiosMock.post.mockReset();
  axiosMock.delete.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useFeedbackMentorSlotsQuery', () => {
  it('성공 응답을 Zod 로 파싱해 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          feedbackSlotList: [
            {
              feedbackSlotId: 1,
              startDate: '2026-05-20T10:00:00',
              endDate: '2026-05-20T10:30:00',
              status: 'OPEN',
            },
          ],
        },
      },
    });

    const client = newClient();
    const { result } = renderHook(
      () =>
        useFeedbackMentorSlotsQuery({
          startDate: '2026-05-20T00:00:00',
          endDate: '2026-05-26T23:59:59',
          statusList: ['OPEN', 'RESERVED'],
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosMock.get).toHaveBeenCalledWith('/feedback/mentor/slot', {
      params: {
        startDate: '2026-05-20T00:00:00',
        endDate: '2026-05-26T23:59:59',
        statusList: ['OPEN', 'RESERVED'],
      },
    });
    expect(result.current.data?.feedbackSlotList).toHaveLength(1);
    expect(result.current.data?.feedbackSlotList[0].status).toBe('OPEN');
  });

  it('enabled=false 면 axios 를 호출하지 않는다', async () => {
    const client = newClient();
    renderHook(() => useFeedbackMentorSlotsQuery({ enabled: false }), {
      wrapper: createWrapper(client),
    });

    // queryFn 호출 자체가 발생하지 않아야 한다
    await new Promise((r) => setTimeout(r, 10));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          feedbackSlotList: [
            {
              feedbackSlotId: 'not-a-number',
              startDate: '2026-05-20T10:00:00',
              endDate: '2026-05-20T10:30:00',
              status: 'OPEN',
            },
          ],
        },
      },
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackMentorSlotsQuery(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCreateFeedbackMentorSlotsMutation', () => {
  it('성공 시 슬롯 query 를 invalidate 한다', async () => {
    axiosMock.post.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useCreateFeedbackMentorSlotsMutation(),
      { wrapper: createWrapper(client) },
    );

    const payload = [
      { startDate: '2026-05-20T10:00:00', endDate: '2026-05-20T10:30:00' },
    ];

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(axiosMock.post).toHaveBeenCalledWith(
      '/feedback/mentor/slot',
      payload,
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: FEEDBACK_MENTOR_SLOT_QUERY_KEY,
    });
  });
});

describe('useDeleteFeedbackMentorSlotsMutation', () => {
  it('id 배열을 body 로 보내고 invalidate 한다', async () => {
    axiosMock.delete.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useDeleteFeedbackMentorSlotsMutation(),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.mutateAsync([1, 2, 3]);
    });

    expect(axiosMock.delete).toHaveBeenCalledWith('/feedback/mentor/slot', {
      data: [1, 2, 3],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: FEEDBACK_MENTOR_SLOT_QUERY_KEY,
    });
  });
});

describe('useFeedbackDetailQuery', () => {
  it('feedbackId 가 있으면 GET /feedback/{id} 를 호출하고 feedbackInfo 만 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          feedbackInfo: {
            feedbackId: 99,
            startDate: '2026-05-20T11:00:00',
            endDate: '2026-05-20T11:30:00',
            meetingUrl: null,
            status: 'RESERVED',
          },
        },
      },
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackDetailQuery(99), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosMock.get).toHaveBeenCalledWith('/feedback/99');
    expect(result.current.data?.feedbackId).toBe(99);
    expect(result.current.data?.meetingUrl).toBeNull();
  });

  it('feedbackId 가 null 이면 axios 를 호출하지 않는다', async () => {
    const client = newClient();
    renderHook(() => useFeedbackDetailQuery(null), {
      wrapper: createWrapper(client),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  it('feedbackId 가 undefined 면 axios 를 호출하지 않는다', async () => {
    const client = newClient();
    renderHook(() => useFeedbackDetailQuery(undefined), {
      wrapper: createWrapper(client),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          feedbackInfo: {
            feedbackId: 'not-a-number',
            startDate: '2026-05-20T11:00:00',
            endDate: '2026-05-20T11:30:00',
            meetingUrl: null,
            status: 'RESERVED',
          },
        },
      },
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackDetailQuery(5), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
