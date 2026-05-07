'use client';

import BackHeader from '@/common/header/BackHeader';
import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import type { LiveFeedbackStatus } from '@/domain/challenge/feedback/live/types';
import { useParams } from 'next/navigation';

const HEADER_TITLE: Record<LiveFeedbackStatus, string> = {
  prev: 'LIVE 피드백 예약하기',
  reserved: 'LIVE 피드백 신청 정보',
  done: 'LIVE 피드백 회고하기',
};

const LiveMissionDetailPage = () => {
  const { applicationId, programId, missionId } = useParams<{
    applicationId: string;
    programId: string;
    missionId: string;
  }>();

  const backPath = `/challenge/${applicationId}/${programId}/feedback/live`;
  const mission = DUMMY_FEEDBACK_MISSIONS[Number(missionId)];

  if (!mission) return null;

  return (
    <>
      <BackHeader to={backPath}>{HEADER_TITLE[mission.status]}</BackHeader>
      <LiveFeedbackDetail
        assignedMentor={mission.assignedMentor}
        period={{
          startDay: mission.startDay,
          endDay: mission.endDay,
        }}
        reservationInfo={mission.reservationInfo}
      />
    </>
  );
};

export default LiveMissionDetailPage;
