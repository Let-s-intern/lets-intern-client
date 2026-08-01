import {
  MY_LIVE_MENTORING_ID,
  resetLiveMentoringOpeningHistory,
  resetLiveMentoringStatus,
} from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * 관리자 라이브 멘토링 API 3종의 계약을 공유 MSW 핸들러로 고정한다.
 *
 * 어드민 화면에는 아직 목록이 없어 ID 를 직접 입력해 액션만 실행하므로,
 * 이 테스트가 사실상 "전 구간이 도는가"를 확인하는 자리다 —
 * 멘토 검토 제출 → 관리자 승인 → 상품이 개설 가능한 `APPROVED` 로 바뀜.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  // 승인·반려·강제 종료는 모듈 스코프 목 상태를 바꾸므로 테스트 간 격리한다.
  resetLiveMentoringStatus();
  resetLiveMentoringOpeningHistory();
});
afterAll(() => server.close());

const patch = (path: string) => fetch(`${BASE}${path}`, { method: 'PATCH' });
const post = (path: string, body?: unknown) =>
  fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const readStatus = async () => {
  const res = await fetch(`${BASE}/mentor/live-mentoring/settings`);
  const { data } = await res.json();
  return data.status as string;
};

const approve = (id: number) => patch(`/admin/live-mentoring/${id}/approve`);
const reject = (id: number) => patch(`/admin/live-mentoring/${id}/reject`);
const submit = () => post('/mentor/live-mentoring/submit');

describe('상세 작성 → 제출 → 승인 → 개설 전 구간', () => {
  it('멘토가 제출한 상품을 관리자가 승인하면 개설 가능한 APPROVED 가 된다', async () => {
    expect(await readStatus()).toBe('DRAFT');

    expect((await submit()).status).toBe(200);
    expect(await readStatus()).toBe('PENDING_REVIEW');

    expect((await approve(MY_LIVE_MENTORING_ID)).status).toBe(200);
    expect(await readStatus()).toBe('APPROVED');

    // 개설은 APPROVED 에서만 만들 수 있다 — 여기까지 와야 공개 노출 경로가 열린다.
    const opened = await post('/mentor/live-mentoring/openings', {
      durations: [30],
      feedbackStartDate: '2026-08-10',
      feedbackEndDate: '2026-08-31',
    });
    const { data } = await opened.json();
    expect(data.openings[0].status).toBe('OPEN');
  });

  it('반려하면 REJECTED 가 되고 멘토가 다시 제출할 수 있다', async () => {
    await submit();

    expect((await reject(MY_LIVE_MENTORING_ID)).status).toBe(200);
    expect(await readStatus()).toBe('REJECTED');

    expect((await submit()).status).toBe(200);
    expect(await readStatus()).toBe('PENDING_REVIEW');
  });
});

describe('승인·반려 오류 응답', () => {
  it('없는 상품 ID 는 404 LIVE_MENTORING_NOT_FOUND', async () => {
    const res = await approve(MY_LIVE_MENTORING_ID + 9999);
    expect(res.status).toBe(404);
    expect((await res.json()).code).toBe('LIVE_MENTORING_NOT_FOUND');
  });

  it('PENDING_REVIEW 가 아니면 409 LIVE_MENTORING_INVALID_STATE', async () => {
    // 시드는 DRAFT — 제출 전에는 승인할 수 없다.
    const res = await approve(MY_LIVE_MENTORING_ID);
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe('LIVE_MENTORING_INVALID_STATE');
    expect(await readStatus()).toBe('DRAFT');
  });

  it('반려도 같은 전이 규칙을 따른다', async () => {
    const res = await reject(MY_LIVE_MENTORING_ID);
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe('LIVE_MENTORING_INVALID_STATE');
  });
});

describe('개설 강제 종료', () => {
  const closeOpening = (openingId: number) =>
    patch(`/admin/live-mentoring/openings/${openingId}/close`);

  it('OPEN 개설을 종료하면 ADMIN_FORCED 로 닫히고, 재요청도 성공한다(멱등)', async () => {
    await submit();
    await approve(MY_LIVE_MENTORING_ID);
    const created = await post('/mentor/live-mentoring/openings', {
      durations: [30],
      feedbackStartDate: '2026-08-10',
      feedbackEndDate: '2026-08-31',
    });
    const { openingId } = (await created.json()).data.openings[0];

    expect((await closeOpening(openingId)).status).toBe(200);
    // 이미 CLOSED 인 개설에 대한 재요청은 서버가 아무 것도 하지 않고 성공으로 끝낸다.
    expect((await closeOpening(openingId)).status).toBe(200);

    const res = await fetch(`${BASE}/mentor/live-mentoring/open-status`);
    const closed = (await res.json()).data.openings.find(
      (row: { openingId: number }) => row.openingId === openingId,
    );
    expect(closed.status).toBe('CLOSED');
    expect(closed.closeReason).toBe('ADMIN_FORCED');
  });

  it('없는 개설 ID 는 404 LIVE_MENTORING_NOT_FOUND', async () => {
    const res = await closeOpening(999999);
    expect(res.status).toBe(404);
    expect((await res.json()).code).toBe('LIVE_MENTORING_NOT_FOUND');
  });
});
