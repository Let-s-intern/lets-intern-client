import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * 이 훅에서 지켜야 할 것은 응답 모양이 아니라 **요청 횟수**다.
 *
 * 목록 20행을 그릴 때 상세까지 미리 가져오면 요청이 스무 개 더 붙고,
 * 행을 여닫을 때마다 재요청이 나가면 운영이 목록을 훑는 동안 서버를 계속 때린다.
 * 그래서 axios 를 목으로 두고 호출 횟수만 센다.
 */

const get = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => get(...args) },
}));

import { useAccessLogDetailQuery } from '../accessLog';

const detailPayload = {
  firstAccessedAt: '2026-07-30T14:22:00',
  lastAccessedAt: '2026-08-05T09:11:00',
  accessCount: 12,
  paidAt: '2026-07-28T10:00:00',
  daysFromPaymentToFirstAccess: 2,
  trackedFrom: '2026-06-01T00:00:00',
  details: [
    {
      targetType: 'MISSION',
      targetId: 9001,
      targetTitle: '경험 정리하기',
      missionTh: 3,
      firstAccessedAt: '2026-07-31T20:05:00',
      lastAccessedAt: '2026-07-31T20:07:00',
      accessCount: 2,
    },
  ],
};

/** 같은 클라이언트를 여러 렌더에 공유한다. 캐시 동작을 보려면 캐시가 살아 있어야 한다. */
const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

afterEach(() => {
  get.mockReset();
});

describe('useAccessLogDetailQuery', () => {
  it('펼치기 전에는 조회하지 않는다', async () => {
    // 목록을 그릴 때 전부 가져오면 한 페이지에 요청이 스무 개 더 붙는다.
    get.mockResolvedValue({ data: { data: detailPayload } });

    renderHook(() => useAccessLogDetailQuery(6001, false), {
      wrapper: createWrapper(),
    });

    await Promise.resolve();

    expect(get).not.toHaveBeenCalled();
  });

  it('펼치면 신청서 단건 경로로 한 번 조회한다', async () => {
    get.mockResolvedValue({ data: { data: detailPayload } });
    const { result } = renderHook(() => useAccessLogDetailQuery(6001), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('/admin/access-log/application/6001');
    expect(result.current.data?.details).toHaveLength(1);
  });

  it('접었다 다시 펼쳐도 재요청하지 않는다', async () => {
    get.mockResolvedValue({ data: { data: detailPayload } });
    const wrapper = createWrapper();

    const first = renderHook(() => useAccessLogDetailQuery(6001), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));

    // 접으면 상세 행이 언마운트된다.
    first.unmount();

    const second = renderHook(() => useAccessLogDetailQuery(6001), { wrapper });
    await waitFor(() => expect(second.result.current.data).toBeDefined());

    expect(get).toHaveBeenCalledTimes(1);
  });

  it('신청서마다 따로 캐시한다', async () => {
    // 키에 applicationId 가 빠지면 먼저 펼친 행의 내역이 다른 행에 그대로 보인다.
    get.mockResolvedValue({ data: { data: detailPayload } });
    const wrapper = createWrapper();

    const first = renderHook(() => useAccessLogDetailQuery(6001), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));

    const second = renderHook(() => useAccessLogDetailQuery(6005), { wrapper });
    await waitFor(() => expect(second.result.current.isSuccess).toBe(true));

    expect(get).toHaveBeenCalledTimes(2);
    expect(get).toHaveBeenLastCalledWith('/admin/access-log/application/6005');
  });

  it('응답이 스키마를 벗어나면 성공으로 두지 않는다', async () => {
    // 파싱 실패를 조용히 빈 결과로 흘리면 화면이 `내역 없음` 으로 적는다.
    // 못 읽은 것과 없는 것은 다르다(PRD 7.4).
    get.mockResolvedValue({ data: { data: { details: '내역없음' } } });

    const { result } = renderHook(() => useAccessLogDetailQuery(6001), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
