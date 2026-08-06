import { getLowestPrice, resetLiveMentoringMockState } from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * 공유 MSW 핸들러(@letscareer/mocks)가 1대1 라이브 멘토링 엔드포인트에 대해
 * 페이징/필터/정렬/PUT echo를 올바르게 처리하는지 스모크 검증한다.
 * 와일드카드 prefix 패턴이라 임의 origin으로 요청해도 매칭된다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  // 제출·승인·종료 핸들러는 모듈 상태를 바꾼다 — 테스트 간 간섭을 끊는다.
  resetLiveMentoringMockState();
});
afterAll(() => server.close());

/** 오늘 기준 상대 날짜(YYYY-MM-DD). 기간 검증이 실행 시점에 좌우되지 않게 한다. */
const dateFromToday = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

describe('1대1 라이브 멘토링 MSW 핸들러', () => {
  it('GET /live-mentoring → 개설 목록 응답(openingList/pageInfo)', async () => {
    const res = await fetch(`${BASE}/live-mentoring?page=1&size=9`);
    const { data } = await res.json();
    expect(data.pageInfo.pageNum).toBe(1);
    expect(data.pageInfo.pageSize).toBe(9);
    expect(data.openingList).toHaveLength(9);
    expect(data.pageInfo.totalElements).toBeGreaterThanOrEqual(12);
    expect(data.pageInfo.totalPages).toBeGreaterThanOrEqual(2);
  });

  it('page=2 는 나머지 항목을 반환한다(1-based 페이징 검증)', async () => {
    const res = await fetch(`${BASE}/live-mentoring?page=2&size=9`);
    const { data } = await res.json();
    expect(data.pageInfo.pageNum).toBe(2);
    expect(data.openingList.length).toBeGreaterThan(0);
    expect(data.openingList.length).toBeLessThanOrEqual(9);
  });

  it('categories 필터가 반영된다', async () => {
    const res = await fetch(
      `${BASE}/live-mentoring?categories=PORTFOLIO&size=50`,
    );
    const { data } = await res.json();
    expect(data.openingList.length).toBeGreaterThan(0);
    expect(
      data.openingList.every((o: { categories: string[] }) =>
        o.categories.includes('PORTFOLIO'),
      ),
    ).toBe(true);
  });

  it('sortType=FEEDBACK_START_DATE 는 진행 시작일 오름차순 정렬한다', async () => {
    const res = await fetch(
      `${BASE}/live-mentoring?sortType=FEEDBACK_START_DATE&size=50`,
    );
    const { data } = await res.json();
    const dates = data.openingList.map(
      (o: { feedbackStartDate: string }) => o.feedbackStartDate,
    );
    const sorted = [...dates].sort((a, b) => a.localeCompare(b));
    expect(dates).toEqual(sorted);
  });

  it('대표 경력은 미지정(null)일 수 있다', async () => {
    const res = await fetch(`${BASE}/live-mentoring?size=50`);
    const { data } = await res.json();
    const careers = data.openingList.map(
      (o: { representativeCareer: unknown }) => o.representativeCareer,
    );
    // 실제 백엔드도 대표 경력 미지정 멘토는 null 을 내려주므로 목에서도 재현한다.
    expect(careers.some((c: unknown) => c === null)).toBe(true);
    expect(careers.some((c: unknown) => c !== null)).toBe(true);
  });

  it('GET /live-mentoring/mentors/:id → 상세(+reviews, template)', async () => {
    const res = await fetch(`${BASE}/live-mentoring/mentors/3`);
    const { data } = await res.json();
    expect(data.mentorId).toBe(3);
    expect(data.profile).toBeDefined();
    expect(data.template.categories).toEqual(data.categories);
    expect(Array.isArray(data.reviews)).toBe(true);
    expect(data.price).toBe(getLowestPrice(data.durations));
  });

  it('GET /mentor/live-mentoring/settings → 상품 설정 메타(status 포함, isOpen 없음)', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/settings`);
    const { data } = await res.json();
    expect(data).toHaveProperty('liveMentoringId');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('nickname');
    expect(data).toHaveProperty('careers');
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('durations');
    expect(data).toHaveProperty('feedbackStartDate');
    expect(data).toHaveProperty('feedbackEndDate');
    expect(data.status).toBe('DRAFT');
    // 백엔드에 없는 필드를 목이 만들어내면 실서버에서만 깨지는 코드가 통과한다.
    expect(data).not.toHaveProperty('isOpen');
  });

  it('PUT /mentor/live-mentoring/settings → 제목·타입만 반영하고 전체 설정을 돌려준다', async () => {
    const body = { title: '수정된 타이틀', categories: ['RESUME'] };
    const res = await fetch(`${BASE}/mentor/live-mentoring/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const { data } = await res.json();
    expect(data).toMatchObject(body);
    // 진행시간·기간은 이 요청으로 저장되지 않는다(검토 제출의 몫).
    expect(data.durations).toEqual([]);
    expect(data.feedbackStartDate).toBeNull();
    // 프로필 참조 필드(nickname 등)는 요청에 없어도 응답엔 딸려온다.
    expect(data).toHaveProperty('nickname');
    expect(data).toHaveProperty('careers');
  });

  it('POST /submit → 진행시간·기간을 저장하고 PENDING_REVIEW 로 전이한다', async () => {
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

    const settings = await fetch(`${BASE}/mentor/live-mentoring/settings`).then(
      (r) => r.json(),
    );
    expect(settings.data.status).toBe('PENDING_REVIEW');
    expect(settings.data.durations).toEqual([30, 60]);
  });

  it('POST /submit → 지원하지 않는 진행시간은 400 INVALID_LIVE_MENTORING_DURATION', async () => {
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

  it('POST /submit → 종료일이 지났으면 400', async () => {
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

  it('승인하면 개설이 함께 생성되고 상품이 APPROVED 가 된다', async () => {
    await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations: [30],
        feedbackStartDate: dateFromToday(-1),
        feedbackEndDate: dateFromToday(20),
      }),
    });

    const approve = await fetch(`${BASE}/admin/live-mentoring/1/approve`, {
      method: 'PATCH',
    });
    expect(approve.status).toBe(200);

    const { data } = await fetch(
      `${BASE}/mentor/live-mentoring/open-status`,
    ).then((r) => r.json());
    const opened = data.openings.filter(
      (o: { status: string }) => o.status === 'OPEN',
    );
    expect(opened).toHaveLength(1);
    expect(opened[0].durationPrices).toEqual([{ duration: 30, price: 35000 }]);
  });

  it('검토 대기가 아닌 상품을 승인하면 409 LIVE_MENTORING_INVALID_STATE', async () => {
    const res = await fetch(`${BASE}/admin/live-mentoring/1/approve`, {
      method: 'PATCH',
    });
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe('LIVE_MENTORING_INVALID_STATE');
  });

  it('멘토가 개설을 종료하면 CLOSED·MENTOR_CANCELED 로 기록된다', async () => {
    await fetch(`${BASE}/mentor/live-mentoring/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        durations: [60],
        feedbackStartDate: dateFromToday(-1),
        feedbackEndDate: dateFromToday(20),
      }),
    });
    await fetch(`${BASE}/admin/live-mentoring/1/approve`, { method: 'PATCH' });

    const before = await fetch(
      `${BASE}/mentor/live-mentoring/open-status`,
    ).then((r) => r.json());
    const openingId = before.data.openings.find(
      (o: { status: string }) => o.status === 'OPEN',
    ).openingId;

    const res = await fetch(
      `${BASE}/mentor/live-mentoring/openings/${openingId}/close`,
      { method: 'PATCH' },
    );
    expect(res.status).toBe(200);

    const after = await fetch(`${BASE}/mentor/live-mentoring/open-status`).then(
      (r) => r.json(),
    );
    const closed = after.data.openings.find(
      (o: { openingId: number }) => o.openingId === openingId,
    );
    expect(closed.status).toBe('CLOSED');
    expect(closed.closeReason).toBe('MENTOR_CANCELED');
  });

  it('GET /admin/live-mentoring → 상태 필터와 1-based 페이징', async () => {
    const all = await fetch(`${BASE}/admin/live-mentoring?page=1&size=20`).then(
      (r) => r.json(),
    );
    expect(all.data.liveMentoringList.length).toBeGreaterThan(0);
    // 요청은 1-based, 응답 pageNum 은 0-based(서버 `PageInfo`).
    expect(all.data.pageInfo.pageNum).toBe(0);

    const pending = await fetch(
      `${BASE}/admin/live-mentoring?status=PENDING_REVIEW`,
    ).then((r) => r.json());
    expect(
      pending.data.liveMentoringList.every(
        (row: { status: string }) => row.status === 'PENDING_REVIEW',
      ),
    ).toBe(true);
  });

  it('GET /mentor/live-mentoring/template → 템플릿', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`);
    const { data } = await res.json();
    expect(data.intro.careerLines.length).toBeGreaterThan(0);
    expect(data.mentoringTypes.items.length).toBeGreaterThan(0);
  });

  it('PUT /mentor/live-mentoring/template → 받은 body를 echo', async () => {
    const body = { categories: ['RESUME'], mentoringPoints: '수정본' };
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const { data } = await res.json();
    expect(data).toEqual(body);
  });

  it('GET /mentor/live-mentoring/settlement → 정산행 목록', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/settlement`);
    const { data } = await res.json();
    expect(Array.isArray(data.settlementList)).toBe(true);
    expect(data.settlementList[0]).toHaveProperty('status');
  });

  it('GET /mentor/live-mentoring/open-status → 개설 이력', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/open-status`);
    const { data } = await res.json();
    expect(data).toHaveProperty('liveMentoringId');
    expect(Array.isArray(data.openings)).toBe(true);
    expect(data.openings[0]).toHaveProperty('openingId');
    expect(data.openings[0]).toHaveProperty('durationPrices');
  });
});
