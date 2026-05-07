import { useCallback, useMemo, useState } from 'react';
import { getMentorSchedule } from '../../dummy';
import type { Mentor, MissionPeriod, SelectedSlot } from '../types';
import { addDays, getWeekStart, toDateString } from '../utils';

export function useTimeSlotState(
  mentor: Mentor,
  period: MissionPeriod,
  onConfirm: (slot: SelectedSlot) => void,
) {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const start = new Date(period.startDay);
    const end = new Date(period.endDay);
    const base = today < start ? start : today > end ? end : today;
    return getWeekStart(base);
  });
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const schedule = useMemo(
    () => getMentorSchedule(mentor.id, weekStart),
    [mentor.id, weekStart],
  );

  const canGoPrev =
    toDateString(weekStart) >
    toDateString(getWeekStart(new Date(period.startDay)));
  const canGoNext =
    toDateString(weekStart) <
    toDateString(getWeekStart(new Date(period.endDay)));

  const handlePrev = () => {
    if (!canGoPrev) return;
    setWeekStart((prev) => addDays(prev, -7));
    setSelectedSlot(null);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setWeekStart((prev) => addDays(prev, 7));
    setSelectedSlot(null);
  };

  const handleSlotSelect = useCallback((slot: SelectedSlot) => {
    setSelectedSlot((prev) =>
      prev?.date === slot.date && prev?.time === slot.time ? null : slot,
    );
  }, []);

  const handleCancel = () => setSelectedSlot(null);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    onConfirm(selectedSlot);
  };

  return {
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
  };
}
