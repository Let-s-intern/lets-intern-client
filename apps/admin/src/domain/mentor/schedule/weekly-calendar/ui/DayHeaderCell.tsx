import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { forwardRef } from 'react';

const DAY_LABELS_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

interface DayHeaderCellProps {
  day: Date;
  today: Date;
  isMonthStart: boolean;
}

const DayHeaderCell = forwardRef<HTMLDivElement, DayHeaderCellProps>(
  ({ day, today, isMonthStart }, ref) => {
    const isToday = isSameDay(day, today);
    const isSunday = day.getDay() === 0;

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center gap-1 py-2 ${
          isMonthStart ? 'border-l-2 border-primary-20' : ''
        }`}
      >
        {isMonthStart && (
          <span className="rounded-full bg-primary-10 px-1.5 py-0.5 text-[10px] font-semibold text-primary-dark">
            {format(day, 'M월', { locale: ko })}
          </span>
        )}
        <span
          className={`text-xsmall14 font-medium ${
            isSunday
              ? 'text-[#dd1900]'
              : isToday
                ? 'text-neutral-40'
                : 'text-neutral-10'
          }`}
        >
          {DAY_LABELS_SHORT[day.getDay()]}
        </span>
        {isToday ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xsmall14 font-semibold text-white">
            {format(day, 'd', { locale: ko })}
          </span>
        ) : (
          <span className="text-xsmall16 font-semibold text-neutral-10">
            {format(day, 'd', { locale: ko })}
          </span>
        )}
      </div>
    );
  },
);

DayHeaderCell.displayName = 'DayHeaderCell';

export default DayHeaderCell;
