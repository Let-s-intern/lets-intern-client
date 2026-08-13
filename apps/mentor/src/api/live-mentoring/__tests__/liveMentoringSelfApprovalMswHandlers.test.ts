import { resetLiveMentoringMockState } from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * 자가승인 계약을 검증한다. 백엔드는 관리자 검토 단계 없이 개설 요청 하나에서
 * `DRAFT → APPROVED` 전이와 개설 생성을 함께 처리하므로, 목도 같은 흐름을 재현해야 한다.
 *
 * LC-3206 에서 `POST /mentor/live-mentoring/submit` 이 제거되고 최초 개설과 재개설이
 * `POST /mentor/live-mentoring/openings` 하나로 합쳐졌다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  resetLiveMentoringMockState();
});
afterAll(() => server.close());

const OPENING_BODY = {
  title: '자소서 실전 첨삭 멘토링',
  categories: ['PERSONAL_STATEMENT'],
  durations: [30, 60],
};

const openOnce = (body: Record<string, unknown> = OPENING_BODY) =>
  fetch(`${BASE}/mentor/live-mentoring/openings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /mentor/live-mentoring/openings — 자가승인 개설', () => {
  it('개설 즉시 상태가 APPROVED 로 전이되고 개설이 함께 생성된다', async () => {
    const res = await openOnce();
    expect(res.status).toBe(200);

    // 응답은 개설 이력이다 — 화면이 방금 만든 개설 id 를 바로 쓸 수 있어야 한다.
    const { data } = await res.json();
    expect(
      data.openings.filter((o: { status: string }) => o.status === 'OPEN'),
    ).toHaveLength(1);

    const settings = await fetch(`${BASE}/mentor/live-mentoring/settings`).then(
      (r) => r.json(),
    );
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
    // 개설 이력에도 모집 기간은 더 이상 실리지 않는다.
    expect(opened[0]).not.toHaveProperty('feedbackStartDate');
  });

  it('활성 개설이 있는 상태에서 다시 개설하면 409 LIVE_MENTORING_LOCKED', async () => {
    await openOnce();
    const res = await openOnce();
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe('LIVE_MENTORING_LOCKED');
  });

  it('종료 후에는 같은 엔드포인트로 재개설할 수 있다', async () => {
    const first = await openOnce().then((r) => r.json());
    const openingId = first.data.openings.find(
      (o: { status: string }) => o.status === 'OPEN',
    ).openingId;

    await fetch(`${BASE}/mentor/live-mentoring/openings/${openingId}/close`, {
      method: 'PATCH',
    });

    const res = await openOnce({ ...OPENING_BODY, durations: [30] });
    expect(res.status).toBe(200);

    const settings = await fetch(`${BASE}/mentor/live-mentoring/settings`).then(
      (r) => r.json(),
    );
    expect(settings.data.durations).toEqual([30]);
  });

  it('지원하지 않는 진행시간은 400 INVALID_LIVE_MENTORING_DURATION', async () => {
    const res = await openOnce({ ...OPENING_BODY, durations: [45] });
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe('INVALID_LIVE_MENTORING_DURATION');
  });

  it('제목·타입이 비어 있으면 400', async () => {
    const res = await openOnce({ ...OPENING_BODY, title: '  ' });
    expect(res.status).toBe(400);
  });
});

describe('제거된 엔드포인트', () => {
  it('submit·approve·reject 경로는 더 이상 핸들러가 없다 (MSW request:unhandled)', async () => {
    const unhandledUrls: string[] = [];
    const onUnhandled = ({ request }: { request: Request }) => {
      unhandledUrls.push(request.url);
    };
    server.events.on('request:unhandled', onUnhandled);

    await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ durations: [30] }),
    }).catch(() => {});
    await fetch(`${BASE}/admin/live-mentoring/1/approve`, {
      method: 'PATCH',
    }).catch(() => {});
    await fetch(`${BASE}/admin/live-mentoring/1/reject`, {
      method: 'PATCH',
    }).catch(() => {});

    server.events.removeListener('request:unhandled', onUnhandled);

    expect(unhandledUrls).toEqual([
      `${BASE}/mentor/live-mentoring/submit`,
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
    expect(new Set(statuses)).toEqual(
      new Set(['DRAFT', 'APPROVED', 'INACTIVE']),
    );

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
