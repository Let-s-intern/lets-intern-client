import { useCallback, useMemo, useState } from 'react';

import { getMentorDaySlots, getMentorMonthAvailability } from '../../dummy';
import type { Mentor, MissionPeriod, SelectedSlot } from '../types';
import { toDateString } from '../utils';

function getInitialDate(period: MissionPeriod): Date {
  const today = new Date();
  const start = new Date(period.startDay);
  const end = new Date(period.endDay);
  if (today < start) return start;
  if (today > end) return end;
  return today;
}

export function useTimeSlotState(
  mentor: Mentor,
  period: MissionPeriod,
  onConfirm: (slot: SelectedSlot) => void,
) {
  const base = getInitialDate(period);

  const [{ year, month }, setYearMonth] = useState({
    year: base.getFullYear(),
    month: base.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState(toDateString(base));
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const canGoPrev = useMemo(() => {
    const start = new Date(period.startDay);
    return (
      year > start.getFullYear() ||
      (year === start.getFullYear() && month > start.getMonth())
    );
  }, [year, month, period.startDay]);

  const canGoNext = useMemo(() => {
    const end = new Date(period.endDay);
    return (
      year < end.getFullYear() ||
      (year === end.getFullYear() && month < end.getMonth())
    );
  }, [year, month, period.endDay]);

  const monthAvailability = useMemo(
    () =>
      getMentorMonthAvailability(
        mentor.id,
        year,
        month,
        period.startDay,
        period.endDay,
      ),
    [mentor.id, year, month, period.startDay, period.endDay],
  );

  const daySlots = useMemo(
    () => getMentorDaySlots(mentor.id, selectedDate),
    [mentor.id, selectedDate],
  );

  const navigateMonth = useCallback((dir: 1 | -1) => {
    setYearMonth(({ year: y, month: m }) => {
      const next = m + dir;
      if (next < 0) return { year: y - 1, month: 11 };
      if (next > 11) return { year: y + 1, month: 0 };
      return { year: y, month: next };
    });
    setSelectedSlot(null);
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  const handleSlotSelect = useCallback((slot: SelectedSlot) => {
    setSelectedSlot((prev) =>
      prev?.date === slot.date && prev?.time === slot.time ? null : slot,
    );
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedSlot) onConfirm(selectedSlot);
  }, [selectedSlot, onConfirm]);

  return {
    calendar: {
      year,
      month,
      selectedDate,
      monthAvailability,
      canGoPrev,
      canGoNext,
      onPrev: () => navigateMonth(-1),
      onNext: () => navigateMonth(1),
      onDateSelect: handleDateSelect,
    },
    slots: {
      date: selectedDate,
      slots: daySlots,
      selectedSlot,
      onSlotSelect: handleSlotSelect,
    },
    bar: {
      selectedSlot,
      onCancel: () => setSelectedSlot(null),
      onConfirm: handleConfirm,
    },
  };
}
