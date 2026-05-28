'use client';

import {
  useFeedbackDetailQuery,
  useMentorDetailQuery,
  usePostFeedbackReservation,
} from '@/api/feedback/feedback';
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
  missionId: number;
  feedbackId?: number | null;
  assignedMentor: Mentor | null;
  period: MissionPeriod;
  status: LiveFeedbackStatus;
}

const LiveFeedbackDetail = ({
  challengeId,
  missionId,
  feedbackId,
  assignedMentor,
  period,
  status,
}: Props) => {
  const { data: feedbackDetailData } = useFeedbackDetailQuery(feedbackId);
  const feedbackInfo = feedbackDetailData?.feedbackInfo ?? null;

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
    reserveFeedback(
      { missionId, feedbackSlotId: selectedSlot.feedbackSlotId },
      {
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
        feedbackId={feedbackId}
      />
      {status === 'prev' && !feedbackId && (
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
