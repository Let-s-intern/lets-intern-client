'use client';

import { useTimeSlotState } from '../hooks/useTimeSlotState';
import MonthCalendar from '../ui/MonthCalendar';
import ReservationBar from '../ui/ReservationBar';
import TimeSlotButtons from '../ui/TimeSlotButtons';
import type { Mentor, MissionPeriod, SelectedSlot } from '../types';

interface Props {
  mentor: Mentor;
  period: MissionPeriod;
  onConfirm: (slot: SelectedSlot) => void;
}

const ReservationScheduleSection = ({ mentor, period, onConfirm }: Props) => {
  const { calendar, slots, bar } = useTimeSlotState(mentor, period, onConfirm);

  return (
    <div className="p-0 md:p-4">
      <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
        예약 일시 선택
      </h2>
      <div className="flex flex-col gap-4 md:mb-6 md:flex-row md:items-start md:gap-8">
        <MonthCalendar {...calendar} />
        <div className="flex flex-1">
          <TimeSlotButtons {...slots} />
        </div>
      </div>
      <ReservationBar mentorName={mentor.name} {...bar} />
    </div>
  );
};

export default ReservationScheduleSection;
