'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  addDays,
  isSameDay,
  startOfWeek,
} from 'date-fns';

import {
  useMentorChallengeListQuery,
  type ChallengeMentorVo,
} from '@/api/user/user';
import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useMentorMissionFeedbackAttendanceQuery } from '@/api/challenge/challenge';
import type { PeriodBarData } from './ChallengePeriodBar';

import WelcomeMessage from './WelcomeMessage';
import WeeklySummary from './WeeklySummary';
import WeekNavigation from './WeekNavigation';
import ChallengeFilter from './ChallengeFilter';
import WeeklyCalendar from './WeeklyCalendar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build PeriodBarData from missions + attendance data */
function buildBars(
  challenge: ChallengeMentorVo,
  missions: {
    id: number;
    title?: string | null;
    th: number;
    startDate: string;
    endDate: string;
  }[],
  attendanceMap: Map<
    number,
    {
      submittedCount: number;
      notSubmittedCount: number;
      waitingCount: number;
      inProgressCount: number;
      completedCount: number;
    }
  >,
): PeriodBarData[] {
  return missions.map((m) => {
    const att = attendanceMap.get(m.id) ?? {
      submittedCount: 0,
      notSubmittedCount: 0,
      waitingCount: 0,
      inProgressCount: 0,
      completedCount: 0,
    };

    return {
      challengeId: challenge.challengeId,
      missionId: m.id,
      challengeTitle: challenge.title,
      th: m.th,
      startDate: m.startDate,
      endDate: m.endDate,
      ...att,
    };
  });
}

// ---------------------------------------------------------------------------
// Per-challenge data fetcher component (hook rules require stable call count)
// ---------------------------------------------------------------------------

interface ChallengeDataProps {
  challenge: ChallengeMentorVo;
  onData: (challengeId: number, bars: PeriodBarData[]) => void;
}

/**
 * Invisible component that fetches missions + attendance for a single challenge
 * and reports the computed bars upward via onData callback.
 */
const ChallengeDataFetcher = ({ challenge, onData }: ChallengeDataProps) => {
  const { data: missionData } = useMentorMissionFeedbackListQuery(
    challenge.challengeId,
    { enabled: true },
  );

  const missions = missionData?.missionList ?? [];

  // We fetch attendance for the first mission only as a summary source.
  // In a full implementation each mission would have its own attendance query,
  // but to avoid a dynamic number of hooks we aggregate from the list query.
  // For now we fetch the first mission's attendance to populate counts.
  const firstMissionId = missions.length > 0 ? missions[0].id : undefined;

  const { data: attendanceData } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: challenge.challengeId,
    missionId: firstMissionId,
    enabled: !!firstMissionId,
  });

  // Build attendance summary from the attendance list
  const attendanceMap = useMemo(() => {
    const map = new Map<
      number,
      {
        submittedCount: number;
        notSubmittedCount: number;
        waitingCount: number;
        inProgressCount: number;
        completedCount: number;
      }
    >();

    if (!attendanceData?.attendanceList) return map;

    // For now, map the first mission's attendance to all missions
    // (the API gives per-mission attendance when called individually)
    const list = attendanceData.attendanceList;
    const submitted = list.filter((a) => a.status === 'PRESENT').length;
    const notSubmitted = list.filter((a) => a.status === 'ABSENT').length;
    const waiting = list.filter((a) => a.feedbackStatus === 'WAITING').length;
    const inProgress = list.filter(
      (a) => a.feedbackStatus === 'IN_PROGRESS',
    ).length;
    const completed = list.filter(
      (a) =>
        a.feedbackStatus === 'COMPLETED' || a.feedbackStatus === 'CONFIRMED',
    ).length;

    for (const m of missions) {
      map.set(m.id, {
        submittedCount: submitted,
        notSubmittedCount: notSubmitted,
        waitingCount: waiting,
        inProgressCount: inProgress,
        completedCount: completed,
      });
    }

    return map;
  }, [attendanceData, missions]);

  // Report bars upward whenever data changes
  useMemo(() => {
    if (missions.length > 0) {
      const bars = buildBars(challenge, missions, attendanceMap);
      onData(challenge.challengeId, bars);
    }
  }, [challenge, missions, attendanceMap, onData]);

  return null;
};

// ---------------------------------------------------------------------------
// SchedulePage
// ---------------------------------------------------------------------------

const SchedulePage = () => {
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(
    null,
  );

  // Mentor challenge list
  const { data: challengeListData } = useMentorChallengeListQuery();
  const challenges = challengeListData?.myChallengeMentorVoList ?? [];

  // Bars collected from child data fetchers
  const [barsMap, setBarsMap] = useState<Map<number, PeriodBarData[]>>(
    new Map(),
  );

  const handleData = useCallback(
    (challengeId: number, bars: PeriodBarData[]) => {
      setBarsMap((prev) => {
        const next = new Map(prev);
        next.set(challengeId, bars);
        return next;
      });
    },
    [],
  );

  // Aggregate all bars, optionally filtered by selected challenge
  const allBars = useMemo(() => {
    const result: PeriodBarData[] = [];
    barsMap.forEach((bars, challengeId) => {
      if (selectedChallengeId === null || selectedChallengeId === challengeId) {
        result.push(...bars);
      }
    });
    return result;
  }, [barsMap, selectedChallengeId]);

  // Weekly summary calculations
  const { totalCount, todayDueCount, incompleteCount } = useMemo(() => {
    const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    const today = new Date();

    let total = 0;
    let todayDue = 0;
    let incomplete = 0;

    for (const bar of allBars) {
      const barStart = new Date(bar.startDate);
      const barEnd = new Date(bar.endDate);

      // Check if the bar overlaps with the current week
      if (barStart <= weekEnd && barEnd >= weekStart) {
        const barTotal =
          bar.submittedCount + bar.notSubmittedCount;
        total += barTotal;

        // Today due: endDate is today
        if (isSameDay(barEnd, today)) {
          todayDue += barTotal;
        }

        // Incomplete: waiting + in progress
        incomplete += bar.waitingCount + bar.inProgressCount;
      }
    }

    return { totalCount: total, todayDueCount: todayDue, incompleteCount: incomplete };
  }, [allBars, weekStartDate]);

  const handleBarClick = (challengeId: number, missionId: number) => {
    // Navigate to the feedback detail page (placeholder for now)
    window.location.href = `/mentor/feedback/${challengeId}/${missionId}`;
  };

  const challengeFilterItems = challenges.map((c) => ({
    challengeId: c.challengeId,
    title: c.title,
  }));

  return (
    <div className="flex flex-col gap-6 p-8">
      <WelcomeMessage />

      <WeeklySummary
        totalCount={totalCount}
        todayDueCount={todayDueCount}
        incompleteCount={incompleteCount}
      />

      <WeekNavigation
        weekStartDate={weekStartDate}
        onWeekChange={setWeekStartDate}
      />

      <ChallengeFilter
        challenges={challengeFilterItems}
        selectedChallengeId={selectedChallengeId}
        onSelect={setSelectedChallengeId}
      />

      <WeeklyCalendar
        weekStartDate={weekStartDate}
        bars={allBars}
        onBarClick={handleBarClick}
      />

      {/* Invisible data fetchers for each challenge */}
      {challenges.map((c) => (
        <ChallengeDataFetcher
          key={c.challengeId}
          challenge={c}
          onData={handleData}
        />
      ))}
    </div>
  );
};

export default SchedulePage;
