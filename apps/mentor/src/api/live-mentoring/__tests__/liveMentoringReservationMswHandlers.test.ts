import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { liveMentoringReservationListSchema } from '../liveMentoringSchema';

/**
 * 공유 MSW 핸들러가 `GET /mentor/live-mentoring/reservations` 를
 * 계약대로(확정 건만 · 날짜 범위 필터) 처리하는지 검증한다.
 */
const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fetchReservations = async (query = '') => {
  const res = await fetch(`${BASE}/mentor/live-mentoring/reservations${query}`);
  const { data } = await res.json();
  return liveMentoringReservationListSchema.parse(data).reservationList;
};

describe('멘토 1대1 예약 목록 MSW 핸들러', () => {
  it('예약 목록을 응답 스키마 그대로 내려준다', async () => {
    const list = await fetchReservations();
    expect(list.length).toBeGreaterThan(0);
  });

  it('결제 완료 확정 건만 담겨 있다', async () => {
    const list = await fetchReservations();
    expect(list.every((r) => r.status === 'CONFIRMED')).toBe(true);
  });

  it('startDate 이전에 시작하는 예약은 제외된다', async () => {
    const all = await fetchReservations();
    const pivot = all[1].reservationStartAt;
    const filtered = await fetchReservations(
      `?startDate=${encodeURIComponent(pivot)}`,
    );
    expect(filtered.length).toBeLessThan(all.length);
    expect(
      filtered.every(
        (r) =>
          new Date(r.reservationStartAt).getTime() >= new Date(pivot).getTime(),
      ),
    ).toBe(true);
  });

  it('endDate 이후에 시작하는 예약은 제외된다', async () => {
    const all = await fetchReservations();
    const pivot = all[0].reservationStartAt;
    const filtered = await fetchReservations(
      `?endDate=${encodeURIComponent(pivot)}`,
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].reservationStartAt).toBe(pivot);
  });

  it('범위 밖이면 빈 목록이다', async () => {
    const filtered = await fetchReservations(
      '?startDate=2099-01-01T00:00:00&endDate=2099-12-31T00:00:00',
    );
    expect(filtered).toEqual([]);
  });

  it('질문·전달 파일 제출 여부 조합이 모두 들어 있다', async () => {
    const list = await fetchReservations();
    const combos = new Set(
      list.map((r) => `${r.questionWritten}-${r.attachmentSubmitted}`),
    );
    expect(combos).toContain('true-true');
    expect(combos).toContain('true-false');
    expect(combos).toContain('false-false');
  });
});
