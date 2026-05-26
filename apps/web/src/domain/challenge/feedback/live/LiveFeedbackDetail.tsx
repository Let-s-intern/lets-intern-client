'use client';

import {
  useMentorDetailQuery,
  usePostFeedbackReservation,
} from '@/api/feedback/feedback';
import type { FeedbackInfo } from '@/api/feedback/feedbackSchema';
import { useState } from 'react';

import ReservationInfoSection from './section/ReservationInfoSection';
import ReservationScheduleSection from './section/ReservationScheduleSection';
import type {
  LiveFeedbackStatus,
  Mentor,
  MissionPeriod,
  SelectedSlot,
} from './types';

interface Props {
  challengeId: string | number;
  missionTh: number;
  assignedMentor: Mentor | null;
  period: MissionPeriod;
  feedbackInfo: FeedbackInfo | null;
  status: LiveFeedbackStatus;
}

const LiveFeedbackDetail = ({
  challengeId,
  missionTh,
  assignedMentor,
  period,
  feedbackInfo: initialFeedbackInfo,
  status,
}: Props) => {
  const [feedbackInfo, setFeedbackInfo] = useState<FeedbackInfo | null>(
    initialFeedbackInfo,
  );

  const { mutate: reserveFeedback } = usePostFeedbackReservation(challengeId);

  const { data: mentorData } = useMentorDetailQuery(
    assignedMentor ? undefined : challengeId,
  );

  const mentor: Mentor = assignedMentor ??
    mentorData?.challengeMentorInfo ?? {
      nickname: '멘토',
      introduction: '멘토 정보를 불러오는 중입니다.',
      profileImgUrl: '',
    };

  const handleConfirm = (selectedSlot: SelectedSlot) => {
    // console.log('[예약 요청]', { challengeId, missionTh, feedbackSlotId: selectedSlot.feedbackSlotId, selectedSlot });
    reserveFeedback(
      { missionId: missionTh, feedbackSlotId: selectedSlot.feedbackSlotId },
      {
        onSuccess: (_data) => {
          // console.log('[예약 성공]', data);
          setFeedbackInfo({
            feedbackId: 0,
            startDate: selectedSlot.startDate,
            endDate: selectedSlot.endDate,
            meetingUrl: null,
            status: 'RESERVED',
          });
        },
        onError: (error) => {
          console.error('[예약 실패]', error);
        },
      },
    );
  };

  return (
    <div className="flex flex-col">
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status={status}
      />
      {status === 'prev' && (
        <ReservationScheduleSection
          challengeId={challengeId}
          mentorName={mentor.nickname}
          period={period}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default LiveFeedbackDetail;
