import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import { useLiveMentoringReservationsQuery } from '../liveMentoring';

vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn() },
}));

const axiosMock = vi.mocked(axios, true);

const RESERVATION = {
  applicationId: 91001,
  menteeId: 51001,
  menteeName: '김일대',
  productName: '자소서 실전 첨삭 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-08-26T10:00:00',
  reservationEndAt: '2026-08-26T11:00:00',
  status: 'CONFIRMED',
  questionWritten: true,
  attachmentSubmitted: true,
  createDate: '2026-08-20T09:00:00',
};

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  axiosMock.get.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useLiveMentoringReservationsQuery', () => {
  it('reservationList 만 벗겨서 반환한다', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: { reservationList: [RESERVATION] } },
    });

    const { result } = renderHook(() => useLiveMentoringReservationsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].menteeName).toBe('김일대');
  });

  it('날짜 범위를 query param 으로 넘긴다', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: { reservationList: [] } },
    });

    const { result } = renderHook(
      () =>
        useLiveMentoringReservationsQuery({
          startDate: '2026-08-24T00:00:00',
          endDate: '2026-08-30T23:59:59',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosMock.get).toHaveBeenCalledWith(
      '/mentor/live-mentoring/reservations',
      {
        params: {
          startDate: '2026-08-24T00:00:00',
          endDate: '2026-08-30T23:59:59',
        },
      },
    );
  });

  it('enabled: false 면 요청하지 않는다', async () => {
    renderHook(
      () => useLiveMentoringReservationsQuery({}, { enabled: false }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(axiosMock.get).not.toHaveBeenCalled());
  });
});
