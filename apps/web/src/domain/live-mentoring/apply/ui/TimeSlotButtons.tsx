'use client';

import type { ApplySlotOption } from '../types';

const STATE_CLASSES: Record<'selected' | 'unavailable' | 'available', string> =
  {
    selected: 'border-primary bg-primary-10 text-primary font-semibold',
    unavailable:
      'border-neutral-90 bg-neutral-90 text-neutral-60 cursor-default',
    available: 'border-neutral-80 text-neutral-20 hover:bg-neutral-90',
  };

interface TimeSlotButtonsProps {
  options: ApplySlotOption[];
  /** 선택된 시작 시각들. 60분 플랜은 연속 2개가 함께 들어온다. */
  selectedTimes: string[];
  onSelect: (time: string) => void;
}

/**
 * 30분 단위 시간 버튼 — `domain/challenge/feedback/live/ui/TimeSlotButtons.tsx` 의
 * 복제본이다. 원본은 읽기만 하고 수정하지 않는다.
 *
 * 원본과 다른 점 하나: 선택을 `SelectedSlot` 하나가 아니라 **시각 배열**로 받는다.
 * 60분 플랜이 연속 2칸을 동시에 강조해야 하기 때문이다(시안 `1-2`).
 */
const TimeSlotButtons = ({
  options,
  selectedTimes,
  onSelect,
}: TimeSlotButtonsProps) => {
  return (
    <div className="grid w-full grid-cols-3 gap-x-3 gap-y-3 md:grid-cols-4">
      {options.map(({ time, label, status }) => {
        const isSelected = selectedTimes.includes(time);
        const slotState = isSelected
          ? 'selected'
          : status === 'unavailable'
            ? 'unavailable'
            : 'available';

        return (
          <button
            key={time}
            type="button"
            disabled={status === 'unavailable'}
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
