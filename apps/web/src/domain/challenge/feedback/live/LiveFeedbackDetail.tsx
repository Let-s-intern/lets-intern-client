'use client';

import { useState } from 'react';

import ReservationFormSection from './section/ReservationFormSection';
import ReservationInfoSection from './section/ReservationInfoSection';
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
      <div className="flex flex-col">
        <ReservationInfoSection
          mentor={assignedMentor}
          reservation={reservation}
          status={status}
        />
        {status === 'canceled' && (
          <ReservationFormSection
            mentor={assignedMentor}
            period={{ startDay, endDay }}
            onConfirm={handleConfirm}
          />
        )}
      </div>
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
