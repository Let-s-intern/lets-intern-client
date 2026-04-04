'use client';

import { useEffect } from 'react';

import { addDays } from 'date-fns';

import type { ChallengeMentorVo } from '@/api/user/user';
import {
  useMentorMissionFeedbackListQuery,
  useMentorMenteeAttendanceQuery,
} from '@/api/challenge/challenge';
import type { PeriodBarData } from '../challenge-period/ChallengePeriodBar';

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
  const { data: attendanceData } = useMentorMenteeAttendanceQuery({
    challengeId: challenge.challengeId,
    missionId: mission.id,
    enabled: true,
  });

  useEffect(() => {
    const list = attendanceData?.attendanceList ?? [];
    const submitted = list.filter((a) => a.status !== 'ABSENT');
    const notSubmitted = list.filter((a) => a.status === 'ABSENT');

    const feedbackStartDate = addDays(
      new Date(mission.endDate),
      1,
    ).toISOString();
    const feedbackDeadline = addDays(
      new Date(mission.endDate),
      3,
    ).toISOString();

    const bar: PeriodBarData = {
      challengeId: challenge.challengeId,
      missionId: mission.id,
      challengeTitle: challenge.title,
      th: mission.th,
      startDate: mission.startDate,
      endDate: mission.endDate,
      feedbackStartDate,
      feedbackDeadline,
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

interface ChallengeDataFetcherProps {
  challenge: ChallengeMentorVo;
  colorIndex: number;
  onData: (key: string, bar: PeriodBarData) => void;
}

const ChallengeDataFetcher = ({
  challenge,
  colorIndex,
  onData,
}: ChallengeDataFetcherProps) => {
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

export default ChallengeDataFetcher;
