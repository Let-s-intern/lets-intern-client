import { SLOT_START_TIMES } from '@letscareer/utils';
import { useCallback, useMemo, useState } from 'react';

import type { FeedbackSlot } from '@/api/feedback/feedbackSchema';
import type { SelectedSlot, SlotStatus } from '../types';
import { toDateString } from '../utils';

/**
 * 슬롯 시각 목록은 `@letscareer/utils` 가 정한다. 여기서 다시 만들지 않는다.
 *
 * 값 자체는 예전과 같다(09:00 ~ 22:30). 다만 같은 정책이 멘토·어드민 화면에도
 * 각각 다른 숫자로 적혀 있었고, 어드민이 22:00 에서 끊겨 멘토가 연 슬롯이
 * 사라진 적이 있다(2026-08-14 운영 문의). 세 화면이 한 값을 보게 한다.
 */
const ALL_SLOT_TIMES = SLOT_START_TIMES;

function getInitialDate(slotRangeStart: string, slotRangeEnd: string): Date {
  const today = new Date();
  const start = new Date(slotRangeStart);
  const end = new Date(slotRangeEnd);
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
  if (apiStatus === 'RESERVED') return 'booked';
  return 'unavailable';
}

export function useTimeSlotState(
  slotRangeStart: string,
  slotRangeEnd: string,
  feedbackSlots: FeedbackSlot[],
  onConfirm: (slot: SelectedSlot) => void,
) {
  const base = getInitialDate(slotRangeStart, slotRangeEnd);

  const [{ year, month }, setYearMonth] = useState({
    year: base.getFullYear(),
    month: base.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState(toDateString(base));
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const canGoPrev = useMemo(() => {
    const start = new Date(slotRangeStart);
    return (
      year > start.getFullYear() ||
      (year === start.getFullYear() && month > start.getMonth())
    );
  }, [year, month, slotRangeStart]);

  const canGoNext = useMemo(() => {
    const end = new Date(slotRangeEnd);
    return (
      year < end.getFullYear() ||
      (year === end.getFullYear() && month < end.getMonth())
    );
  }, [year, month, slotRangeEnd]);

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
    const slotsForDate = new Map(
      feedbackSlots
        .filter((slot) => slot.startDate.slice(0, 10) === selectedDate)
        .map((slot) => [toTimeString(slot.startDate), slot]),
    );

    const result: Record<string, { status: SlotStatus; label: string }> = {};
    ALL_SLOT_TIMES.forEach((time) => {
      const [h, m] = time.split(':').map(Number);
      const endH = m === 30 ? h + 1 : h;
      const endM = m === 30 ? '00' : '30';
      const endTime = `${String(endH).padStart(2, '0')}:${endM}`;
      const apiSlot = slotsForDate.get(time);
      result[time] = {
        status: apiSlot
          ? toSlotStatus(apiSlot.status, apiSlot.startDate)
          : 'unavailable',
        label: `${time} ~ ${endTime}`,
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
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
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
