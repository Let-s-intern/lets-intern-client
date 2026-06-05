'use client';

import { useFeedbackSlotListQuery } from '@/api/feedback/feedback';
import { useTimeSlotState } from '../hooks/useTimeSlotState';
import type { SelectedSlot } from '../types';
import MonthCalendar from '../ui/MonthCalendar';
import ReservationBar from '../ui/ReservationBar';
import TimeSlotButtons from '../ui/TimeSlotButtons';

interface Props {
  challengeId: string | number;
  mentorName: string;
  feedbackStartDate: string;
  feedbackEndDate: string;
  onConfirm: (slot: SelectedSlot) => void;
}

const ReservationScheduleSection = ({
  challengeId,
  mentorName,
  feedbackStartDate,
  feedbackEndDate,
  onConfirm,
}: Props) => {
  const { data } = useFeedbackSlotListQuery(
    challengeId,
    `${feedbackStartDate}T00:00:00`,
    `${feedbackEndDate}T23:59:59`,
  );
  const feedbackSlots = data?.feedbackSlotList ?? [];

  const { calendar, slots, bar } = useTimeSlotState(
    feedbackStartDate,
    feedbackEndDate,
    feedbackSlots,
    onConfirm,
  );

  return (
    <div className="p-0 pb-10 md:p-4">
      <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
        예약 일시 선택
      </h2>
      <div className="flex flex-col gap-4 md:mb-4 md:flex-row md:items-start md:gap-8">
        <MonthCalendar {...calendar} />
        <div className="flex flex-1">
          <TimeSlotButtons {...slots} />
        </div>
      </div>
      <ReservationBar mentorName={mentorName} {...bar} />
    </div>
  );
};

export default ReservationScheduleSection;
