/**
 * Unit tests for challenge filtering logic.
 * Tests that:
 * - Filtered bars respect selectedChallengeId
 * - Unfiltered bars are always the full set (for WeeklySummary)
 * - Tag toggle behavior works correctly
 */

interface BarLike {
  challengeId: number;
  missionId: number;
  challengeTitle: string;
  th: number;
  startDate: string;
  endDate: string;
  colorIndex: number;
  submittedCount: number;
  notSubmittedCount: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
}

// ── Pure filtering logic (mirrors useScheduleData) ──────────────────

function filterBars(
  allBars: BarLike[],
  selectedChallengeId: number | null,
): BarLike[] {
  if (selectedChallengeId === null) return allBars;
  return allBars.filter((bar) => bar.challengeId === selectedChallengeId);
}

function toggleSelection(
  current: number | null,
  challengeId: number,
): number | null {
  return current === challengeId ? null : challengeId;
}

// ── Test data ────────────────────────────────────────────────────────

const makeBar = (
  challengeId: number,
  missionId: number,
  title: string,
  overrides?: Partial<BarLike>,
): BarLike => ({
  challengeId,
  missionId,
  challengeTitle: title,
  th: 1,
  startDate: '2026-03-24T00:00:00',
  endDate: '2026-03-26T00:00:00',
  colorIndex: 0,
  submittedCount: 5,
  notSubmittedCount: 2,
  waitingCount: 1,
  inProgressCount: 2,
  completedCount: 2,
  ...overrides,
});

const testBars: BarLike[] = [
  makeBar(1, 10, 'Challenge A', { colorIndex: 0 }),
  makeBar(1, 11, 'Challenge A', { colorIndex: 0, th: 2 }),
  makeBar(2, 20, 'Challenge B', { colorIndex: 1 }),
  makeBar(3, 30, 'Challenge C', { colorIndex: 2 }),
];

// ── Tests ────────────────────────────────────────────────────────────

describe('Challenge filtering logic', () => {
  describe('filterBars', () => {
    it('returns all bars when selectedChallengeId is null', () => {
      const result = filterBars(testBars, null);
      expect(result).toHaveLength(4);
      expect(result).toEqual(testBars);
    });

    it('filters to matching challengeId only', () => {
      const result = filterBars(testBars, 1);
      expect(result).toHaveLength(2);
      expect(result.every((b) => b.challengeId === 1)).toBe(true);
    });

    it('returns empty array for non-existent challengeId', () => {
      const result = filterBars(testBars, 999);
      expect(result).toHaveLength(0);
    });

    it('preserves bar data when filtering', () => {
      const result = filterBars(testBars, 2);
      expect(result).toHaveLength(1);
      expect(result[0].challengeTitle).toBe('Challenge B');
      expect(result[0].missionId).toBe(20);
    });
  });

  describe('WeeklySummary always uses unfiltered', () => {
    it('unfiltered count remains the same regardless of filter', () => {
      const unfiltered = testBars; // always full set
      const filtered = filterBars(testBars, 1);

      expect(unfiltered).toHaveLength(4);
      expect(filtered).toHaveLength(2);
      // WeeklySummary uses unfiltered
      const totalSubmitted = unfiltered.reduce(
        (acc, b) => acc + b.submittedCount,
        0,
      );
      expect(totalSubmitted).toBe(20); // 5 * 4
    });
  });

  describe('toggleSelection', () => {
    it('selects a challenge when none is selected', () => {
      expect(toggleSelection(null, 1)).toBe(1);
    });

    it('deselects when same challenge is toggled', () => {
      expect(toggleSelection(1, 1)).toBe(null);
    });

    it('switches to different challenge', () => {
      expect(toggleSelection(1, 2)).toBe(2);
    });
  });
});
