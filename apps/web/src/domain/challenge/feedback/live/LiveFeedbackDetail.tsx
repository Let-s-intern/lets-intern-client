'use client';

import { useState } from 'react';

import MentorSection from './MentorSection';
import ReservationInfoSection from './ReservationInfoSection';
import TimeSlotSection from './TimeSlotSection';
import type { Mentor, MissionPeriod, Reservation, SelectedSlot } from './types';

interface Props {
  period: MissionPeriod;
  reservationInfo: Reservation | null;
}

const LiveFeedbackDetail = ({
  period,
  reservationInfo: initialReservation,
}: Props) => {
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(
    initialReservation,
  );

  const handleConfirm = (mentor: Mentor, selectedSlot: SelectedSlot) => {
    // POST 성공 후 GET 응답 시뮬레이션 (추후 변경 예정)
    setReservation({
      reservationId: `reservation-${mentor.id}-${selectedSlot.date}-${selectedSlot.time}`,
      mentor,
      scheduledDate: selectedSlot.date,
      scheduledTime: selectedSlot.time,
      zepRoomNumber: 8,
      zepRoomUrl: 'https://www.letscareer.co.kr/',
    });
  };

  if (reservation) {
    return (
      <div className="flex flex-col gap-4 md:p-4">
        <ReservationInfoSection reservation={reservation} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <MentorSection
        selectedMentorId={selectedMentorId}
        onSelect={setSelectedMentorId}
      />
      <TimeSlotSection
        selectedMentorId={selectedMentorId}
        period={period}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default LiveFeedbackDetail;
