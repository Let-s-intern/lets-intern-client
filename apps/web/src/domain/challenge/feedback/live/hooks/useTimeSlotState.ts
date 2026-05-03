import { useCallback, useEffect, useMemo, useState } from 'react';
import { DUMMY_MENTORS, getMentorSchedule } from '../../dummy';
import type { SelectedSlot } from '../types';
import { addDays, getWeekStart } from '../utils';

export function useTimeSlotState(selectedMentorId: string | null) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
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

  const handlePrev = useCallback(() => {
    setWeekStart((prev) => addDays(prev, -7));
    setSelectedSlot(null);
  }, []);

  const handleNext = useCallback(() => {
    setWeekStart((prev) => addDays(prev, 7));
    setSelectedSlot(null);
  }, []);

  const handleSlotSelect = useCallback((slot: SelectedSlot) => {
    setSelectedSlot((prev) =>
      prev?.date === slot.date && prev?.time === slot.time ? null : slot,
    );
  }, []);

  const handleCancel = useCallback(() => setSelectedSlot(null), []);

  const handleConfirm = useCallback(() => {
    if (!selectedSlot) return;
  }, [selectedSlot]);

  return {
    weekStart,
    selectedSlot,
    mentor,
    schedule,
    handlePrev,
    handleNext,
    handleSlotSelect,
    handleCancel,
    handleConfirm,
  };
}
