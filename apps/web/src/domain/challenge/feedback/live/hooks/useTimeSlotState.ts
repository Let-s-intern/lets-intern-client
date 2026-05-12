import { useMemo, useState } from 'react';
import { getMentorDaySlots, getMentorMonthAvailability } from '../../dummy';
import type { Mentor, MissionPeriod, SelectedSlot } from '../types';
import { toDateString } from '../utils';

export function useTimeSlotState(
  mentor: Mentor,
  period: MissionPeriod,
  onConfirm: (slot: SelectedSlot) => void,
) {
  const periodStart = new Date(period.startDay);
  const periodEnd = new Date(period.endDay);
  const today = new Date();
  const base =
    today < periodStart ? periodStart : today > periodEnd ? periodEnd : today;

  const [currentYear, setCurrentYear] = useState(base.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(base.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(toDateString(base));
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  // 진행일정(startDay~endDay)이 포함된 달만 활성화
  const canGoPrev = useMemo(
    () =>
      currentYear > periodStart.getFullYear() ||
      (currentYear === periodStart.getFullYear() &&
        currentMonth > periodStart.getMonth()),
    [currentYear, currentMonth, periodStart],
  );

  const canGoNext = useMemo(
    () =>
      currentYear < periodEnd.getFullYear() ||
      (currentYear === periodEnd.getFullYear() &&
        currentMonth < periodEnd.getMonth()),
    [currentYear, currentMonth, periodEnd],
  );

  const monthAvailability = useMemo(
    () =>
      getMentorMonthAvailability(
        mentor.id,
        currentYear,
        currentMonth,
        period.startDay,
        period.endDay,
      ),
    [mentor.id, currentYear, currentMonth, period.startDay, period.endDay],
  );

  const daySlots = useMemo(
    () => getMentorDaySlots(mentor.id, selectedDate),
    [mentor.id, selectedDate],
  );

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedSlot(null);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: SelectedSlot) => {
    setSelectedSlot((prev) =>
      prev?.date === slot.date && prev?.time === slot.time ? null : slot,
    );
  };

  const handleCancel = () => setSelectedSlot(null);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    onConfirm(selectedSlot);
  };

  return {
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
  };
}
