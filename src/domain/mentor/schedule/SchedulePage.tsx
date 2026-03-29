'use client';

import { useEffect, useState } from 'react';

import type { ChallengeMentorVo } from '@/api/user/user';
import {
  useMentorMissionFeedbackListQuery,
  useMentorMissionFeedbackAttendanceQuery,
} from '@/api/challenge/challenge';
import type { PeriodBarData } from './challenge-period/ChallengePeriodBar';

import WelcomeMessage from './ui/WelcomeMessage';
import WeeklySummary from './ui/WeeklySummary';
import WeekNavigation from './ui/WeekNavigation';
import ChallengeFilter from './ui/ChallengeFilter';
import WeeklyCalendar from './weekly-calendar/WeeklyCalendar';
import FeedbackModal from '../feedback/FeedbackModal';

import { useWeekNavigation } from './hooks/useWeekNavigation';
import { useWeeklySummary } from './hooks/useWeeklySummary';
import { useScheduleData } from './hooks/useScheduleData';

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
  mission: {
    id: number;
    title?: string | null;
    th: number;
    startDate: string;
    endDate: string;
  };
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
      waitingCount: submitted.filter(
        (a) => a.feedbackStatus === 'WAITING',
      ).length,
      inProgressCount: submitted.filter(
        (a) => a.feedbackStatus === 'IN_PROGRESS',
      ).length,
      completedCount: submitted.filter(
        (a) =>
          a.feedbackStatus === 'COMPLETED' || a.feedbackStatus === 'CONFIRMED',
      ).length,
    };

    onData(`${challenge.challengeId}-${mission.id}`, bar);
  }, [attendanceData, challenge, mission, colorIndex, onData]);

  return null;
};

// ---------------------------------------------------------------------------
// Per-challenge data fetcher
// ---------------------------------------------------------------------------

const ChallengeDataFetcher = ({
  challenge,
  colorIndex,
  onData,
}: {
  challenge: ChallengeMentorVo;
  colorIndex: number;
  onData: (key: string, bar: PeriodBarData) => void;
}) => {
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
  const { weekStartDate, setWeekStartDate } = useWeekNavigation();
  const {
    challenges,
    selectedChallengeId,
    setSelectedChallengeId,
    allBars,
    handleData,
    challengeFilterItems,
  } = useScheduleData();
  const { totalCount, todayDueCount, incompleteCount, completedCount } =
    useWeeklySummary(allBars, weekStartDate);

  // Feedback modal state
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    challengeId: number;
    missionId: number;
    challengeTitle?: string;
    missionTh?: number;
  }>({ isOpen: false, challengeId: 0, missionId: 0 });

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

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div className="flex items-center gap-2.5">
        <h1 className="text-xl font-semibold leading-8 text-neutral-900">
          프로그램 일정
        </h1>
      </div>

      <WelcomeMessage />

      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-6">
          <WeeklySummary
            totalCount={totalCount}
            todayDueCount={todayDueCount}
            incompleteCount={incompleteCount}
            completedCount={completedCount}
          />

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
              onWeekChange={setWeekStartDate}
            />
          </div>
        </div>
      </div>

      {challenges.map((c, i) => (
        <ChallengeDataFetcher
          key={c.challengeId}
          challenge={c}
          colorIndex={i}
          onData={handleData}
        />
      ))}

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
