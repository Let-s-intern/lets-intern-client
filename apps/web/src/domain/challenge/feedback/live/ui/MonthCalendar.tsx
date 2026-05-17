import clsx from 'clsx';
import { toDateString } from '../utils';

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'] as const;

const DAY_STATE_CLASSES: Record<
  'selected' | 'today' | 'disabled' | 'available',
  string
> = {
  selected: 'bg-primary text-neutral-100 rounded-sm',
  today: 'bg-primary-10 rounded-full',
  disabled: 'text-neutral-60 cursor-default rounded-sm',
  available: 'text-neutral-20 hover:bg-neutral-90 rounded-sm',
};
const TODAY = toDateString(new Date());

interface Props {
  year: number;
  month: number;
  selectedDate: string;
  monthAvailability: Record<string, boolean>;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDateSelect: (date: string) => void;
}

const MonthCalendar = ({
  year,
  month,
  selectedDate,
  monthAvailability,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onDateSelect,
}: Props) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 월요일 시작 기준 첫 날 오프셋 (월=0 ... 일=6)
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="border-neutral-80 flex w-full flex-col gap-5 rounded-sm border p-5 md:w-[298px] md:shrink-0">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="hover:bg-neutral-90 rounded-full p-1 disabled:opacity-30"
        >
          <img
            src="/icons/Chevron_Left_MD.svg"
            alt="이전 달"
            className="h-5 w-5"
          />
        </button>
        <span className="text-xsmall16 text-neutral-0 font-semibold">
          {year}년 {month + 1}월
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="hover:bg-neutral-90 rounded-full p-1 disabled:opacity-30"
        >
          <img
            src="/icons/Chevron_Right_MD.svg"
            alt="다음 달"
            className="h-5 w-5"
          />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div>
        <div className="mb-1 grid grid-cols-7 gap-x-2">
          {DAY_NAMES.map((day, i) => (
            <span
              key={day}
              className={clsx(
                'text-xsmall14 inline-flex h-8 w-8 items-center justify-center font-medium',
                i === 6 ? 'text-red-500' : 'text-neutral-40',
              )}
            >
              {day}
            </span>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-x-2 gap-y-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === TODAY;
            const isAvailable = monthAvailability[dateStr] === true;
            const isSunday = (firstDayOfWeek + day - 1) % 7 === 6;
            const isPast = dateStr < TODAY;
            const isDisabled = !isAvailable && !isToday;

            const dayState = isSelected
              ? 'selected'
              : isToday
                ? 'today'
                : isDisabled || isPast
                  ? 'disabled'
                  : 'available';

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => onDateSelect(dateStr)}
                className={`text-xsmall14 mx-auto flex h-8 w-8 items-center justify-center ${DAY_STATE_CLASSES[dayState]}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;
