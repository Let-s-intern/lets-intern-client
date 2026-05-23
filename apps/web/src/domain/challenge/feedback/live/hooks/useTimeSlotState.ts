import { useCallback, useMemo, useState } from 'react';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';
import type { MissionPeriod, SelectedSlot, SlotStatus } from '../types';
import { toDateString } from '../utils';

function getInitialDate(period: MissionPeriod): Date {
  const today = new Date();
  const start = new Date(period.startDay);
  const end = new Date(period.endDay);
  if (today < start) return start;
  if (today > end) return end;
  return today;
}

function toTimeString(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function toSlotStatus(
  apiStatus: FeedbackSlot['status'],
  startDate: string,
): SlotStatus {
  if (new Date(startDate) <= new Date()) return 'expired';
  if (apiStatus === 'OPEN') return 'available';
  if (apiStatus === 'BOOKED') return 'booked';
  return 'unavailable';
}

export function useTimeSlotState(
  period: MissionPeriod,
  feedbackSlots: FeedbackSlot[],
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

  const monthAvailability = useMemo(() => {
    const result: Record<string, boolean> = {};
    feedbackSlots.forEach((slot) => {
      const date = slot.startDate.slice(0, 10);
      if (result[date] === undefined) result[date] = false;
      if (slot.status === 'OPEN' && new Date(slot.startDate) > new Date()) {
        result[date] = true;
      }
    });
    return result;
  }, [feedbackSlots]);

  const daySlots = useMemo(() => {
    const result: Record<string, { status: SlotStatus; label: string }> = {};
    feedbackSlots
      .filter((slot) => slot.startDate.slice(0, 10) === selectedDate)
      .forEach((slot) => {
        const startTime = toTimeString(slot.startDate);
        const endTime = toTimeString(slot.endDate);
        result[startTime] = {
          status: toSlotStatus(slot.status, slot.startDate),
          label: `${startTime} ~ ${endTime}`,
        };
      });
    return result;
  }, [feedbackSlots, selectedDate]);

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

  const handleSlotSelect = useCallback(
    (date: string, time: string) => {
      if (selectedSlot?.date === date && selectedSlot?.time === time) {
        setSelectedSlot(null);
        return;
      }
      const apiSlot = feedbackSlots.find(
        (s) =>
          s.startDate.slice(0, 10) === date &&
          toTimeString(s.startDate) === time,
      );
      if (!apiSlot) return;
      setSelectedSlot({
        feedbackSlotId: apiSlot.feedbackSlotId,
        date,
        time,
        startDate: apiSlot.startDate,
        endDate: apiSlot.endDate,
      });
    },
    [feedbackSlots, selectedSlot],
  );

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
