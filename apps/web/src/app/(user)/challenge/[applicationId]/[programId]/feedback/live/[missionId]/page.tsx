'use client';

import { useLiveFeedbackListQuery } from '@/api/feedback/feedback';
import BackHeader from '@/common/header/BackHeader';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import type { LiveFeedbackStatus } from '@/domain/challenge/feedback/live/types';
import { toMission } from '@/domain/challenge/feedback/live/utils';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const HEADER_TITLE: Record<LiveFeedbackStatus, string> = {
  prev: 'LIVE 피드백 예약하기',
  reserved: 'LIVE 피드백 신청 정보',
  completed: 'LIVE 피드백 회고하기',
  expired: 'LIVE 피드백',
};

const LiveMissionDetailPage = () => {
  const { applicationId, programId, missionId } = useParams<{
    applicationId: string;
    programId: string;
    missionId: string;
  }>();

  const backPath = `/challenge/${applicationId}/${programId}/feedback/live`;
  const { currentChallenge } = useCurrentChallenge();
  const { data } = useLiveFeedbackListQuery(programId);

  const mission = useMemo(() => {
    const list = data?.liveFeedbackList ?? [];
    const th = Number(missionId);
    const index = list.findIndex((item) => item.missionTh === th);
    if (index === -1) return null;
    return toMission(list[index], currentChallenge?.challengeType ?? '');
  }, [data, missionId, currentChallenge?.challengeType]);

  if (!mission) return <BackHeader to={backPath}>LIVE 피드백</BackHeader>;

  return (
    <>
      <BackHeader to={backPath}>{HEADER_TITLE[mission.status]}</BackHeader>
      <LiveFeedbackDetail
        challengeId={programId}
        assignedMentor={mission.mentorInfo}
        period={{
          startDay: mission.missionStartDate,
          endDay: mission.missionEndDate,
        }}
        feedbackInfo={mission.feedbackInfo}
        status={mission.status}
      />
    </>
  );
};

export default LiveMissionDetailPage;
