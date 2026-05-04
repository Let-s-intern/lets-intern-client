'use client';

import BackHeader from '@/common/header/BackHeader';
import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import { useParams } from 'next/navigation';

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
      <BackHeader to={backPath}>라이브 예약 신청하기</BackHeader>
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
