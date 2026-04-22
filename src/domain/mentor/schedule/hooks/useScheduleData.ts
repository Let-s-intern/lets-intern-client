import { useCallback, useMemo, useState } from 'react';

import { useMentorChallengeListQuery } from '@/api/user/user';
import type { PeriodBarData } from '../types';

interface UseScheduleDataOptions {
  /** 캘린더/네비게이션에 추가로 포함할 mock 바 (예: 서면 피드백 mock) */
  extraBars?: PeriodBarData[];
}

/**
 * Manages challenge data, bar aggregation, and challenge filtering for the schedule page.
 *
 * Key design: WeeklySummary uses `allBarsUnfiltered` (no filter applied),
 * while WeeklyCalendar uses `filteredBars` (respects selectedChallengeId).
 */
export function useScheduleData({ extraBars = [] }: UseScheduleDataOptions = {}) {
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

  // API 챌린지와 extraBars 챌린지를 합쳐 colorIndex를 순차 할당 (mock은 API 다음 인덱스부터)
  const challengeFilterItems = useMemo(() => {
    const apiItems = challenges.map((c, index) => ({
      challengeId: c.challengeId,
      title: c.title,
      colorIndex: index,
    }));
    const apiIds = new Set(apiItems.map((c) => c.challengeId));
    const extras: { challengeId: number; title: string; colorIndex: number }[] =
      [];
    const seen = new Set<number>();
    for (const bar of extraBars) {
      if (apiIds.has(bar.challengeId) || seen.has(bar.challengeId)) continue;
      seen.add(bar.challengeId);
      extras.push({
        challengeId: bar.challengeId,
        title: bar.challengeTitle,
        colorIndex: apiItems.length + extras.length,
      });
    }
    return [...apiItems, ...extras];
  }, [challenges, extraBars]);

  /** challengeId → colorIndex (API/mock 구분 없이 고유 색상 보장) */
  const challengeColorMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of challengeFilterItems) {
      map.set(item.challengeId, item.colorIndex);
    }
    return map;
  }, [challengeFilterItems]);

  // mock 바의 colorIndex를 재할당해 API 색상과 충돌 방지
  const remappedExtraBars = useMemo(
    () =>
      extraBars.map((bar) => ({
        ...bar,
        colorIndex: challengeColorMap.get(bar.challengeId) ?? bar.colorIndex,
      })),
    [extraBars, challengeColorMap],
  );

  // All bars without any filter — used by WeeklySummary & height calculation
  const allBarsUnfiltered = useMemo(() => {
    const result: PeriodBarData[] = [...remappedExtraBars];
    barsMap.forEach((bar) => result.push(bar));
    return result;
  }, [barsMap, remappedExtraBars]);

  // Filtered bars — used by WeeklyCalendar
  const filteredBars = useMemo(() => {
    if (selectedChallengeId === null) return allBarsUnfiltered;
    return allBarsUnfiltered.filter(
      (bar) => bar.challengeId === selectedChallengeId,
    );
  }, [allBarsUnfiltered, selectedChallengeId]);

  /**
   * 해당 챌린지의 "일정 단위" 시작일을 feedbackStartDate 순으로 반환.
   * 개별 라이브 세션(barType === 'live-feedback')은 라이브 기간의 하위 요소이므로 제외.
   */
  const getFeedbackDates = useCallback(
    (challengeId: number): Date[] => {
      return allBarsUnfiltered
        .filter(
          (bar) =>
            bar.challengeId === challengeId &&
            bar.barType !== 'live-feedback',
        )
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
    challengeColorMap,
    findNearestDate,
    findNextDate,
  };
}
