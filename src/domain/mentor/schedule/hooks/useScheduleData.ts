import { useCallback, useMemo, useState } from 'react';

import { useMentorChallengeListQuery } from '@/api/user/user';
import type { PeriodBarData } from '../challenge-period/ChallengePeriodBar';

interface UseScheduleDataReturn {
  challenges: ReturnType<typeof useMentorChallengeListQuery>['data'] extends
    | { myChallengeMentorVoList: infer T }
    | undefined
    ? T extends (infer U)[]
      ? U[]
      : never
    : never;
  selectedChallengeId: number | null;
  setSelectedChallengeId: (id: number | null) => void;
  allBars: PeriodBarData[];
  handleData: (key: string, bar: PeriodBarData) => void;
  challengeFilterItems: { challengeId: number; title: string }[];
}

/**
 * Manages challenge data, bar aggregation, and challenge filtering for the schedule page.
 */
export function useScheduleData() {
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(
    null,
  );

  const { data: challengeListData } = useMentorChallengeListQuery();
  const challenges = challengeListData?.myChallengeMentorVoList ?? [];

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

  // Aggregate all bars, optionally filtered by selected challenge
  const allBars = useMemo(() => {
    const result: PeriodBarData[] = [];
    barsMap.forEach((bar) => {
      if (
        selectedChallengeId === null ||
        selectedChallengeId === bar.challengeId
      ) {
        result.push(bar);
      }
    });
    return result;
  }, [barsMap, selectedChallengeId]);

  const challengeFilterItems = useMemo(
    () =>
      challenges.map((c) => ({
        challengeId: c.challengeId,
        title: c.title,
      })),
    [challenges],
  );

  return {
    challenges,
    selectedChallengeId,
    setSelectedChallengeId,
    allBars,
    handleData,
    challengeFilterItems,
  };
}
