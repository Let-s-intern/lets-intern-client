/**
 * Unit tests for useInfiniteWeekScroll hook (pure logic).
 * Tests the week navigation calculations without DOM/React rendering.
 */

import { describe, expect, it } from 'vitest';
import { addDays, startOfWeek } from 'date-fns';

// ── Pure logic extracted from useInfiniteWeekScroll ──────────────────

/** Simulates scroll-snap panel detection: panel 0 = prev, 1 = stay, 2 = next */
function computeScrollResult(
  weekStartDate: Date,
  panelIndex: number,
): { direction: 'prev' | 'next' | 'none'; newWeekStart: Date } {
  if (panelIndex === 0) {
    return { direction: 'prev', newWeekStart: addDays(weekStartDate, -7) };
  }
  if (panelIndex === 2) {
    return { direction: 'next', newWeekStart: addDays(weekStartDate, 7) };
  }
  return { direction: 'none', newWeekStart: weekStartDate };
}

function computeGoToCurrentWeek(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
}

// ── Tests ────────────────────────────────────────────────────────────

describe('useInfiniteWeekScroll (scroll-snap logic)', () => {
  const monday = new Date('2026-03-23'); // Monday

  describe('panel detection', () => {
    it('center panel (1) does not navigate', () => {
      const result = computeScrollResult(monday, 1);
      expect(result.direction).toBe('none');
      expect(result.newWeekStart.getTime()).toBe(monday.getTime());
    });

    it('left panel (0) navigates to previous week', () => {
      const result = computeScrollResult(monday, 0);
      expect(result.direction).toBe('prev');
      expect(result.newWeekStart.toISOString().slice(0, 10)).toBe('2026-03-16');
    });

    it('right panel (2) navigates to next week', () => {
      const result = computeScrollResult(monday, 2);
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
        const result = computeScrollResult(current, 0);
        current = result.newWeekStart;
      }
      // 3 weeks back from March 23 = March 2
      expect(current.toISOString().slice(0, 10)).toBe('2026-03-02');
    });

    it('prev then next returns to original week', () => {
      const afterPrev = computeScrollResult(monday, 0).newWeekStart;
      const afterNext = computeScrollResult(afterPrev, 2).newWeekStart;
      expect(afterNext.getTime()).toBe(monday.getTime());
    });
  });
});
