'use client';

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
  assignedMentor: Mentor | null;
  period: MissionPeriod;
  reservationInfo: Reservation | null;
  status: LiveFeedbackStatus;
}

const LiveFeedbackDetail = ({
  assignedMentor,
  period,
  reservationInfo: initialReservation,
  status,
}: Props) => {
  const [reservation, setReservation] = useState<Reservation | null>(
    initialReservation,
  );

  const mentor: Mentor = assignedMentor ?? {
    nickname: '멘토',
    introduction: '멘토 정보를 불러오는 중입니다.',
    profileImgUrl: '',
  };

  const handleConfirm = (selectedSlot: SelectedSlot) => {
    setReservation({
      reservationId: `reservation-${selectedSlot.date}-${selectedSlot.time}`,
      scheduledDate: selectedSlot.date,
      scheduledTime: selectedSlot.time,
    });
  };

  const showScheduleSection = status === 'prev' || status === 'canceled';

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
