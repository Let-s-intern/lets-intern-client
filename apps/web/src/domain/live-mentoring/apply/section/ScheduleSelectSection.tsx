'use client';

import { useMemo, useState } from 'react';

import type { LiveMentoringSlot } from '@/api/live-mentoring/liveMentoringSchema';
import type { ApplySlotOption, SelectedApplySlot } from '../types';
import { toDateKey, toSlotLabel, toTimeKey } from '../utils';
import MonthCalendar from '../ui/MonthCalendar';
import TimeSlotButtons from '../ui/TimeSlotButtons';

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

interface ScheduleSelectSectionProps {
  slots: LiveMentoringSlot[];
  selectedSlots: SelectedApplySlot[];
  onSelectSlots: (slots: SelectedApplySlot[]) => void;
}

/**
 * 예약 일시 선택 (시안 `1-0` 두 번째 섹션) — 캘린더 + 30분 단위 시간 그리드.
 *
 * 원본 `useTimeSlotState` 는 `slotRangeStart`/`slotRangeEnd` 를 인자로 받지만
 * 라이브 멘토링 슬롯 API 는 범위 없이 목록만 준다. **슬롯 배열에서 최소·최대
 * `startDate` 를 직접 뽑아 범위를 만든다.**
 *
 * 이 단계의 선택은 단일 선택이다. 60분 플랜의 연속 2슬롯은 `1.5` 다.
 */
const ScheduleSelectSection = ({
  slots,
  selectedSlots,
  onSelectSlots,
}: ScheduleSelectSectionProps) => {
  /*
    슬롯이 오름차순이라는 보장은 계약에 없다. 사전순 비교가 곧 시간순이므로
    min/max 로 방어한다 — 뒤집힌 범위가 나오면 캘린더 화살표가 반대로 잠긴다.
  */
  const dateRange = useMemo(() => {
    if (slots.length === 0) return null;
    let min = slots[0].startDate;
    let max = slots[0].startDate;
    for (const slot of slots) {
      if (slot.startDate < min) min = slot.startDate;
      if (slot.startDate > max) max = slot.startDate;
    }
    return { start: toDateKey(min), end: toDateKey(max) };
  }, [slots]);

  /*
    첫 화면은 예약 가능한 가장 이른 날로 연다. 오늘로 열면 로컬처럼 슬롯이 한 달 뒤에만
    있을 때 빈 달이 뜨고, 사용자가 화살표를 몇 번 눌러야 하는지 알 수 없다.
  */
  const [focusedDate, setFocusedDate] = useState(
    () => dateRange?.start ?? toDateKey(new Date().toISOString()),
  );

  const [year, month] = useMemo(() => {
    const [y, m] = focusedDate.split('-').map(Number);
    return [y, m - 1];
  }, [focusedDate]);

  const monthAvailability = useMemo(() => {
    const result: Record<string, boolean> = {};
    for (const slot of slots) {
      if (slot.status === 'OPEN') result[toDateKey(slot.startDate)] = true;
    }
    return result;
  }, [slots]);

  const slotsByTime = useMemo(() => {
    const result = new Map<string, LiveMentoringSlot>();
    for (const slot of slots) {
      if (toDateKey(slot.startDate) === focusedDate) {
        result.set(toTimeKey(slot.startDate), slot);
      }
    }
    return result;
  }, [slots, focusedDate]);

  const options = useMemo<ApplySlotOption[]>(
    () =>
      GRID_TIMES.map((time) => {
        const slot = slotsByTime.get(time);
        return {
          time,
          label: slot
            ? toSlotLabel(slot.startDate, slot.endDate)
            : `${time} ~ ${addThirtyMinutes(time)}`,
          status:
            slot && slot.status === 'OPEN'
              ? ('available' as const)
              : ('unavailable' as const),
        };
      }),
    [slotsByTime],
  );

  const selectedTimes = selectedSlots
    .filter((slot) => slot.date === focusedDate)
    .map((slot) => slot.time);

  const handleSelect = (time: string) => {
    const slot = slotsByTime.get(time);
    if (!slot) return;
    // 같은 칸을 다시 누르면 선택을 푼다
    if (selectedTimes.includes(time)) {
      onSelectSlots([]);
      return;
    }
    onSelectSlots([
      {
        slotId: slot.slotId,
        date: focusedDate,
        time,
        startDate: slot.startDate,
        endDate: slot.endDate,
      },
    ]);
  };

  const navigateMonth = (direction: 1 | -1) => {
    const next = new Date(year, month + direction, 1);
    setFocusedDate(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`,
    );
  };

  if (dateRange === null) {
    return (
      <section className="flex flex-col gap-3">
        <h3 className="text-xsmall16 text-neutral-0 font-semibold">
          예약 일시 선택 <span className="text-primary">(필수)</span>
        </h3>
        <p className="border-neutral-80 text-xsmall14 text-neutral-40 rounded-sm border px-4 py-8 text-center">
          현재 예약 가능한 일정이 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xsmall16 text-neutral-0 font-semibold">
        예약 일시 선택 <span className="text-primary">(필수)</span>
      </h3>

      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <MonthCalendar
          year={year}
          month={month}
          selectedDate={focusedDate}
          monthAvailability={monthAvailability}
          canGoPrev={`${year}-${String(month + 1).padStart(2, '0')}` > dateRange.start.slice(0, 7)}
          canGoNext={`${year}-${String(month + 1).padStart(2, '0')}` < dateRange.end.slice(0, 7)}
          onPrev={() => navigateMonth(-1)}
          onNext={() => navigateMonth(1)}
          onDateSelect={setFocusedDate}
        />
        <TimeSlotButtons
          options={options}
          selectedTimes={selectedTimes}
          onSelect={handleSelect}
        />
      </div>
    </section>
  );
};

export default ScheduleSelectSection;
