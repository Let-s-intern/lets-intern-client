import { addDays, format } from 'date-fns';
import { useEffect } from 'react';

/** "YYYY-MM-DD" 형식으로 정규화 — 다양한 입력 포맷을 허용 */
function normalizeDate(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd');
}

import type { ChallengeMentorVo } from '@/api/user/user';
import { useMentorMissionFeedbackListQuery } from '@/api/challenge/challenge';
import { useMentorAttendanceQuery } from '@/pages/feedback/hooks/useMentorAttendanceQuery';
import type { PeriodBarData } from '../types';
import { computeDatesFromConfig } from '../constants/scheduleConfig';
import { WRITTEN_FEEDBACK_CONFIG } from '../challenge-content/writtenFeedback';

const MissionAttendanceFetcher = ({
  challenge,
  mission,
  onData,
}: {
  challenge: ChallengeMentorVo;
  mission: {
    id: number;
    title?: string | null;
    th: number;
    startDate: string;
    endDate: string;
    challengeOptionType?: 'WRITTEN_FEEDBACK' | 'LIVE_FEEDBACK' | null;
  };
  onData: (key: string, bar: PeriodBarData) => void;
}) => {
  const { data: attendanceData } = useMentorAttendanceQuery({
    challengeId: challenge.challengeId,
    missionId: mission.id,
    enabled: true,
  });

  useEffect(() => {
    const list = attendanceData?.attendanceList ?? [];
    const submitted = list.filter((a) => a.status !== 'ABSENT');
    const notSubmitted = list.filter((a) => a.status === 'ABSENT');

    const missionStart = normalizeDate(mission.startDate);
    const missionEnd = normalizeDate(mission.endDate);
    const { feedbackStartDate, feedbackDeadline } = computeDatesFromConfig(
      WRITTEN_FEEDBACK_CONFIG,
      mission.endDate,
    );
    const reviewDate = format(
      addDays(new Date(mission.endDate), 1),
      'yyyy-MM-dd',
    );

    const counts = {
      submittedCount: submitted.length,
      notSubmittedCount: notSubmitted.length,
      waitingCount: submitted.filter((a) => a.feedbackStatus === 'WAITING')
        .length,
      inProgressCount: submitted.filter(
        (a) => a.feedbackStatus === 'IN_PROGRESS',
      ).length,
      completedCount: submitted.filter(
        (a) =>
          a.feedbackStatus === 'COMPLETED' || a.feedbackStatus === 'CONFIRMED',
      ).length,
    };
    const common = {
      challengeId: challenge.challengeId,
      challengeTitle: challenge.title,
      th: mission.th,
      ...counts,
    };

    const submitBar: PeriodBarData = {
      ...common,
      barType: 'written-mission-submit',
      missionId: mission.id,
      startDate: missionStart,
      endDate: missionEnd,
      feedbackStartDate: missionStart,
      feedbackDeadline: missionEnd,
    };
    const reviewBar: PeriodBarData = {
      ...common,
      barType: 'written-review',
      missionId: mission.id,
      startDate: reviewDate,
      endDate: reviewDate,
      feedbackStartDate: reviewDate,
      feedbackDeadline: reviewDate,
    };
    const feedbackBar: PeriodBarData = {
      ...common,
      barType: 'written-feedback',
      missionId: mission.id,
      startDate: feedbackStartDate,
      endDate: feedbackDeadline,
      feedbackStartDate,
      feedbackDeadline,
    };

    // 라이브 피드백 미션의 캘린더 표시는 useLiveFeedbackData(LIVE 바)가 전담한다.
    // 여기서 서면 바(제출/검수/피드백)를 만들면 라이브 기간·일정오픈 바와 중복
    // 노출되므로, LIVE_FEEDBACK 미션은 서면 바를 하나도 만들지 않는다.
    if (mission.challengeOptionType !== 'LIVE_FEEDBACK') {
      onData(`${challenge.challengeId}-${mission.id}-submit`, submitBar);
      onData(`${challenge.challengeId}-${mission.id}-review`, reviewBar);
      onData(`${challenge.challengeId}-${mission.id}-feedback`, feedbackBar);
    }
  }, [attendanceData, challenge, mission, onData]);

  return null;
};

interface ChallengeDataFetcherProps {
  challenge: ChallengeMentorVo;
  onData: (key: string, bar: PeriodBarData) => void;
}

const ChallengeDataFetcher = ({
  challenge,
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
          onData={onData}
        />
      ))}
    </>
  );
};

export default ChallengeDataFetcher;
