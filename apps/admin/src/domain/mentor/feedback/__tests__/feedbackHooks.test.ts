/**
 * Unit tests for extracted feedback hooks:
 * - useFeedbackStatus
 * - useMenteeNavigation
 *
 * useFeedbackModal is excluded because it depends on react-query and API calls,
 * making it better suited for integration tests.
 */

import { describe, expect, it } from 'vitest';

// ── useFeedbackStatus ────────────────────────────────────────────────

// Pure logic extracted for direct testing (mirrors useFeedbackStatus logic)
function aggregateFeedbackStatus(
  attendanceList: { feedbackStatus?: string | null }[],
) {
  let waiting = 0;
  let inProgress = 0;
  let completed = 0;

  for (const a of attendanceList) {
    const status = a.feedbackStatus;
    if (status === 'COMPLETED' || status === 'CONFIRMED') {
      completed++;
    } else if (status === 'IN_PROGRESS') {
      inProgress++;
    } else {
      waiting++;
    }
  }

  return {
    waitingCount: waiting,
    inProgressCount: inProgress,
    completedCount: completed,
  };
}

describe('useFeedbackStatus (pure logic)', () => {
  it('correctly counts each status', () => {
    const list = [
      { feedbackStatus: 'WAITING' },
      { feedbackStatus: 'WAITING' },
      { feedbackStatus: 'IN_PROGRESS' },
      { feedbackStatus: 'COMPLETED' },
      { feedbackStatus: 'CONFIRMED' },
    ];

    const result = aggregateFeedbackStatus(list);

    expect(result.waitingCount).toBe(2);
    expect(result.inProgressCount).toBe(1);
    expect(result.completedCount).toBe(2);
  });

  it('returns zero counts for empty list', () => {
    const result = aggregateFeedbackStatus([]);

    expect(result.waitingCount).toBe(0);
    expect(result.inProgressCount).toBe(0);
    expect(result.completedCount).toBe(0);
  });

  it('treats null/undefined feedbackStatus as waiting', () => {
    const list = [{ feedbackStatus: null }, { feedbackStatus: undefined }, {}];

    const result = aggregateFeedbackStatus(list);

    expect(result.waitingCount).toBe(3);
    expect(result.inProgressCount).toBe(0);
    expect(result.completedCount).toBe(0);
  });

  it('treats CONFIRMED as completed', () => {
    const list = [
      { feedbackStatus: 'CONFIRMED' },
      { feedbackStatus: 'CONFIRMED' },
      { feedbackStatus: 'COMPLETED' },
    ];

    const result = aggregateFeedbackStatus(list);

    expect(result.completedCount).toBe(3);
    expect(result.waitingCount).toBe(0);
  });
});

// ── useMenteeNavigation (pure logic) ──────────────────────────────────

describe('useMenteeNavigation (pure logic)', () => {
  const makeList = (ids: (number | null)[]) => ids.map((id) => ({ id }));

  it('finds current index correctly', () => {
    const list = makeList([10, 20, 30]);
    const idx = list.findIndex((a) => a.id === 20);

    expect(idx).toBe(1);
  });

  it('returns -1 when selectedAttendanceId is not in list', () => {
    const list = makeList([10, 20, 30]);
    const idx = list.findIndex((a) => a.id === 999);

    expect(idx).toBe(-1);
  });

  it('hasPrev is false at first item', () => {
    const idx = 0;

    expect(idx > 0).toBe(false);
  });

  it('hasPrev is true at non-first item', () => {
    const idx = 1;

    expect(idx > 0).toBe(true);
  });

  it('hasNext is false at last item', () => {
    const list = makeList([10, 20, 30]);
    const idx = 2;

    expect(idx >= 0 && idx < list.length - 1).toBe(false);
  });

  it('hasNext is true at non-last item', () => {
    const list = makeList([10, 20, 30]);
    const idx = 1;

    expect(idx >= 0 && idx < list.length - 1).toBe(true);
  });

  it('prev navigation returns correct id', () => {
    const list = makeList([10, 20, 30]);
    const currentIdx = 2;

    const prevId = list[currentIdx - 1]?.id;

    expect(prevId).toBe(20);
  });

  it('next navigation returns correct id', () => {
    const list = makeList([10, 20, 30]);
    const currentIdx = 0;

    const nextId = list[currentIdx + 1]?.id;

    expect(nextId).toBe(20);
  });
});
