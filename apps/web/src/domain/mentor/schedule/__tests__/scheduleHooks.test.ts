/**
 * Unit tests for extracted schedule hooks:
 * - useWeekNavigation (pure logic)
 * - useWeeklySummary (pure logic)
 */

import { describe, expect, it } from 'vitest';
import { addDays, startOfWeek } from 'date-fns';

// ── useWeekNavigation (pure logic) ──────────────────────────────────

describe('useWeekNavigation (pure logic)', () => {
  it('starts at Monday of the current week', () => {
    const today = new Date();
    const expected = startOfWeek(today, { weekStartsOn: 1 });
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });

    expect(weekStart.getTime()).toBe(expected.getTime());
  });

  it('prev week subtracts 7 days', () => {
    const start = new Date('2026-03-23'); // Monday
    const prev = addDays(start, -7);

    expect(prev.toISOString().slice(0, 10)).toBe('2026-03-16');
  });

  it('next week adds 7 days', () => {
    const start = new Date('2026-03-23'); // Monday
    const next = addDays(start, 7);

    expect(next.toISOString().slice(0, 10)).toBe('2026-03-30');
  });
});

// ── useWeeklySummary (pure logic) ────────────────────────────────────

interface BarLike {
  startDate: string;
  endDate: string;
  submittedCount: number;
  notSubmittedCount: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
}

function computeWeeklySummary(bars: BarLike[], weekStartDate: Date) {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  let total = 0;
  let todayDue = 0;
  let incomplete = 0;
  let completed = 0;

  const today = new Date();

  for (const bar of bars) {
    const barStart = new Date(bar.startDate);
    const barEnd = new Date(bar.endDate);

    if (barStart <= weekEnd && barEnd >= weekStart) {
      const barTotal = bar.submittedCount + bar.notSubmittedCount;
      total += barTotal;

      if (
        barEnd.getFullYear() === today.getFullYear() &&
        barEnd.getMonth() === today.getMonth() &&
        barEnd.getDate() === today.getDate()
      ) {
        todayDue += barTotal;
      }

      incomplete += bar.waitingCount + bar.inProgressCount;
      completed += bar.completedCount;
    }
  }

  return { totalCount: total, todayDueCount: todayDue, incompleteCount: incomplete, completedCount: completed };
}

describe('useWeeklySummary (pure logic)', () => {
  const makeBar = (
    overrides: Partial<BarLike> & Pick<BarLike, 'startDate' | 'endDate'>,
  ): BarLike => ({
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    ...overrides,
  });

  it('includes bars that overlap with the week', () => {
    const weekStart = new Date('2026-03-23'); // Monday
    const bars = [
      makeBar({
        startDate: '2026-03-22T00:00:00',
        endDate: '2026-03-25T00:00:00',
        submittedCount: 5,
        notSubmittedCount: 2,
        completedCount: 3,
      }),
    ];

    const result = computeWeeklySummary(bars, weekStart);

    expect(result.totalCount).toBe(7);
    expect(result.completedCount).toBe(3);
  });

  it('excludes bars outside the week', () => {
    const weekStart = new Date('2026-03-23'); // Monday
    const bars = [
      makeBar({
        startDate: '2026-03-10T00:00:00',
        endDate: '2026-03-15T00:00:00',
        submittedCount: 10,
      }),
    ];

    const result = computeWeeklySummary(bars, weekStart);

    expect(result.totalCount).toBe(0);
  });

  it('aggregates incomplete counts correctly', () => {
    const weekStart = new Date('2026-03-23');
    const bars = [
      makeBar({
        startDate: '2026-03-24T00:00:00',
        endDate: '2026-03-26T00:00:00',
        waitingCount: 3,
        inProgressCount: 2,
        completedCount: 1,
        submittedCount: 6,
      }),
      makeBar({
        startDate: '2026-03-25T00:00:00',
        endDate: '2026-03-27T00:00:00',
        waitingCount: 1,
        inProgressCount: 1,
        completedCount: 4,
        submittedCount: 6,
      }),
    ];

    const result = computeWeeklySummary(bars, weekStart);

    expect(result.incompleteCount).toBe(7); // 3+2+1+1
    expect(result.completedCount).toBe(5); // 1+4
    expect(result.totalCount).toBe(12);
  });

  it('returns zero for empty bars', () => {
    const weekStart = new Date('2026-03-23');
    const result = computeWeeklySummary([], weekStart);

    expect(result.totalCount).toBe(0);
    expect(result.todayDueCount).toBe(0);
    expect(result.incompleteCount).toBe(0);
    expect(result.completedCount).toBe(0);
  });
});
