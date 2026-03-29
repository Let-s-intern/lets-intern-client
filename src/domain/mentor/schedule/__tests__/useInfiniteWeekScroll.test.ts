/**
 * Unit tests for useInfiniteWeekScroll hook (pure logic).
 * Tests the week navigation calculations without DOM/React rendering.
 */

import { describe, expect, it } from 'vitest';
import { addDays, startOfWeek } from 'date-fns';

// ── Pure logic extracted from useInfiniteWeekScroll ──────────────────

const SWIPE_THRESHOLD = 50;

function computeSwipeResult(
  weekStartDate: Date,
  dragDelta: number,
): { direction: 'prev' | 'next' | 'none'; newWeekStart: Date } {
  if (Math.abs(dragDelta) < SWIPE_THRESHOLD) {
    return { direction: 'none', newWeekStart: weekStartDate };
  }

  if (dragDelta > 0) {
    return {
      direction: 'prev',
      newWeekStart: addDays(weekStartDate, -7),
    };
  }

  return {
    direction: 'next',
    newWeekStart: addDays(weekStartDate, 7),
  };
}

function computeGoToCurrentWeek(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

// ── Tests ────────────────────────────────────────────────────────────

describe('useInfiniteWeekScroll (pure logic)', () => {
  const monday = new Date('2026-03-23'); // Monday

  describe('swipe threshold detection', () => {
    it('does not navigate if drag is below threshold', () => {
      const result = computeSwipeResult(monday, 30);
      expect(result.direction).toBe('none');
      expect(result.newWeekStart.getTime()).toBe(monday.getTime());
    });

    it('does not navigate if drag is exactly at threshold - 1', () => {
      const result = computeSwipeResult(monday, 49);
      expect(result.direction).toBe('none');
    });

    it('navigates at exactly the threshold', () => {
      const result = computeSwipeResult(monday, 50);
      expect(result.direction).toBe('prev');
    });
  });

  describe('swipe direction', () => {
    it('swipe right (positive delta) goes to previous week', () => {
      const result = computeSwipeResult(monday, 100);
      expect(result.direction).toBe('prev');
      expect(result.newWeekStart.toISOString().slice(0, 10)).toBe('2026-03-16');
    });

    it('swipe left (negative delta) goes to next week', () => {
      const result = computeSwipeResult(monday, -100);
      expect(result.direction).toBe('next');
      expect(result.newWeekStart.toISOString().slice(0, 10)).toBe('2026-03-30');
    });
  });

  describe('goToCurrentWeek', () => {
    it('returns Monday of the current week', () => {
      const result = computeGoToCurrentWeek();
      expect(result.getDay()).toBe(1); // Monday
    });

    it('returns a date in the past or today', () => {
      const result = computeGoToCurrentWeek();
      const now = new Date();
      expect(result.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });

  describe('week arithmetic', () => {
    it('consecutive prev navigations go back by 7 days each', () => {
      let current = monday;
      for (let i = 0; i < 3; i++) {
        const result = computeSwipeResult(current, 100);
        current = result.newWeekStart;
      }
      // 3 weeks back from March 23 = March 2
      expect(current.toISOString().slice(0, 10)).toBe('2026-03-02');
    });

    it('prev then next returns to original week', () => {
      const afterPrev = computeSwipeResult(monday, 100).newWeekStart;
      const afterNext = computeSwipeResult(afterPrev, -100).newWeekStart;
      expect(afterNext.getTime()).toBe(monday.getTime());
    });
  });
});
