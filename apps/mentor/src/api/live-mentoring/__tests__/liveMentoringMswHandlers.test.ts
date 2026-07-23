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
  it('GET /live-mentoring/mentors → 서버 페이징 응답(content/totalPages/totalElements)', async () => {
    const res = await fetch(`${BASE}/live-mentoring/mentors?page=0&size=9`);
    const { data } = await res.json();
    expect(data.page).toBe(0);
    expect(data.size).toBe(9);
    expect(data.content).toHaveLength(9);
    expect(data.totalElements).toBeGreaterThanOrEqual(12);
    expect(data.totalPages).toBeGreaterThanOrEqual(2);
  });

  it('page=1 은 나머지 항목을 반환한다(2페이지 검증)', async () => {
    const res = await fetch(`${BASE}/live-mentoring/mentors?page=1&size=9`);
    const { data } = await res.json();
    expect(data.page).toBe(1);
    expect(data.content.length).toBeGreaterThan(0);
    expect(data.content.length).toBeLessThanOrEqual(9);
  });

  it('category 필터가 반영된다', async () => {
    const res = await fetch(
      `${BASE}/live-mentoring/mentors?category=PORTFOLIO&size=50`,
    );
    const { data } = await res.json();
    expect(data.content.length).toBeGreaterThan(0);
    expect(
      data.content.every((c: { categories: string[] }) =>
        c.categories.includes('PORTFOLIO'),
      ),
    ).toBe(true);
  });

  it('sort=rating 은 평점 내림차순 정렬한다', async () => {
    const res = await fetch(
      `${BASE}/live-mentoring/mentors?sort=rating&size=50`,
    );
    const { data } = await res.json();
    const ratings = data.content.map((c: { rating: number }) => c.rating);
    const sorted = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sorted);
  });

  it('sort=reviews 는 후기 많은순으로 정렬한다', async () => {
    const res = await fetch(
      `${BASE}/live-mentoring/mentors?sort=reviews&size=50`,
    );
    const { data } = await res.json();
    const counts = data.content.map(
      (c: { reviewCount: number }) => c.reviewCount,
    );
    const sorted = [...counts].sort((a, b) => b - a);
    expect(counts).toEqual(sorted);
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
    expect(data.faq.length).toBeGreaterThan(0);
    expect(data.process.length).toBeGreaterThan(0);
    expect(data.checklist.length).toBeGreaterThan(0);
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
