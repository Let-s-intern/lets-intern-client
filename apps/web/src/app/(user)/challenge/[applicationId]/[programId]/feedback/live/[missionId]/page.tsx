'use client';

import BackHeader from '@/common/header/BackHeader';
import LiveFeedbackDetail from '@/domain/challenge/feedback/LiveFeedbackDetail';
import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
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
      <LiveFeedbackDetail
        period={{
          startDay: DUMMY_FEEDBACK_MISSIONS[0].startDay ?? '',
          endDay: DUMMY_FEEDBACK_MISSIONS[0].endDay ?? '',
        }}
      />
    </>
  );
};

export default LiveMissionDetailPage;
