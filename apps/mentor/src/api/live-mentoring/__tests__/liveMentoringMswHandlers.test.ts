import { getLowestPrice, resetLiveMentoringMockState } from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * 공유 MSW 핸들러(@letscareer/mocks)가 1대1 라이브 멘토링 엔드포인트에 대해
 * 페이징/필터/정렬/PUT echo를 올바르게 처리하는지 스모크 검증한다.
 * 와일드카드 prefix 패턴이라 임의 origin으로 요청해도 매칭된다.
 *
 * 자가승인 전환(개설 즉시 승인, 관리자 승인/반려 없음) 관련 계약은
 * `liveMentoringSelfApprovalMswHandlers.test.ts`에서 검증한다 — 이 파일에서는
 * 그 계약과 겹치지 않는 나머지 스모크(목록/상세/설정/템플릿/정산/멘토측 개설 종료)만 다룬다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  // 개설·종료 핸들러는 모듈 상태를 바꾼다 — 테스트 간 간섭을 끊는다.
  resetLiveMentoringMockState();
});
afterAll(() => server.close());

/** 최초 개설 요청 바디. LC-3206 이후 날짜는 담지 않는다. */
const OPENING_BODY = {
  title: '자소서 실전 첨삭 멘토링',
  categories: ['PERSONAL_STATEMENT'],
  durations: [60],
};

/** 조회 응답에서 저장 요청 바디(서버 요청 DTO와 같은 6개 키)만 뽑는다. */
const detailPagePayload = async () => {
  const res = await fetch(`${BASE}/mentor/live-mentoring/template`);
  const { data } = await res.json();
  const { hero, mentoringTypes, strategy, video, results, reviews } = data;
  return { hero, mentoringTypes, strategy, video, results, reviews };
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

  it('개설 목록 항목에는 모집 기간이 실리지 않는다', async () => {
    const res = await fetch(`${BASE}/live-mentoring?size=50`);
    const { data } = await res.json();
    for (const opening of data.openingList) {
      expect(opening).not.toHaveProperty('feedbackStartDate');
      expect(opening).not.toHaveProperty('feedbackEndDate');
    }
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
    // LC-3206 — 모집 기간은 응답에서 사라졌다.
    expect(data).not.toHaveProperty('feedbackStartDate');
    expect(data).not.toHaveProperty('feedbackEndDate');
    expect(data.status).toBe('DRAFT');
    // 백엔드에 없는 필드를 목이 만들어내면 실서버에서만 깨지는 코드가 통과한다.
    expect(data).not.toHaveProperty('isOpen');
  });

  it('PUT /mentor/live-mentoring/settings → 제목·타입·진행시간을 반영하고 전체 설정을 돌려준다', async () => {
    const body = {
      title: '수정된 타이틀',
      categories: ['RESUME'],
      durations: [30],
    };
    const res = await fetch(`${BASE}/mentor/live-mentoring/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const { data } = await res.json();
    expect(data).toMatchObject(body);
    expect(data.durations).toEqual(body.durations);
    // 프로필 참조 필드(nickname 등)는 요청에 없어도 응답엔 딸려온다.
    expect(data).toHaveProperty('nickname');
    expect(data).toHaveProperty('careers');
  });

  it('POST /openings → 지원하지 않는 진행시간은 400 INVALID_LIVE_MENTORING_DURATION', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/openings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...OPENING_BODY, durations: [45] }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe('INVALID_LIVE_MENTORING_DURATION');
  });

  it('POST /openings → 진행시간이 비어 있으면 400', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/openings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...OPENING_BODY, durations: [] }),
    });
    expect(res.status).toBe(400);
  });

  it('멘토가 개설을 종료하면 CLOSED·MENTOR_CANCELED 로 기록된다', async () => {
    // 자가승인이라 별도 관리자 승인 호출이 없다 — 개설 요청이 곧 승인+개설이다.
    await fetch(`${BASE}/mentor/live-mentoring/openings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(OPENING_BODY),
    });

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

    const approved = await fetch(
      `${BASE}/admin/live-mentoring?status=APPROVED`,
    ).then((r) => r.json());
    expect(
      approved.data.liveMentoringList.every(
        (row: { status: string }) => row.status === 'APPROVED',
      ),
    ).toBe(true);
  });

  it('GET /mentor/live-mentoring/template → 템플릿', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`);
    const { data } = await res.json();
    expect(data.intro.careerLines.length).toBeGreaterThan(0);
    expect(data.mentoringTypes.items.length).toBeGreaterThan(0);
    // 초안 + 활성 개설 없음이 목 기본값이라 편집할 수 있다.
    expect(data.mentoring.editable).toBe(true);
  });

  it('PUT /mentor/live-mentoring/template → 저장 후 상세 페이지 전체를 돌려준다', async () => {
    const payload = await detailPagePayload();
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        video: { ...payload.video, title: '바꿈 제목' },
      }),
    });

    const { data } = await res.json();
    expect(data.video.title).toBe('바꿈 제목');
    // 서버와 같게 응답은 전체다 — 읽기 전용 값도 함께 온다.
    expect(data.intro.careerLines.length).toBeGreaterThan(0);
  });

  it('PUT /mentor/live-mentoring/template → 요청 DTO에 없는 intro 가 섞이면 400', async () => {
    const payload = await detailPagePayload();
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, intro: { oneLiner: '안녕' } }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('intro');
  });

  it('PUT /mentor/live-mentoring/template → 필수 필드가 빠지면 400', async () => {
    const { hero, ...rest } = await detailPagePayload();
    expect(hero).toBeDefined();
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toContain('hero');
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
