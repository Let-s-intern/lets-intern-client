'use client';

import { useTimeSlotState } from './hooks/useTimeSlotState';
import type { Mentor, MissionPeriod, SelectedSlot } from './types';
import ReservationBar from './ui/ReservationBar';
import TimeSlotGrid from './ui/TimeSlotGrid';
import WeekNav from './ui/WeekNav';

interface Props {
  mentor: Mentor;
  period: MissionPeriod;
  onConfirm: (slot: SelectedSlot) => void;
}

const TimeSlotSection = ({ mentor, period, onConfirm }: Props) => {
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
  );
};

export default TimeSlotSection;
