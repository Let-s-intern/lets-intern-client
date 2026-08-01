import {
  getLowestPrice,
  MY_LIVE_MENTORING_ID,
  resetLiveMentoringOpeningHistory,
} from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  liveMentoringSettingsSchema,
  liveMentoringTemplateSchema,
  openingHistoryResponseSchema,
} from '../liveMentoringSchema';

/**
 * 공유 MSW 핸들러(@letscareer/mocks)가 1대1 라이브 멘토링 엔드포인트에 대해
 * 페이징/필터/정렬/PUT echo를 올바르게 처리하는지 스모크 검증한다.
 * 와일드카드 prefix 패턴이라 임의 origin으로 요청해도 매칭된다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  // 개설 생성·강제 종료는 목 상태를 바꾸므로 테스트 간 격리한다.
  resetLiveMentoringOpeningHistory();
});
afterAll(() => server.close());

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
    expect(data.template.category).toBe(data.categories[0]);
    expect(Array.isArray(data.reviews)).toBe(true);
    expect(data.price).toBe(getLowestPrice(data.durations));
  });

  it('GET /mentor/live-mentoring/settings → 상품 설정 스키마로 파싱된다', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/settings`);
    const { data } = await res.json();
    const settings = liveMentoringSettingsSchema.parse(data);
    expect(settings.liveMentoringId).toBe(MY_LIVE_MENTORING_ID);
    expect(settings.status).toBe('DRAFT');
    // 개설에 딸린 값은 더 이상 상품 설정에 없다.
    expect(data).not.toHaveProperty('isOpen');
    expect(data).not.toHaveProperty('durations');
    expect(data).not.toHaveProperty('feedbackStartDate');
    expect(data).not.toHaveProperty('feedbackEndDate');
  });

  it('PUT /mentor/live-mentoring/settings → body echo 가 아니라 상품 정보 전체를 돌려준다', async () => {
    const body = { title: '수정된 타이틀', categories: ['RESUME'] };
    const res = await fetch(`${BASE}/mentor/live-mentoring/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const { data } = await res.json();
    const settings = liveMentoringSettingsSchema.parse(data);
    expect(settings.title).toBe('수정된 타이틀');
    expect(settings.categories).toEqual(['RESUME']);
    // 요청에 없던 필드도 응답에 실린다(서버는 GetLiveMentoringSettingsResponseDto 전체를 돌려준다).
    expect(settings.liveMentoringId).toBe(MY_LIVE_MENTORING_ID);
    expect(settings.status).toBe('DRAFT');
    expect(settings.nickname).toBeTruthy();
    expect(settings.careers.length).toBeGreaterThan(0);
  });

  it('GET /mentor/live-mentoring/template → 템플릿 스키마로 파싱된다', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`);
    const { data } = await res.json();
    const template = liveMentoringTemplateSchema.parse(data);
    expect(template.intro.careerLines.length).toBeGreaterThan(0);
    expect(template.mentoringTypes.items.length).toBeGreaterThan(0);
    expect(template.mentoring.liveMentoringId).toBe(MY_LIVE_MENTORING_ID);
    expect(template.mentoring.status).toBe('DRAFT');
    // DRAFT 이고 활성 개설이 없으므로 편집 가능하다.
    expect(template.mentoring.editable).toBe(true);
    expect(template.currentOpening).toBeNull();
  });

  it('PUT /mentor/live-mentoring/template → 편집분에 상태 블록을 얹어 GET 과 같은 전문을 돌려준다', async () => {
    const getRes = await fetch(`${BASE}/mentor/live-mentoring/template`);
    const current = liveMentoringTemplateSchema.parse(
      (await getRes.json()).data,
    );
    const body = {
      ...current,
      hero: { bullets: ['수정된 불릿'] },
    };
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const saved = liveMentoringTemplateSchema.parse((await res.json()).data);
    expect(saved.hero.bullets).toEqual(['수정된 불릿']);
    // 요청 바디가 상태 블록을 잃어도 응답에는 남아 있어야 한다.
    expect(saved.mentoring.liveMentoringId).toBe(MY_LIVE_MENTORING_ID);
    expect(saved.currentOpening).toBeNull();
  });

  it('PUT /mentor/live-mentoring/template → 편집 영역만 보내도 상태 블록이 붙는다', async () => {
    const getRes = await fetch(`${BASE}/mentor/live-mentoring/template`);
    const {
      mentoring: _m,
      currentOpening: _c,
      ...editable
    } = (await getRes.json()).data;
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editable),
    });
    const saved = liveMentoringTemplateSchema.parse((await res.json()).data);
    expect(saved.mentoring.status).toBe('DRAFT');
  });

  it('GET /mentor/live-mentoring/settlement → 정산행 목록', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/settlement`);
    const { data } = await res.json();
    expect(Array.isArray(data.settlementList)).toBe(true);
    expect(data.settlementList[0]).toHaveProperty('status');
  });

  it('GET /mentor/live-mentoring/open-status → 개설 이력 스키마로 파싱되고 openingId 내림차순이다', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/open-status`);
    const history = openingHistoryResponseSchema.parse((await res.json()).data);

    expect(history.liveMentoringId).toBe(MY_LIVE_MENTORING_ID);
    const ids = history.openings.map((opening) => opening.openingId);
    expect(ids).toEqual([...ids].sort((a, b) => b - a));

    // 종료된 개설은 종료 시각·사유를 갖는다.
    const closed = history.openings.filter(
      (opening) => opening.status === 'CLOSED',
    );
    expect(closed.length).toBeGreaterThan(0);
    for (const opening of closed) {
      expect(opening.closedAt).toBeTruthy();
      expect(['PERIOD_EXPIRED', 'ADMIN_FORCED']).toContain(opening.closeReason);
    }
  });

  it('POST /mentor/live-mentoring/openings → 새 개설이 이력 맨 앞에 붙고 이력 전체를 돌려준다', async () => {
    const before = openingHistoryResponseSchema.parse(
      (await (await fetch(`${BASE}/mentor/live-mentoring/open-status`)).json())
        .data,
    );

    const res = await fetch(`${BASE}/mentor/live-mentoring/openings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '새 개설',
        categories: ['PERSONAL_STATEMENT'],
        durations: [30, 60],
        feedbackStartDate: '2026-08-10',
        feedbackEndDate: '2026-08-23',
      }),
    });
    const after = openingHistoryResponseSchema.parse((await res.json()).data);

    expect(after.openings).toHaveLength(before.openings.length + 1);
    const created = after.openings[0];
    expect(created.openingId).toBeGreaterThan(before.openings[0].openingId);
    expect(created.status).toBe('OPEN');
    expect(created.closedAt).toBeNull();
    expect(created.closeReason).toBeNull();
    expect(created.feedbackStartDate).toBe('2026-08-10');
    // 가격은 서버 고정값이라 요청에 없고 진행시간에서 파생된다.
    expect(created.durationPrices).toEqual([
      { duration: 30, price: 35000 },
      { duration: 60, price: 60000 },
    ]);

    // 생성 결과는 이어지는 조회에도 반영된다.
    const reloaded = openingHistoryResponseSchema.parse(
      (await (await fetch(`${BASE}/mentor/live-mentoring/open-status`)).json())
        .data,
    );
    expect(reloaded.openings[0].openingId).toBe(created.openingId);
  });
});
