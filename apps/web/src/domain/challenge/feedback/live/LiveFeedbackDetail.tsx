'use client';

import { useState } from 'react';

import ReservationFormSection from './ReservationFormSection';
import ReservationInfoSection from './ReservationInfoSection';
import type {
  LiveFeedbackStatus,
  Mentor,
  Reservation,
  SelectedSlot,
} from './types';

interface Props {
  assignedMentor: Mentor | null;
  startDay: string;
  endDay: string;
  reservationInfo: Reservation | null;
  status: LiveFeedbackStatus;
}

const LiveFeedbackDetail = ({
  assignedMentor,
  startDay,
  endDay,
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
        status={status}
      />
    );
  }

  return (
    <ReservationFormSection
      mentor={assignedMentor}
      period={{ startDay, endDay }}
      onConfirm={handleConfirm}
    />
  );
};

export default LiveFeedbackDetail;
