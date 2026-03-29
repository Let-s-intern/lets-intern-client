import { useCallback, useMemo, useState } from 'react';

import { useMentorChallengeListQuery } from '@/api/user/user';
import type { PeriodBarData } from '../challenge-period/ChallengePeriodBar';

/**
 * Manages challenge data, bar aggregation, and challenge filtering for the schedule page.
 *
 * Key design: WeeklySummary uses `allBarsUnfiltered` (no filter applied),
 * while WeeklyCalendar uses `filteredBars` (respects selectedChallengeId).
 */
export function useScheduleData() {
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(
    null,
  );

  const { data: challengeListData } = useMentorChallengeListQuery();
  const allChallenges = challengeListData?.myChallengeMentorVoList ?? [];
  // Only show in-progress challenges in the schedule
  const challenges = useMemo(
    () => allChallenges.filter((c) => c.programStatusType === 'PROCEEDING'),
    [allChallenges],
  );

  // Bars collected from child data fetchers (keyed by "challengeId-missionId")
  const [barsMap, setBarsMap] = useState<Map<string, PeriodBarData>>(
    new Map(),
  );

  const handleData = useCallback((key: string, bar: PeriodBarData) => {
    setBarsMap((prev) => {
      const next = new Map(prev);
      next.set(key, bar);
      return next;
    });
  }, []);

  // All bars without any filter — used by WeeklySummary & height calculation
  const allBarsUnfiltered = useMemo(() => {
    const result: PeriodBarData[] = [];
    barsMap.forEach((bar) => result.push(bar));
    return result;
  }, [barsMap]);

  // Filtered bars — used by WeeklyCalendar
  const filteredBars = useMemo(() => {
    if (selectedChallengeId === null) return allBarsUnfiltered;
    return allBarsUnfiltered.filter(
      (bar) => bar.challengeId === selectedChallengeId,
    );
  }, [allBarsUnfiltered, selectedChallengeId]);

  const challengeFilterItems = useMemo(
    () =>
      challenges.map((c, index) => ({
        challengeId: c.challengeId,
        title: c.title,
        colorIndex: index,
      })),
    [challenges],
  );

  /**
   * Find the farthest incomplete feedback date for a given challenge.
   * Returns the startDate of the bar that is not fully completed
   * and has the latest startDate. Falls back to the latest bar if all complete.
   */
  const findNearestDate = useCallback(
    (challengeId: number): Date | null => {
      let farthestIncomplete: PeriodBarData | null = null;
      let farthestAny: PeriodBarData | null = null;

      for (const bar of allBarsUnfiltered) {
        if (bar.challengeId !== challengeId) continue;

        const barStart = new Date(bar.startDate).getTime();

        // Track farthest bar overall (fallback)
        if (!farthestAny || barStart > new Date(farthestAny.startDate).getTime()) {
          farthestAny = bar;
        }

        // Track farthest incomplete bar (waiting or in-progress > 0)
        const isIncomplete = bar.waitingCount > 0 || bar.inProgressCount > 0;
        if (isIncomplete) {
          if (!farthestIncomplete || barStart > new Date(farthestIncomplete.startDate).getTime()) {
            farthestIncomplete = bar;
          }
        }
      }

      const target = farthestIncomplete ?? farthestAny;
      if (!target) return null;
      return new Date(target.startDate);
    },
    [allBarsUnfiltered],
  );

  return {
    challenges,
    selectedChallengeId,
    setSelectedChallengeId,
    allBarsUnfiltered,
    filteredBars,
    handleData,
    challengeFilterItems,
    findNearestDate,
  };
}
