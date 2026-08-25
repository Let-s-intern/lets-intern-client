'use client';

import type { ApplySlotOption } from '../types';

const STATE_CLASSES: Record<'selected' | 'available', string> = {
  selected: 'border-primary bg-primary-10 text-primary font-semibold',
  available: 'border-neutral-80 text-neutral-20 hover:bg-neutral-90',
};

interface TimeSlotButtonsProps {
  options: ApplySlotOption[];
  /** 선택된 버튼의 시작 시각. 60분 플랜도 버튼은 하나다. */
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

/**
 * 시간 버튼 — `domain/challenge/feedback/live/ui/TimeSlotButtons.tsx` 의 복제본이다.
 * 원본은 읽기만 하고 수정하지 않는다.
 *
 * 원본과 다른 점 둘. 선택을 `SelectedSlot` 이 아니라 **시각 문자열**로 받는다 —
 * 60분 플랜은 슬롯 2건을 `13:00 ~ 14:00` 버튼 하나로 합쳐 그린다. 그리고 비활성
 * 칸이 없다 — 예약 가능한 자리만 넘어오므로 모든 버튼이 눌린다.
 */
const TimeSlotButtons = ({
  options,
  selectedTime,
  onSelect,
}: TimeSlotButtonsProps) => {
  if (options.length === 0) {
    return (
      <p className="border-neutral-80 text-xsmall14 text-neutral-40 w-full rounded-sm border px-4 py-8 text-center">
        이 날은 예약 가능한 시간이 없습니다.
      </p>
    );
  }

  return (
    <div className="grid w-full grid-cols-3 gap-x-3 gap-y-3 md:grid-cols-4">
      {options.map(({ time, label }) => {
        const slotState = selectedTime === time ? 'selected' : 'available';

        return (
          <button
            key={time}
            type="button"
            onClick={() => onSelect(time)}
            className={`text-xxsmall12 flex flex-1 items-center justify-center rounded-sm border py-2 transition-colors ${STATE_CLASSES[slotState]}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotButtons;
