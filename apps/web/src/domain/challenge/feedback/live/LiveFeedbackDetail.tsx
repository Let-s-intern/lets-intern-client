'use client';

import { useState } from 'react';

import MentorSection from './MentorSection';
import ReservationInfoSection from './ReservationInfoSection';
import TimeSlotSection from './TimeSlotSection';
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

  if (reservation) {
    return (
      <div className="flex flex-col gap-4 md:p-4">
        {assignedMentor && (
          <ReservationInfoSection
            mentor={assignedMentor}
            reservation={reservation}
          />
        )}
      </div>
    );
  }

  if (!assignedMentor) return null;

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <MentorSection mentor={assignedMentor} />
      <TimeSlotSection
        mentor={assignedMentor}
        period={period}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default LiveFeedbackDetail;
