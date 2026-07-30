'use client';

import {
  useFeedbackDetailQuery,
  useMentorDetailQuery,
  usePostFeedbackReservation,
} from '@/api/feedback/feedback';
import MentorWrittenFeedbackSection from './section/MentorWrittenFeedbackSection';
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
      {/* 진행이 끝난 회차는 멘토가 남긴 서면 피드백을 함께 보여준다.
          ("피드백 내역 보기" 아코디언이 예약 정보만 보여주고 있었다) */}
      {mission.status === 'completed' && (
        <MentorWrittenFeedbackSection
          challengeId={challengeId}
          missionId={mission.missionId}
        />
      )}
      {mission.status === 'prev' && !mission.feedbackId && (
        <ReservationScheduleSection
          challengeId={challengeId}
          mentorName={mentor.nickname}
          slotRangeStart={mission.slotRangeStart}
          slotRangeEnd={mission.slotRangeEnd}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default LiveFeedbackDetail;
