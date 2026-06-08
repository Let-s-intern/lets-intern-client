'use client';

import {
  useFeedbackDetailQuery,
  useMentorDetailQuery,
  usePostFeedbackReservation,
} from '@/api/feedback/feedback';
import ReservationInfoSection from './section/ReservationInfoSection';
import ReservationScheduleSection from './section/ReservationScheduleSection';
import type { LiveFeedbackMission, Mentor, SelectedSlot } from './types';

interface Props {
  challengeId: string | number;
  mission: LiveFeedbackMission;
}

const LiveFeedbackDetail = ({ challengeId, mission }: Props) => {
  const { data: feedbackDetailData } = useFeedbackDetailQuery(
    mission.feedbackId,
  );
  const feedbackInfo = feedbackDetailData?.feedbackInfo ?? null;

  const { mutate: reserveFeedback } = usePostFeedbackReservation(challengeId);

  const { data: mentorData } = useMentorDetailQuery(
    mission.mentorInfo ? undefined : challengeId,
  );

  const mentor: Mentor = mission.mentorInfo ??
    mentorData?.challengeMentorInfo ?? {
      nickname: '멘토',
      introduction: '멘토 정보를 불러오는 중입니다.',
      profileImgUrl: '',
    };

  const handleConfirm = (selectedSlot: SelectedSlot) => {
    reserveFeedback(
      {
        missionId: mission.missionId,
        feedbackSlotId: selectedSlot.feedbackSlotId,
      },
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
        status={mission.status}
        feedbackId={mission.feedbackId}
      />
      {mission.status === 'prev' && !mission.feedbackId && (
        <ReservationScheduleSection
          challengeId={challengeId}
          mentorName={mentor.nickname}
          feedbackStartDate={mission.feedbackStartDate}
          feedbackEndDate={mission.feedbackEndDate}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default LiveFeedbackDetail;
