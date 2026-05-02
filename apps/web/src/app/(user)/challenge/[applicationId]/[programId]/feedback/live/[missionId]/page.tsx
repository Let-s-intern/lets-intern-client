'use client';

import BackHeader from '@/common/header/BackHeader';
import LiveFeedbackDetail from '@/domain/challenge/feedback/LiveFeedbackDetail';
import { useParams } from 'next/navigation';

const LiveMissionDetailPage = () => {
  const { applicationId, programId } = useParams<{
    applicationId: string;
    programId: string;
  }>();

  const backPath = `/challenge/${applicationId}/${programId}/feedback/live`;

  return (
    <>
      <BackHeader to={backPath}>라이브 예약 신청하기</BackHeader>
      <LiveFeedbackDetail />
    </>
  );
};

export default LiveMissionDetailPage;
