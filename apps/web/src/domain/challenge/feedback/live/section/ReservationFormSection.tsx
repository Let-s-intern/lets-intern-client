'use client';

import { useTimeSlotState } from '../hooks/useTimeSlotState';
import type { Mentor, MissionPeriod, SelectedSlot } from '../types';
import MentorCard from '../ui/MentorCard';
import MonthCalendar from '../ui/MonthCalendar';
import ReservationBar from '../ui/ReservationBar';
import TimeSlotButtons from '../ui/TimeSlotButtons';

interface Props {
  mentor: Mentor;
  period: MissionPeriod;
  onConfirm: (slot: SelectedSlot) => void;
}

const ReservationFormSection = ({ mentor, period, onConfirm }: Props) => {
  const {
    currentYear,
    currentMonth,
    selectedDate,
    selectedSlot,
    monthAvailability,
    daySlots,
    canGoPrev,
    canGoNext,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    handleSlotSelect,
    handleCancel,
    handleConfirm,
  } = useTimeSlotState(mentor, period, onConfirm);

  return (
    <div className="flex flex-col gap-6 p-0 md:p-4">
      <section>
        <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
          담당 멘토
        </h2>
        <MentorCard
          mentor={mentor}
          className="border-neutral-80 min-w-[316px] border"
        />
      </section>

      <section>
        <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
          예약 일시 선택
        </h2>
        <div className="flex flex-col gap-4 md:mb-6 md:flex-row md:items-start md:gap-8">
          <MonthCalendar
            year={currentYear}
            month={currentMonth}
            selectedDate={selectedDate}
            monthAvailability={monthAvailability}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
            onDateSelect={handleDateSelect}
          />
          <div className="flex flex-1">
            <TimeSlotButtons
              date={selectedDate}
              slots={daySlots}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
            />
          </div>
        </div>
        <ReservationBar
          mentorName={mentor.name}
          selectedSlot={selectedSlot}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </section>
    </div>
  );
};

export default ReservationFormSection;
