import { getLowestPrice } from '@letscareer/mocks';
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

/**
 * 공유 MSW 핸들러(@letscareer/mocks)가 1대1 라이브 멘토링 엔드포인트에 대해
 * 페이징/필터/정렬/PUT echo를 올바르게 처리하는지 스모크 검증한다.
 * 와일드카드 prefix 패턴이라 임의 origin으로 요청해도 매칭된다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
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

  it('GET /mentor/live-mentoring/settings → 오픈 설정 메타', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/settings`);
    const { data } = await res.json();
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('nickname');
    expect(data).toHaveProperty('careers');
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('durations');
    expect(data).toHaveProperty('feedbackStartDate');
    expect(data).toHaveProperty('feedbackEndDate');
  });

  it('PUT /mentor/live-mentoring/settings → 6개 편집 필드를 echo하고, 프로필 참조 필드를 함께 내려준다', async () => {
    const body = {
      title: '수정된 타이틀',
      isOpen: false,
      categories: ['RESUME'],
      durations: [60],
      feedbackStartDate: '2026-08-01',
      feedbackEndDate: '2026-08-14',
    };
    const res = await fetch(`${BASE}/mentor/live-mentoring/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const { data } = await res.json();
    expect(data).toMatchObject(body);
    // 프로필 참조 필드(nickname 등)는 요청에 없어도 응답엔 딸려온다.
    expect(data).toHaveProperty('nickname');
    expect(data).toHaveProperty('careers');
  });

  it('GET /mentor/live-mentoring/template → 템플릿', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/template`);
    const { data } = await res.json();
    expect(data.intro.careerLines.length).toBeGreaterThan(0);
    expect(data.mentoringTypes.items.length).toBeGreaterThan(0);
  });

  it('PUT /mentor/live-mentoring/template → 받은 body를 echo', async () => {
    const body = { category: 'RESUME', mentoringPoints: '수정본' };
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

  it('GET /mentor/live-mentoring/open-status → 오픈현황 목록', async () => {
    const res = await fetch(`${BASE}/mentor/live-mentoring/open-status`);
    const { data } = await res.json();
    expect(Array.isArray(data.openStatusList)).toBe(true);
    expect(data.openStatusList[0]).toHaveProperty('reservationCount');
  });
});
