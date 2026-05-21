'use client';

import BackHeader from '@/common/header/BackHeader';
import type { LiveFeedbackStatus } from '@/domain/challenge/feedback/live/types';
import { useParams } from 'next/navigation';

const HEADER_TITLE: Record<LiveFeedbackStatus, string> = {
  prev: 'LIVE 피드백 예약하기',
  reserved: 'LIVE 피드백 신청 정보',
  done: 'LIVE 피드백 회고하기',
  expired: 'LIVE 피드백',
};

const LiveMissionDetailPage = () => {
  const { applicationId, programId } = useParams<{
    applicationId: string;
    programId: string;
  }>();

  const backPath = `/challenge/${applicationId}/${programId}/feedback/live`;

  // TODO: API 연동 후 missionId로 미션 데이터 조회
  // const mission = ...
  // if (!mission) return null;
  // return (
  //   <>
  //     <BackHeader to={backPath}>{HEADER_TITLE[mission.status]}</BackHeader>
  //     <LiveFeedbackDetail
  //       assignedMentor={mission.assignedMentor}
  //       period={{ startDay: mission.startDay, endDay: mission.endDay }}
  //       reservationInfo={mission.reservationInfo}
  //       status={mission.status}
  //     />
  //   </>
  // );

  return <BackHeader to={backPath}>LIVE 피드백</BackHeader>;
};

export default LiveMissionDetailPage;
