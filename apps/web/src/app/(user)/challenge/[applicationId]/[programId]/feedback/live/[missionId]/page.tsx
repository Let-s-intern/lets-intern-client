'use client';

import BackHeader from '@/common/header/BackHeader';
import LiveReservationContent from '@/domain/challenge/feedback/LiveReservationContent';
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
      <LiveReservationContent />
    </>
  );
};

export default LiveMissionDetailPage;
