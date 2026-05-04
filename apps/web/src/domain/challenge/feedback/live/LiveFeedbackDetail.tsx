'use client';

import { useState } from 'react';

import ReservationFormSection from './ReservationFormSection';
import ReservationInfoSection from './ReservationInfoSection';
import type { Mentor, MissionPeriod, Reservation, SelectedSlot } from './types';

interface Props {
  assignedMentor: Mentor | null;
  period: MissionPeriod;
  reservationInfo: Reservation | null;
}

const LiveFeedbackDetail = ({
  assignedMentor,
  period,
  reservationInfo: initialReservation,
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
      zepRoomNumber: 8,
      zepRoomUrl: 'https://www.letscareer.co.kr/',
    });
  };

  if (!assignedMentor) return null;

  if (reservation) {
    return (
      <ReservationInfoSection
        mentor={assignedMentor}
        reservation={reservation}
      />
    );
  }

  return (
    <ReservationFormSection
      mentor={assignedMentor}
      period={period}
      onConfirm={handleConfirm}
    />
  );
};

export default LiveFeedbackDetail;
