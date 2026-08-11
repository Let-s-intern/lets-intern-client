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
