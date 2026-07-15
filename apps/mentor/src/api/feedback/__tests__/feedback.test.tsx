import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import {
  FEEDBACK_MENTOR_QUERY_KEY,
  FEEDBACK_MENTOR_SLOT_QUERY_KEY,
  useCreateFeedbackMentorSlotsMutation,
  useDeleteFeedbackMentorSlotsMutation,
  useFeedbackDetailQuery,
  useFeedbackMentorDetailQuery,
  useFeedbackMentorListQuery,
  useFeedbackMentorListWithAttendance,
  useFeedbackMentorSlotsQuery,
  useUpdateFeedbackByMentorMutation,
} from '../feedback';

// axios 모듈 자체를 모킹 (default export)
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const axiosMock = vi.mocked(axios, true);

function makeMentorFeedback(overrides: Record<string, unknown> = {}) {
  return {
    feedbackId: 1,
    startDate: '2026-05-20T10:00:00',
    endDate: '2026-05-20T10:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    menteeName: '이지수',
    ...overrides,
  };
}

function makeMentorDetail(overrides: Record<string, unknown> = {}) {
  return {
    feedbackId: 1,
    startDate: '2026-05-20T10:00:00',
    endDate: '2026-05-20T10:30:00',
    meetingUrl: null,
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    attendanceUrl: 'https://example.com/submission/1',
    attendanceStatus: 'PRESENT',
    menteeName: '이지수',
    menteeWishField: '기획 / PM / PO',
    menteeWishIndustry: 'IT · 플랫폼',
    menteeWishCompany: 'Toss',
    preQuestion: '자기소개서 피드백을 받고 싶습니다.',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    ...overrides,
  };
}

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
  axiosMock.patch.mockReset();
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

