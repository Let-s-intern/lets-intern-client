'use client';

import { useTimeSlotState } from './hooks/useTimeSlotState';
import type { Mentor, MissionPeriod, SelectedSlot } from './types';
import MentorCard from './ui/MentorCard';
import ReservationBar from './ui/ReservationBar';
import TimeSlotGrid from './ui/TimeSlotGrid';
import WeekNav from './ui/WeekNav';

interface Props {
  mentor: Mentor;
  period: MissionPeriod;
  onConfirm: (slot: SelectedSlot) => void;
}

const ReservationFormSection = ({ mentor, period, onConfirm }: Props) => {
  const {
    weekStart,
    selectedSlot,
    schedule,
    canGoPrev,
    canGoNext,
    handlePrev,
    handleNext,
    handleSlotSelect,
    handleCancel,
    handleConfirm,
  } = useTimeSlotState(mentor, period, onConfirm);

  return (
    <div className="flex flex-col gap-4 p-0 md:p-4">
      <section>
        <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
          담당 멘토
        </h2>
        <MentorCard mentor={mentor} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xsmall16 text-neutral-0 font-semibold">
            예약 가능한 시간
          </h2>
          <WeekNav
            weekStart={weekStart}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
        <div className="flex flex-col gap-6">
          <TimeSlotGrid
            schedule={schedule}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
          />
          <ReservationBar
            mentorName={mentor.name}
            selectedSlot={selectedSlot}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        </div>
      </section>
    </div>
  );
};

export default ReservationFormSection;
