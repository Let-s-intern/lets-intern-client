import { useCallback, useMemo, useState } from 'react';

import { useMentorChallengeListQuery } from '@/api/user/user';
import type { PeriodBarData } from '../types';

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
  const [barsMap, setBarsMap] = useState<Map<string, PeriodBarData>>(new Map());

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
   * 해당 챌린지의 피드백 일정 목록을 feedbackStartDate 순으로 반환.
   */
  const getFeedbackDates = useCallback(
    (challengeId: number): Date[] => {
      return allBarsUnfiltered
        .filter((bar) => bar.challengeId === challengeId)
        .map((bar) => new Date(bar.feedbackStartDate))
        .sort((a, b) => a.getTime() - b.getTime());
    },
    [allBarsUnfiltered],
  );

  /**
   * 오늘에서 가장 가까운 피드백 기간의 feedbackStartDate를 반환.
   */
  const findNearestDate = useCallback(
    (challengeId: number): Date | null => {
      const dates = getFeedbackDates(challengeId);
      if (dates.length === 0) return null;

      const now = Date.now();
      let nearest = dates[0];
      for (const d of dates) {
        if (Math.abs(d.getTime() - now) < Math.abs(nearest.getTime() - now)) {
          nearest = d;
        }
      }
      return nearest;
    },
    [getFeedbackDates],
  );

  /**
   * 현재 날짜의 다음 피드백 일정을 반환. 마지막이면 처음으로 순환.
   */
  const findNextDate = useCallback(
    (challengeId: number, currentDate: Date): Date | null => {
      const dates = getFeedbackDates(challengeId);
      if (dates.length === 0) return null;

      const currentTime = currentDate.getTime();
      const nextIdx = dates.findIndex((d) => d.getTime() > currentTime);
      // 다음이 있으면 다음, 없으면 처음으로 순환
      return dates[nextIdx >= 0 ? nextIdx : 0];
    },
    [getFeedbackDates],
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
    findNextDate,
  };
}
