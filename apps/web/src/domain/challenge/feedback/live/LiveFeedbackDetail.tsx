'use client';

import { useMentorDetailQuery } from '@/api/feedback/feedback';
import type { FeedbackInfo } from '@/api/feedback/feedbackSchema';
import { useState } from 'react';

import ReservationInfoSection from './section/ReservationInfoSection';
import ReservationScheduleSection from './section/ReservationScheduleSection';
import type { LiveFeedbackStatus, Mentor, MissionPeriod, SelectedSlot } from './types';

interface Props {
  challengeId: string | number;
  assignedMentor: Mentor | null;
  period: MissionPeriod;
  feedbackInfo: FeedbackInfo | null;
  status: LiveFeedbackStatus;
}

const LiveFeedbackDetail = ({
  challengeId,
  assignedMentor,
  period,
  feedbackInfo: initialFeedbackInfo,
  status,
}: Props) => {
  const [feedbackInfo, setFeedbackInfo] = useState<FeedbackInfo | null>(
    initialFeedbackInfo,
  );

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
    setFeedbackInfo({
      feedbackId: 0, // POST 예약 API 연동 시 실제 ID로 교체
      startDate: selectedSlot.startDate,
      endDate: selectedSlot.endDate,
      meetingUrl: null,
      status: 'RESERVED',
    });
  };

  const showScheduleSection = status === 'prev';

  return (
    <div className="flex flex-col">
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status={status}
      />
      {showScheduleSection && (
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
