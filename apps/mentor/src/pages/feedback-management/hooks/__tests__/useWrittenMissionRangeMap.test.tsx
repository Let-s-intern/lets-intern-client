/**
 * C — 서면 피드백 일정 채우기.
 *
 * feedback-management 응답엔 미션 날짜가 없어 서면 행 일정이 '-'로 비는데,
 * useWrittenMissionRangeMap 이 챌린지별 미션 목록(GET /challenge/:id/mission/feedback)을
 * 병렬 조회해 missionId→{start,end}(endDate+1~+3) 맵을 채운다.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { useWrittenMissionRangeMap } from '../useMergedFeedbackRows';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useWrittenMissionRangeMap', () => {
  it('challengeId 별 미션 endDate에서 +1~+3 기간을 파생해 합친다', async () => {
    const { result } = renderHook(() => useWrittenMissionRangeMap([1, 2]), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      // challenge 1 mission(id 1001, endDate 4/25) + challenge 2 mission(id 2001, 4/27)
      expect(result.current.size).toBe(2);
    });

    // challenge 1: 4/25 +1~+3 = 4/26~4/28
    expect(result.current.get(1001)).toEqual({
      start: '2026-04-26',
      end: '2026-04-28',
    });
    // challenge 2: 4/27 +1~+3 = 4/28~4/30
    expect(result.current.get(2001)).toEqual({
      start: '2026-04-28',
      end: '2026-04-30',
    });
  });

  it('빈 challengeIds면 빈 맵을 반환한다', () => {
    const { result } = renderHook(() => useWrittenMissionRangeMap([]), {
      wrapper: makeWrapper(),
    });
    expect(result.current.size).toBe(0);
  });
});
