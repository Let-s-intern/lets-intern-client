'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DUMMY_MENTORS, getMentorSchedule } from '../dummy';
import type { SelectedSlot } from './types';
import ReservationBar from './ui/ReservationBar';
import TimeSlotGrid from './ui/TimeSlotGrid';
import WeekNav from './ui/WeekNav';
import { addDays, getWeekStart } from './utils';

interface Props {
  selectedMentorId: string | null;
}

const TimeSlotSection = ({ selectedMentorId }: Props) => {
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
    // TODO: API 연동 시 예약 확정 로직 추가
  }, [selectedSlot]);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold">
          예약 가능한 시간
        </h2>
        {selectedMentorId && (
          <WeekNav
            weekStart={weekStart}
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
