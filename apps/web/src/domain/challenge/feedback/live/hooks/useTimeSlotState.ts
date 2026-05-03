import { useEffect, useMemo, useState } from 'react';
import { DUMMY_MENTORS, getMentorSchedule } from '../../dummy';
import type { Mentor, MissionPeriod, SelectedSlot } from '../types';
import { addDays, getWeekStart, toDateString } from '../utils';

export function useTimeSlotState(
  selectedMentorId: number | null,
  period: MissionPeriod,
  onConfirm: (mentor: Mentor, slot: SelectedSlot) => void,
) {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const start = new Date(period.startDay);
    const end = new Date(period.endDay);
    const base = today < start ? start : today > end ? end : today;
    return getWeekStart(base);
  });
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedMentorId]);

  const mentor = useMemo(
    () => DUMMY_MENTORS.find((m) => m.id === selectedMentorId),
    [selectedMentorId],
  );

  const schedule = useMemo(
    () =>
      selectedMentorId ? getMentorSchedule(selectedMentorId, weekStart) : [],
    [selectedMentorId, weekStart],
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

  const handleSlotSelect = (slot: SelectedSlot) => {
    setSelectedSlot((prev) =>
      prev?.date === slot.date && prev?.time === slot.time ? null : slot,
    );
  };

  const handleCancel = () => setSelectedSlot(null);

  const handleConfirm = () => {
    if (!selectedSlot || !mentor) return;
    onConfirm(mentor, selectedSlot);
  };

  return {
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
  };
}
