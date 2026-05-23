'use client';

import { useMentorDetailQuery } from '@/api/feedback/feedback';
import { useState } from 'react';

import ReservationInfoSection from './section/ReservationInfoSection';
import ReservationScheduleSection from './section/ReservationScheduleSection';
import type {
  LiveFeedbackStatus,
  Mentor,
  MissionPeriod,
  Reservation,
  SelectedSlot,
} from './types';

interface Props {
  challengeId: string | number;
  assignedMentor: Mentor | null;
  period: MissionPeriod;
  reservationInfo: Reservation | null;
  status: LiveFeedbackStatus;
}

const LiveFeedbackDetail = ({
  challengeId,
  assignedMentor,
  period,
  reservationInfo: initialReservation,
  status,
}: Props) => {
  const [reservation, setReservation] = useState<Reservation | null>(
    initialReservation,
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
    const start = new Date(`${selectedSlot.date}T${selectedSlot.time}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    setReservation({
      feedbackId: 0, // POST 예약 API 연동 시 실제 ID로 교체
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      meetingUrl: null,
    });
  };

  const showScheduleSection = status === 'prev';

  return (
    <div className="flex flex-col">
      <ReservationInfoSection
        mentor={mentor}
        reservation={reservation}
        status={status}
      />
      {showScheduleSection && (
        <ReservationScheduleSection
          mentorName={mentor.nickname}
          period={period}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default LiveFeedbackDetail;
