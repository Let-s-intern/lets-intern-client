'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addDays,
  isSameDay,
  startOfWeek,
} from 'date-fns';

import {
  useMentorChallengeListQuery,
  type ChallengeMentorVo,
} from '@/api/user/user';
import { useMentorMissionFeedbackListQuery, useMentorMissionFeedbackAttendanceQuery } from '@/api/challenge/challenge';
import type { PeriodBarData } from './ChallengePeriodBar';

import WelcomeMessage from './WelcomeMessage';
import WeeklySummary from './WeeklySummary';
import WeekNavigation from './WeekNavigation';
import ChallengeFilter from './ChallengeFilter';
import WeeklyCalendar from './WeeklyCalendar';
import FeedbackModal from '../feedback/FeedbackModal';

// ---------------------------------------------------------------------------
// Per-mission attendance fetcher (each mission needs its own API call)
// ---------------------------------------------------------------------------

const MissionAttendanceFetcher = ({
  challenge,
  mission,
  colorIndex,
  onData,
}: {
  challenge: ChallengeMentorVo;
  mission: { id: number; title?: string | null; th: number; startDate: string; endDate: string };
  colorIndex: number;
  onData: (key: string, bar: PeriodBarData) => void;
}) => {
  const { data: attendanceData } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: challenge.challengeId,
    missionId: mission.id,
    enabled: true,
  });

  useEffect(() => {
    const list = attendanceData?.attendanceList ?? [];
    const submitted = list.filter((a) => a.status !== 'ABSENT');
    const notSubmitted = list.filter((a) => a.status === 'ABSENT');

    const bar: PeriodBarData = {
      challengeId: challenge.challengeId,
      missionId: mission.id,
      challengeTitle: challenge.title,
      th: mission.th,
      startDate: mission.startDate,
      endDate: mission.endDate,
      colorIndex,
      submittedCount: submitted.length,
      notSubmittedCount: notSubmitted.length,
      // Only count feedback status for submitted attendees
      waitingCount: submitted.filter((a) => a.feedbackStatus === 'WAITING').length,
      inProgressCount: submitted.filter((a) => a.feedbackStatus === 'IN_PROGRESS').length,
      completedCount: submitted.filter(
        (a) => a.feedbackStatus === 'COMPLETED' || a.feedbackStatus === 'CONFIRMED',
      ).length,
    };

    onData(`${challenge.challengeId}-${mission.id}`, bar);
  }, [attendanceData, challenge, mission, colorIndex, onData]);

  return null;
};

// ---------------------------------------------------------------------------
// Per-challenge data fetcher (fetches mission list, delegates attendance to per-mission)
// ---------------------------------------------------------------------------

interface ChallengeDataProps {
  challenge: ChallengeMentorVo;
  colorIndex: number;
  onData: (key: string, bar: PeriodBarData) => void;
}

const ChallengeDataFetcher = ({ challenge, colorIndex, onData }: ChallengeDataProps) => {
  const { data: missionData } = useMentorMissionFeedbackListQuery(
    challenge.challengeId,
    { enabled: true },
  );

  const missions = missionData?.missionList ?? [];

  return (
    <>
      {missions.map((m) => (
        <MissionAttendanceFetcher
          key={m.id}
          challenge={challenge}
          mission={m}
          colorIndex={colorIndex}
          onData={onData}
        />
      ))}
    </>
  );
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

  // Feedback modal state
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    challengeId: number;
    missionId: number;
    challengeTitle?: string;
    missionTh?: number;
  }>({ isOpen: false, challengeId: 0, missionId: 0 });

  const { data: challengeListData } = useMentorChallengeListQuery();
  const challenges = challengeListData?.myChallengeMentorVoList ?? [];

  // Bars collected from child data fetchers (keyed by "challengeId-missionId")
  const [barsMap, setBarsMap] = useState<Map<string, PeriodBarData>>(
    new Map(),
  );

  const handleData = useCallback(
    (key: string, bar: PeriodBarData) => {
      setBarsMap((prev) => {
        const next = new Map(prev);
        next.set(key, bar);
        return next;
      });
    },
    [],
  );

  // Aggregate all bars, optionally filtered by selected challenge
  const allBars = useMemo(() => {
    const result: PeriodBarData[] = [];
    barsMap.forEach((bar) => {
      if (selectedChallengeId === null || selectedChallengeId === bar.challengeId) {
        result.push(bar);
      }
    });
    return result;
  }, [barsMap, selectedChallengeId]);

  // Weekly summary calculations
  const { totalCount, todayDueCount, incompleteCount, completedCount } = useMemo(() => {
    const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    const today = new Date();

    let total = 0;
    let todayDue = 0;
    let incomplete = 0;
    let completed = 0;

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

        // Completed
        completed += bar.completedCount;
      }
    }

    return { totalCount: total, todayDueCount: todayDue, incompleteCount: incomplete, completedCount: completed };
  }, [allBars, weekStartDate]);

  const handleBarClick = (challengeId: number, missionId: number) => {
    const bar = allBars.find(
      (b) => b.challengeId === challengeId && b.missionId === missionId,
    );
    setFeedbackModal({
      isOpen: true,
      challengeId,
      missionId,
      challengeTitle: bar?.challengeTitle,
      missionTh: bar?.th,
    });
  };

  const challengeFilterItems = useMemo(
    () =>
      challenges.map((c) => ({
        challengeId: c.challengeId,
        title: c.title,
      })),
    [challenges],
  );

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div className="flex items-center gap-2.5">
        <h1 className="text-xl font-semibold leading-8 text-neutral-900">
          프로그램 일정
        </h1>
      </div>

      <WelcomeMessage />

      <div className="flex flex-col gap-14">
        {/* Summary cards */}
        <div className="flex flex-col gap-6">
          <WeeklySummary
            totalCount={totalCount}
            todayDueCount={todayDueCount}
            incompleteCount={incompleteCount}
            completedCount={completedCount}
          />

          {/* Calendar section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <WeekNavigation
                weekStartDate={weekStartDate}
                onWeekChange={setWeekStartDate}
              />

              <ChallengeFilter
                challenges={challengeFilterItems}
                selectedChallengeId={selectedChallengeId}
                onSelect={setSelectedChallengeId}
              />
            </div>

            <WeeklyCalendar
              weekStartDate={weekStartDate}
              bars={allBars}
              onBarClick={handleBarClick}
            />
          </div>
        </div>
      </div>

      {/* Invisible data fetchers for each challenge */}
      {challenges.map((c, i) => (
          <ChallengeDataFetcher
            key={c.challengeId}
            challenge={c}
            colorIndex={i}
            onData={handleData}
          />
        ))}

      {/* Feedback modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() =>
          setFeedbackModal((prev) => ({ ...prev, isOpen: false }))
        }
        challengeId={feedbackModal.challengeId}
        missionId={feedbackModal.missionId}
        challengeTitle={feedbackModal.challengeTitle}
        missionTh={feedbackModal.missionTh}
      />
    </div>
  );
};

export default SchedulePage;
