'use client';

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
          isMonthStart ? 'border-primary-20 border-l-2' : ''
        }`}
      >
        {isMonthStart && (
          <span className="bg-primary-10 text-primary-dark rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
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
          <span className="bg-primary text-xsmall14 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white">
            {format(day, 'd', { locale: ko })}
          </span>
        ) : (
          <span className="text-xsmall16 text-neutral-10 font-semibold">
            {format(day, 'd', { locale: ko })}
          </span>
        )}
      </div>
    );
  },
);

DayHeaderCell.displayName = 'DayHeaderCell';

export default DayHeaderCell;
