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

  const handleConfirm = (selectedSlot: SelectedSlot) => {
    if (!assignedMentor) return;
    setReservation({
      reservationId: `reservation-${assignedMentor.id}-${selectedSlot.date}-${selectedSlot.time}`,
      scheduledDate: selectedSlot.date,
      scheduledTime: selectedSlot.time,
    });
  };

  if (!assignedMentor) return null;

  const showScheduleSection = status === 'prev' || status === 'canceled';

  return (
    <div className="flex flex-col">
      <ReservationInfoSection
        mentor={assignedMentor}
        reservation={reservation}
        status={status}
      />
      {showScheduleSection && (
        <ReservationScheduleSection
          mentor={assignedMentor}
          period={period}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default LiveFeedbackDetail;
