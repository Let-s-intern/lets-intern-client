'use client';

import { useMemo } from 'react';

import type {
  LiveMentoringDuration,
  LiveMentoringSlot,
} from '@/api/live-mentoring/liveMentoringSchema';
import type { ApplySlotOption, SelectedApplySlot } from '../types';
import { toDateKey, toSlotLabel, toTimeKey } from '../utils';

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
 * **버튼은 고를 수 있는 자리만 만든다.** 멘토가 열지 않은 시각은 자리도 잡지 않는다 —
 * 09:00~23:00 고정 격자를 그리던 때는 대부분이 회색이라 눌리는 칸을 눈으로 찾아야 했다.
 * 60분으로 이을 다음 칸이 없는 자리(그날 마지막 칸이 대표적이다)도 같은 이유로 뺀다.
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

  /*
    슬롯 배열이 오름차순이라는 보장은 계약에 없다. 격자가 순서를 잡아 주던 것이
    없어졌으므로 여기서 직접 정렬한다. 자리수가 고정된 ISO 라 사전순이 곧 시간순이다.
  */
  const dayOpenSlots = useMemo(
    () =>
      slots
        .filter(
          (slot) =>
            slot.status === 'OPEN' && toDateKey(slot.startDate) === date,
        )
        .sort((a, b) => (a.startDate < b.startDate ? -1 : 1)),
    [slots, date],
  );

  const options = useMemo<ApplySlotOption[]>(
    () =>
      dayOpenSlots.flatMap((slot) => {
        if (needsTwoSlots && slotByStart.get(slot.endDate)?.status !== 'OPEN') {
          return [];
        }

        return [
          {
            time: toTimeKey(slot.startDate),
            label: toSlotLabel(slot.startDate, slot.endDate),
          },
        ];
      }),
    [dayOpenSlots, slotByStart, needsTwoSlots],
  );

  const selectedTimes = useMemo(
    () =>
      selectedSlots
        .filter((slot) => slot.date === date)
        .map((slot) => slot.time),
    [selectedSlots, date],
  );

  const onSelect = (time: string) => {
    const slot = dayOpenSlots.find(
      (candidate) => toTimeKey(candidate.startDate) === time,
    );
    if (!slot) return;

    // 이미 잡힌 칸을 다시 누르면 선택을 통째로 푼다. 60분이면 두 칸이 함께 풀린다.
    if (selectedTimes.includes(time)) {
      onSelectSlots([]);
      return;
    }

    if (!needsTwoSlots) {
      onSelectSlots([toSelected(slot)]);
      return;
    }

    const next = slotByStart.get(slot.endDate);
    if (next?.status !== 'OPEN') return;
    onSelectSlots([toSelected(slot), toSelected(next)]);
  };

  return { options, selectedTimes, onSelect };
}
