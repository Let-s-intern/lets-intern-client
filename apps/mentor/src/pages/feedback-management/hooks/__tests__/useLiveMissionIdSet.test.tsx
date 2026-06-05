/**
 * LIVE 옵션 미션 식별 — 서면 행 오노출 버그 방지.
 *
 * feedback-management 목록은 BE 공유 쿼리의 WRITTEN 필터 제거 후 라이브 미션도
 * 함께 내려오는데 타입 필드가 없다. useLiveMissionIdSet 이 미션 목록 API의
 * challengeOptionType(LIVE_FEEDBACK)으로 라이브 미션 id 집합을 만들어
 * useMergedFeedbackRows 의 서면 행 생성에서 제외한다.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const axiosGet = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => axiosGet(...args) },
}));

import { useLiveMissionIdSet } from '../useMergedFeedbackRows';

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

/** 미션 목록 응답 헬퍼 — { data: { missionList } } 엔벨로프 */
function missionListResponse(
  missionList: Array<Record<string, unknown>>,
): Promise<{ data: { data: { missionList: Array<Record<string, unknown>> } } }> {
  return Promise.resolve({ data: { data: { missionList } } });
}

const writtenMission = {
  id: 1001,
  title: '3회차 서면 피드백',
  th: 3,
  startDate: '2026-04-20T00:00:00',
  endDate: '2026-04-25T23:59:59',
  challengeOptionType: 'WRITTEN_FEEDBACK',
  submittedCount: 0,
  totalCount: 0,
};

const liveMission = {
  id: 1007,
  title: '7회차 라이브 피드백',
  th: 7,
  startDate: '2026-04-26T00:00:00',
  endDate: '2026-04-30T23:59:59',
  challengeOptionType: 'LIVE_FEEDBACK',
  submittedCount: 0,
  totalCount: 0,
};

describe('useLiveMissionIdSet', () => {
  beforeEach(() => {
    axiosGet.mockReset();
  });

  it('challengeOptionType=LIVE_FEEDBACK 미션 id만 집합에 담는다', async () => {
    axiosGet.mockImplementation(() =>
      missionListResponse([writtenMission, liveMission]),
    );

    const { result } = renderHook(() => useLiveMissionIdSet([1]), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.size).toBe(1);
    });
    expect(result.current.has(1007)).toBe(true);
    expect(result.current.has(1001)).toBe(false);
  });

  it('challengeOptionType 미배포(undefined)면 빈 집합 — 기존 동작 유지', async () => {
    // BE 미배포 응답 — 타입 필드 없음
    axiosGet.mockImplementation(() =>
      missionListResponse([
        { ...writtenMission, challengeOptionType: undefined },
        { ...liveMission, challengeOptionType: undefined },
      ]),
    );

    const { result } = renderHook(() => useLiveMissionIdSet([1]), {
      wrapper: makeWrapper(),
    });

    // 쿼리 도착을 기다린 뒤에도 집합은 비어 있어야 한다.
    await waitFor(() => {
      expect(axiosGet).toHaveBeenCalled();
    });
    expect(result.current.size).toBe(0);
  });

  it('빈 challengeIds면 빈 집합을 반환한다', () => {
    const { result } = renderHook(() => useLiveMissionIdSet([]), {
      wrapper: makeWrapper(),
    });
    expect(result.current.size).toBe(0);
  });
});