describe('useFeedbackMentorListQuery', () => {
  it('GET /feedback/mentor 를 호출하고 feedbackList 만 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: { data: { feedbackList: [makeMentorFeedback()] } },
    });

    const client = newClient();
    const { result } = renderHook(
      () =>
        useFeedbackMentorListQuery({
          startDate: '2026-05-20T00:00:00',
          endDate: '2026-05-26T23:59:59',
          statusList: ['RESERVED', 'COMPLETED'],
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosMock.get).toHaveBeenCalledWith('/feedback/mentor', {
      params: {
        startDate: '2026-05-20T00:00:00',
        endDate: '2026-05-26T23:59:59',
        statusList: ['RESERVED', 'COMPLETED'],
      },
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].menteeName).toBe('이지수');
  });

  it('enabled=false 면 axios 를 호출하지 않는다', async () => {
    const client = newClient();
    renderHook(() => useFeedbackMentorListQuery({ enabled: false }), {
      wrapper: createWrapper(client),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: { feedbackList: [makeMentorFeedback({ feedbackId: 'x' })] },
      },
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackMentorListQuery(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useFeedbackMentorDetailQuery', () => {
  it('GET /feedback/mentor/{id} 를 호출하고 feedbackInfo 만 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: { data: { feedbackInfo: makeMentorDetail({ feedbackId: 42 }) } },
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackMentorDetailQuery(42), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosMock.get).toHaveBeenCalledWith('/feedback/mentor/42');
    expect(result.current.data?.feedbackId).toBe(42);
    expect(result.current.data?.attendanceUrl).toBe(
      'https://example.com/submission/1',
    );
  });

  it('feedbackId 가 null 이면 axios 를 호출하지 않는다', async () => {
    const client = newClient();
    renderHook(() => useFeedbackMentorDetailQuery(null), {
      wrapper: createWrapper(client),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });
});

describe('useFeedbackMentorListWithAttendance', () => {
  it('목록 각 건에 상세 attendanceStatus 를 병합한다', async () => {
    axiosMock.get.mockImplementation((url: string) => {
      if (url === '/feedback/mentor') {
        return Promise.resolve({
          data: {
            data: {
              feedbackList: [
                makeMentorFeedback({ feedbackId: 1 }),
                makeMentorFeedback({ feedbackId: 2, menteeName: '박민수' }),
              ],
            },
          },
        });
      }
      if (url === '/feedback/mentor/1') {
        return Promise.resolve({
          data: {
            data: {
              feedbackInfo: makeMentorDetail({
                feedbackId: 1,
                attendanceStatus: 'PRESENT',
              }),
            },
          },
        });
      }
      if (url === '/feedback/mentor/2') {
        return Promise.resolve({
          data: {
            data: {
              feedbackInfo: makeMentorDetail({
                feedbackId: 2,
                attendanceStatus: 'ABSENT',
              }),
            },
          },
        });
      }
      return Promise.reject(new Error(`unexpected url: ${url}`));
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackMentorListWithAttendance(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].attendanceStatus).toBe('PRESENT');
      expect(result.current.data?.[1].attendanceStatus).toBe('ABSENT');
    });
    // 목록 필드는 그대로 보존
    expect(result.current.data?.[1].menteeName).toBe('박민수');
  });

  it('상세 조회가 실패해도 목록은 유지되고 attendanceStatus 만 undefined 로 남는다', async () => {
    axiosMock.get.mockImplementation((url: string) => {
      if (url === '/feedback/mentor') {
        return Promise.resolve({
          data: {
            data: { feedbackList: [makeMentorFeedback({ feedbackId: 1 })] },
          },
        });
      }
      return Promise.reject(new Error('detail failed'));
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackMentorListWithAttendance(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(result.current.isError).toBe(false);
    expect(result.current.data?.[0].attendanceStatus).toBeUndefined();
  });

  it('enabled=false 면 목록·상세 모두 호출하지 않는다', async () => {
    const client = newClient();
    renderHook(() => useFeedbackMentorListWithAttendance({ enabled: false }), {
      wrapper: createWrapper(client),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  // 2.4.T1 — N+1 성능 가드: 대량 목록에서 feedbackId당 상세 1회, 중복 없음.
  it('대량 목록(30건)에서 feedbackId당 상세를 1회만 조회한다(중복 없음)', async () => {
    const list = Array.from({ length: 30 }, (_, i) =>
      makeMentorFeedback({ feedbackId: i + 1 }),
    );
    axiosMock.get.mockImplementation((url: string) => {
      if (url === '/feedback/mentor') {
        return Promise.resolve({ data: { data: { feedbackList: list } } });
      }
      const match = url.match(/^\/feedback\/mentor\/(\d+)$/);
      if (match) {
        return Promise.resolve({
          data: {
            data: {
              feedbackInfo: makeMentorDetail({
                feedbackId: Number(match[1]),
                attendanceStatus: 'PRESENT',
              }),
            },
          },
        });
      }
      return Promise.reject(new Error(`unexpected url: ${url}`));
    });

    const client = newClient();
    const { result } = renderHook(() => useFeedbackMentorListWithAttendance(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() =>
      expect(
        result.current.data?.every((d) => d.attendanceStatus === 'PRESENT'),
      ).toBe(true),
    );

    const detailCalls = axiosMock.get.mock.calls
      .map(([url]) => url as string)
      .filter((url) => /^\/feedback\/mentor\/\d+$/.test(url));
    const uniqueDetailUrls = new Set(detailCalls);
    // 30개 feedbackId 각각 정확히 1회 → 총 30회, 중복 없음.
    expect(detailCalls).toHaveLength(30);
    expect(uniqueDetailUrls.size).toBe(30);
  });
});

describe('useUpdateFeedbackByMentorMutation', () => {
  it('PATCH /feedback/mentor/{id} 에 menteeStatus 를 보내고 invalidate 한다', async () => {
    axiosMock.patch.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateFeedbackByMentorMutation(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      await result.current.mutateAsync({
        feedbackId: 7,
        menteeStatus: 'PRESENT',
      });
    });

    expect(axiosMock.patch).toHaveBeenCalledWith('/feedback/mentor/7', {
      menteeStatus: 'PRESENT',
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: FEEDBACK_MENTOR_QUERY_KEY,
    });
  });

  it('menteeStatus 만 전달하면 payload 에 mentorStatus 가 포함되지 않는다', async () => {
    axiosMock.patch.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const { result } = renderHook(() => useUpdateFeedbackByMentorMutation(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      await result.current.mutateAsync({
        feedbackId: 7,
        menteeStatus: 'ABSENT',
      });
    });

    expect(axiosMock.patch).toHaveBeenCalledWith('/feedback/mentor/7', {
      menteeStatus: 'ABSENT',
    });
    const [, body] = axiosMock.patch.mock.calls[0];
    expect(body).not.toHaveProperty('mentorStatus');
  });

  it('mentorStatus 만 전달하면 payload 에 menteeStatus 가 포함되지 않는다', async () => {
    axiosMock.patch.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const { result } = renderHook(() => useUpdateFeedbackByMentorMutation(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      await result.current.mutateAsync({
        feedbackId: 9,
        mentorStatus: 'PRESENT',
      });
    });

    expect(axiosMock.patch).toHaveBeenCalledWith('/feedback/mentor/9', {
      mentorStatus: 'PRESENT',
    });
    const [, body] = axiosMock.patch.mock.calls[0];
    expect(body).not.toHaveProperty('menteeStatus');
  });

  it('mentorStatus 와 menteeStatus 를 함께 전달하면 둘 다 payload 에 담는다', async () => {
    axiosMock.patch.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const { result } = renderHook(() => useUpdateFeedbackByMentorMutation(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      await result.current.mutateAsync({
        feedbackId: 11,
        menteeStatus: 'PRESENT',
        mentorStatus: 'PRESENT',
      });
    });

    expect(axiosMock.patch).toHaveBeenCalledWith('/feedback/mentor/11', {
      menteeStatus: 'PRESENT',
      mentorStatus: 'PRESENT',
    });
  });
});
