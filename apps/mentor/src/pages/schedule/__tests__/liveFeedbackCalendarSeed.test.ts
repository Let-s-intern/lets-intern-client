/**
 * Push 1 / 1.3.T1 — MSW 라이브 시드가 캘린더 파생에 충분한지 검증.
 *
 * 공유 MSW 핸들러(@letscareer/mocks)의 `/feedback/mentor`·`/feedback/mentor/slot`
 * 응답을 실제로 fetch 해 `deriveLiveFeedbackBars`로 파생한 뒤, 과거
 * LIVE_FEEDBACK_MOCK_DATA 시나리오와 동등한 캘린더 바(세션/기간/오픈기간)가
 * 만들어지는지 확인한다.
 */
import { server } from '@letscareer/mocks/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  getMentorFeedbackSlotsResponseSchema,
  getMentorFeedbacksResponseSchema,
} from '@/api/feedback/feedbackSchema';

import { deriveLiveFeedbackBars } from '../hooks/useLiveFeedbackData';

const BASE = 'https://example.test';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

async function fetchSeed() {
  const listRes = await fetch(`${BASE}/feedback/mentor`);
  const listBody = await listRes.json();
  const sessions = getMentorFeedbacksResponseSchema.parse(
    listBody.data,
  ).feedbackList;

  const slotRes = await fetch(`${BASE}/feedback/mentor/slot`);
  const slotBody = await slotRes.json();
  const slots = getMentorFeedbackSlotsResponseSchema.parse(
    slotBody.data,
  ).feedbackSlotList;

  return { sessions, slots };
}

describe('라이브 캘린더 MSW 시드', () => {
  it('/feedback/mentor 시드는 여러 날짜·다중 챌린지(programTitle) 세션을 포함한다', async () => {
    const { sessions } = await fetchSeed();
    const titles = new Set(sessions.map((s) => s.programTitle));
    // QA용 자소서 챌린지 + 캘린더 시드 2개 챌린지
    expect(titles.size).toBeGreaterThanOrEqual(2);
    const startDates = new Set(sessions.map((s) => s.startDate.slice(0, 10)));
    expect(startDates.size).toBeGreaterThanOrEqual(3);
  });

  it('/feedback/mentor/slot 시드는 오픈기간 파생용 날짜 분포를 갖는다', async () => {
    const { slots } = await fetchSeed();
    expect(slots.length).toBeGreaterThanOrEqual(2);
    const days = new Set(slots.map((s) => s.startDate.slice(0, 10)));
    expect(days.size).toBeGreaterThanOrEqual(2);
  });

  it('시드를 파생하면 세션·기간·오픈기간 바가 모두 생성된다', async () => {
    const { sessions, slots } = await fetchSeed();
    const bars = deriveLiveFeedbackBars(sessions, slots);

    expect(bars.some((b) => b.barType === 'live-feedback')).toBe(true);
    expect(bars.some((b) => b.barType === 'live-feedback-period')).toBe(true);
    // 오픈기간은 글로벌 1개
    expect(
      bars.filter((b) => b.barType === 'live-feedback-mentor-open'),
    ).toHaveLength(1);
    // mentee-open 은 생성하지 않음
    expect(bars.some((b) => b.barType === 'live-feedback-mentee-open')).toBe(
      false,
    );
  });

  it('기간 바는 (challenge × 회차) 조합 수만큼 생성된다', async () => {
    const { sessions } = await fetchSeed();
    const bars = deriveLiveFeedbackBars(sessions, []);
    // 같은 챌린지라도 회차(th)가 다르면 기간 바가 분리된다.
    const uniquePairs = new Set(
      sessions.map((s) => `${s.programTitle}|${s.th ?? 1}`),
    ).size;
    const periodBars = bars.filter((b) => b.barType === 'live-feedback-period');
    expect(periodBars).toHaveLength(uniquePairs);
    // 시드의 기필코 경험정리 21기는 1차/2차로 분리되어 th=2 기간 바가 존재한다.
    expect(periodBars.some((b) => b.th === 2)).toBe(true);
  });
});
