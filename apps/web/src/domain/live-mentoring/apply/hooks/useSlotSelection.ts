'use client';

import { useMemo } from 'react';

import type {
  LiveMentoringDuration,
  LiveMentoringSlot,
} from '@/api/live-mentoring/liveMentoringSchema';
import type { ApplySlotOption, SelectedApplySlot } from '../types';
import { toDateKey, toSlotLabel, toTimeKey } from '../utils';

/**
 * 시간 그리드는 09:00~23:00 을 30분으로 끊은 고정 격자다 (시안 `1-0`).
 * 슬롯이 없는 시각도 자리를 지켜야 격자가 흔들리지 않는다.
 * 원본 `challenge/feedback/live/hooks/useTimeSlotState.ts` 와 같은 범위다.
 */
const GRID_TIMES: string[] = Array.from({ length: 28 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

const addThirtyMinutes = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + 30;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const toSelected = (slot: LiveMentoringSlot): SelectedApplySlot => ({
  slotId: slot.slotId,
  date: toDateKey(slot.startDate),
  time: toTimeKey(slot.startDate),
  startDate: slot.startDate,
  endDate: slot.endDate,
});

interface UseSlotSelectionParams {
  /** 예약 가능 슬롯 전체. 연속 판정에 다음 날 첫 칸까지 필요하므로 그날치만 넘기면 안 된다. */
  slots: LiveMentoringSlot[];
  /** 캘린더에서 보고 있는 날짜 'YYYY-MM-DD'. */
  date: string;
  /** 고른 플랜. 아직 안 골랐으면 30분과 같게 다룬다. */
  duration: LiveMentoringDuration | null;
  selectedSlots: SelectedApplySlot[];
  onSelectSlots: (slots: SelectedApplySlot[]) => void;
}

/**
 * 플랜에 맞춰 슬롯을 고른다.
 *
 * - 30분 플랜: 슬롯 1칸
 * - 60분 플랜: 누른 칸과 **바로 다음 30분 칸**을 함께 잡는다 (시안 `1-2`)
 *
 * 다음 칸이 없거나 `OPEN` 이 아니면 그 칸은 아예 **선택 불가**로 그린다. 눌러 놓고
 * 나중에 막는 것이 아니라 처음부터 막는다 — 그날 마지막 칸이 대표적이다.
 *
 * 연속 판정은 **`endDate`(직전) === `startDate`(다음)** 으로 한다. 서버가
 * `validateSlotsAreConsecutive` 로 같은 기준을 다시 검증하므로, 여기서 시각을
 * 30분 더하는 식으로 흉내 내면 규칙이 갈라지는 순간 신청이 400 으로 떨어진다.
 */
export function useSlotSelection({
  slots,
  date,
  duration,
  selectedSlots,
  onSelectSlots,
}: UseSlotSelectionParams) {
  const needsTwoSlots = duration === 60;

  /** 이어붙일 다음 칸을 O(1) 로 찾기 위한 색인. 키는 슬롯 시작 시각 원본이다. */
  const slotByStart = useMemo(() => {
    const result = new Map<string, LiveMentoringSlot>();
    for (const slot of slots) result.set(slot.startDate, slot);
    return result;
  }, [slots]);

  const daySlotByTime = useMemo(() => {
    const result = new Map<string, LiveMentoringSlot>();
    for (const slot of slots) {
      if (toDateKey(slot.startDate) === date) {
        result.set(toTimeKey(slot.startDate), slot);
      }
    }
    return result;
  }, [slots, date]);

  const nextOpenSlot = (slot: LiveMentoringSlot) => {
    const next = slotByStart.get(slot.endDate);
    return next && next.status === 'OPEN' ? next : null;
  };

  const options = useMemo<ApplySlotOption[]>(
    () =>
      GRID_TIMES.map((time) => {
        const slot = daySlotByTime.get(time);
        const isOpen = slot?.status === 'OPEN';
        const hasNext =
          !needsTwoSlots ||
          (slot != null && slotByStart.get(slot.endDate)?.status === 'OPEN');

        return {
          time,
          label: slot
            ? toSlotLabel(slot.startDate, slot.endDate)
            : `${time} ~ ${addThirtyMinutes(time)}`,
          status: isOpen && hasNext ? 'available' : 'unavailable',
        };
      }),
    [daySlotByTime, slotByStart, needsTwoSlots],
  );

  const selectedTimes = useMemo(
    () =>
      selectedSlots
        .filter((slot) => slot.date === date)
        .map((slot) => slot.time),
    [selectedSlots, date],
  );

  const onSelect = (time: string) => {
    const slot = daySlotByTime.get(time);
    if (!slot || slot.status !== 'OPEN') return;

    // 이미 잡힌 칸을 다시 누르면 선택을 통째로 푼다. 60분이면 두 칸이 함께 풀린다.
    if (selectedTimes.includes(time)) {
      onSelectSlots([]);
      return;
    }

    if (!needsTwoSlots) {
      onSelectSlots([toSelected(slot)]);
      return;
    }

    const next = nextOpenSlot(slot);
    if (!next) return;
    onSelectSlots([toSelected(slot), toSelected(next)]);
  };

  return { options, selectedTimes, onSelect };
}
