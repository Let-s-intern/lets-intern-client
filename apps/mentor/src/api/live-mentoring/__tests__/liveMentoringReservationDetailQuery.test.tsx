import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import { useLiveMentoringReservationDetailQuery } from '../liveMentoring';

vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn() },
}));

const axiosMock = vi.mocked(axios, true);

const DETAIL = {
  applicationId: 91001,
  menteeName: '김일대',
  productName: '자소서 실전 첨삭 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-08-30T10:00:00',
  reservationEndAt: '2026-08-30T11:00:00',
  mentoringCategory: 'PERSONAL_STATEMENT',
  questionDeferred: false,
  questionContent: '지원 동기 문단이 약한 것 같습니다.',
  attachmentType: 'URL',
  attachmentUrl: 'https://www.notion.so/mentee-portfolio',
  mentorShareAgreed: true,
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

describe('useLiveMentoringReservationDetailQuery', () => {
  it('applicationId 를 붙인 경로로 호출한다', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { data: DETAIL } });

    const { result } = renderHook(
      () => useLiveMentoringReservationDetailQuery(91001),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosMock.get).toHaveBeenCalledWith(
      '/mentor/live-mentoring/reservations/91001',
    );
  });

  it('응답을 스키마로 파싱해 돌려준다', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { data: DETAIL } });

    const { result } = renderHook(
      () => useLiveMentoringReservationDetailQuery(91001),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.menteeName).toBe('김일대');
    expect(result.current.data?.questionContent).toBe(
      '지원 동기 문단이 약한 것 같습니다.',
    );
    expect(result.current.data?.attachmentUrl).toBe(
      'https://www.notion.so/mentee-portfolio',
    );
  });

  it('questionUpdatedAt 이 없는 응답도 통과한다', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { data: DETAIL } });

    const { result } = renderHook(
      () => useLiveMentoringReservationDetailQuery(91001),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.questionUpdatedAt).toBeUndefined();
  });

  it('applicationId 가 null 이면 요청하지 않는다', async () => {
    const { result } = renderHook(
      () => useLiveMentoringReservationDetailQuery(null),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));
    expect(axiosMock.get).not.toHaveBeenCalled();
  });

  it('계약에 없는 응답이면 실패한다', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { data: { ...DETAIL, attachmentType: 'IMAGE' } },
    });

    const { result } = renderHook(
      () => useLiveMentoringReservationDetailQuery(91001),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
