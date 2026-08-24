'use client';

import { useMemo, useState } from 'react';

import type {
  LiveMentoringDuration,
  LiveMentoringSlot,
} from '@/api/live-mentoring/liveMentoringSchema';
import { useSlotSelection } from '../hooks/useSlotSelection';
import type { SelectedApplySlot } from '../types';
import MonthCalendar from '../ui/MonthCalendar';
import TimeSlotButtons from '../ui/TimeSlotButtons';
import { toDateKey } from '../utils';

interface ScheduleSelectSectionProps {
  slots: LiveMentoringSlot[];
  /** 고른 플랜. 60분이면 시간 칸이 연속 2개씩 잡힌다. */
  duration: LiveMentoringDuration | null;
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
 * 칸을 고르는 규칙 자체는 `useSlotSelection` 이 갖는다. 여기는 달력 이동과 배치만 한다.
 */
const ScheduleSelectSection = ({
  slots,
  duration,
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

    슬롯 조회는 첫 렌더보다 늦게 도착한다. 초기값으로만 잡으면 빈 배열 기준인 '오늘'로
    굳어 슬롯이 와도 빈 달에 머문다. 그래서 상태로 들고 있는 것은 **사용자가 고른 날**
    뿐이고, 고르기 전까지는 매 렌더 `dateRange.start` 를 따라간다. 한 번이라도 고르면
    그 뒤에 슬롯이 더 와도 덮어쓰지 않는다.
  */
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const focusedDate =
    pickedDate ?? dateRange?.start ?? toDateKey(new Date().toISOString());

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

  const { options, selectedTimes, onSelect } = useSlotSelection({
    slots,
    date: focusedDate,
    duration,
    selectedSlots,
    onSelectSlots,
  });

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

  const focusedMonth = focusedDate.slice(0, 7);
  const navigateMonth = (direction: 1 | -1) => {
    const next = new Date(year, month + direction, 1);
    setPickedDate(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`,
    );
  };

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
          canGoPrev={focusedMonth > dateRange.start.slice(0, 7)}
          canGoNext={focusedMonth < dateRange.end.slice(0, 7)}
          onPrev={() => navigateMonth(-1)}
          onNext={() => navigateMonth(1)}
          onDateSelect={setPickedDate}
        />
        <TimeSlotButtons
          options={options}
          selectedTimes={selectedTimes}
          onSelect={onSelect}
        />
      </div>
    </section>
  );
};

export default ScheduleSelectSection;
