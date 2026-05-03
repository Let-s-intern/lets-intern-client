'use client';

import { useTimeSlotState } from './hooks/useTimeSlotState';
import type { Mentor, MissionPeriod, SelectedSlot } from './types';
import ReservationBar from './ui/ReservationBar';
import TimeSlotGrid from './ui/TimeSlotGrid';
import WeekNav from './ui/WeekNav';

interface Props {
  selectedMentorId: number | null;
  period: MissionPeriod;
  onConfirm: (mentor: Mentor, slot: SelectedSlot) => void;
}

const TimeSlotSection = ({ selectedMentorId, period, onConfirm }: Props) => {
  const {
    weekStart,
    selectedSlot,
    mentor,
    schedule,
    canGoPrev,
    canGoNext,
    handlePrev,
    handleNext,
    handleSlotSelect,
    handleCancel,
    handleConfirm,
  } = useTimeSlotState(selectedMentorId, period, onConfirm);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold">
          예약 가능한 시간
        </h2>
        {selectedMentorId && (
          <WeekNav
            weekStart={weekStart}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>

      {selectedMentorId ? (
        <div className="flex flex-col gap-6">
          <TimeSlotGrid
            schedule={schedule}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
          />
          <ReservationBar
            mentorName={mentor?.name ?? ''}
            selectedSlot={selectedSlot}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        </div>
      ) : (
        <div className="text-xsmall14 text-neutral-40 py-8 text-center">
          멘토를 먼저 선택해주세요
        </div>
      )}
    </section>
  );
};

export default TimeSlotSection;
