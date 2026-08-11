import { resetLiveMentoringMockState } from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * 자가승인 전환(PRD `.claude/tasks/prd-라이브멘토링-자가승인-전환-FE정합.md`) 이후의
 * `packages/mocks` 계약을 검증한다. 백엔드는 관리자 검토 단계 없이
 * `LiveMentoringLifecycleServiceImpl.submit()`이 `DRAFT → APPROVED` 전이와 개설 생성을
 * 한 트랜잭션에서 처리하므로, 목도 같은 흐름을 재현해야 한다.
 *
 * 기존 `liveMentoringMswHandlers.test.ts`는 구(舊) 2단계 승인 계약(PENDING_REVIEW → 관리자
 * 승인/반려)을 검증하던 파일이라 이번 변경으로 깨진다 — 해당 파일 자체의 수정은
 * Push 5(프론트 정합) 몫이라 여기서는 건드리지 않고, 새 계약만 별도 파일로 검증한다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  resetLiveMentoringMockState();
});
afterAll(() => server.close());

const dateFromToday = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

describe('POST /mentor/live-mentoring/submit — 자가승인', () => {
  it('제출 즉시 상태가 APPROVED 로 전이되고 개설이 함께 생성된다', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations: [30, 60],
        feedbackStartDate: dateFromToday(-1),
        feedbackEndDate: dateFromToday(20),
      }),
    });
    expect(res.status).toBe(200);

    const settings = await fetch(
      `${BASE}/mentor/live-mentoring/settings`,
    ).then((r) => r.json());
    expect(settings.data.status).toBe('APPROVED');
    expect(settings.data.durations).toEqual([30, 60]);

    const openStatus = await fetch(
      `${BASE}/mentor/live-mentoring/open-status`,
    ).then((r) => r.json());
    const opened = openStatus.data.openings.filter(
      (o: { status: string }) => o.status === 'OPEN',
    );
    expect(opened).toHaveLength(1);
    expect(opened[0].durationPrices).toEqual([
      { duration: 30, price: 35000 },
      { duration: 60, price: 60000 },
    ]);
  });

  it('APPROVED 상태에서 다시 제출하면 409 LIVE_MENTORING_INVALID_STATE (재검토·재승인 없음)', async () => {
    await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations: [30],
        feedbackStartDate: dateFromToday(-1),
        feedbackEndDate: dateFromToday(20),
      }),
    });

    const res = await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations: [60],
        feedbackStartDate: dateFromToday(-1),
        feedbackEndDate: dateFromToday(20),
      }),
    });
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe('LIVE_MENTORING_INVALID_STATE');
  });

  it('지원하지 않는 진행시간은 400 INVALID_LIVE_MENTORING_DURATION', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations: [45],
        feedbackStartDate: dateFromToday(0),
        feedbackEndDate: dateFromToday(10),
      }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe('INVALID_LIVE_MENTORING_DURATION');
  });

  it('종료일이 지났으면 400', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations: [30],
        feedbackStartDate: dateFromToday(-20),
        feedbackEndDate: dateFromToday(-1),
      }),
    });
    expect(res.status).toBe(400);
  });
});

describe('관리자 승인·반려 엔드포인트 — 제거됨', () => {
  it('approve/reject 경로는 더 이상 핸들러가 없다 (MSW request:unhandled)', async () => {
    const unhandledUrls: string[] = [];
    const onUnhandled = ({ request }: { request: Request }) => {
      unhandledUrls.push(request.url);
    };
    server.events.on('request:unhandled', onUnhandled);

    await fetch(`${BASE}/admin/live-mentoring/1/approve`, {
      method: 'PATCH',
    }).catch(() => {});
    await fetch(`${BASE}/admin/live-mentoring/1/reject`, {
      method: 'PATCH',
    }).catch(() => {});

    server.events.removeListener('request:unhandled', onUnhandled);

    expect(unhandledUrls).toEqual([
      `${BASE}/admin/live-mentoring/1/approve`,
      `${BASE}/admin/live-mentoring/1/reject`,
    ]);
  });
});

describe('GET /admin/live-mentoring — 상태 필터 (DRAFT/APPROVED/INACTIVE)', () => {
  it('세 상태가 픽스처에 모두 존재하고, status 필터가 정확히 걸러낸다', async () => {
    const all = await fetch(`${BASE}/admin/live-mentoring?page=1&size=20`).then(
      (r) => r.json(),
    );
    const statuses = all.data.liveMentoringList.map(
      (row: { status: string }) => row.status,
    );
    expect(new Set(statuses)).toEqual(new Set(['DRAFT', 'APPROVED', 'INACTIVE']));

    for (const status of ['DRAFT', 'APPROVED', 'INACTIVE']) {
      const filtered = await fetch(
        `${BASE}/admin/live-mentoring?status=${status}`,
      ).then((r) => r.json());
      expect(
        filtered.data.liveMentoringList.every(
          (row: { status: string }) => row.status === status,
        ),
      ).toBe(true);
      expect(filtered.data.liveMentoringList.length).toBeGreaterThan(0);
    }
  });

  it('강제 종료는 APPROVED 픽스처 행의 개설을 CLOSED·ADMIN_FORCED 로 만든다', async () => {
    const res = await fetch(`${BASE}/admin/live-mentoring/openings/220/close`, {
      method: 'PATCH',
    });
    expect(res.status).toBe(200);

    const all = await fetch(`${BASE}/admin/live-mentoring?page=1&size=20`).then(
      (r) => r.json(),
    );
    const row = all.data.liveMentoringList.find(
      (each: { liveMentoringId: number }) => each.liveMentoringId === 20,
    );
    expect(row.currentOpening.status).toBe('CLOSED');
    expect(row.currentOpening.closeReason).toBe('ADMIN_FORCED');
  });
});
