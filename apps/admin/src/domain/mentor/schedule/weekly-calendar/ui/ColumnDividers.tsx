import { getMonth, isSameDay } from 'date-fns';
import { useMemo } from 'react';

interface ColumnDividersProps {
  days: Date[];
  gridCols: string;
}

const ColumnDividers = ({ days, gridCols }: ColumnDividersProps) => {
  const today = useMemo(() => new Date(), []);

  return (
    <div
      className="absolute inset-0"
      style={{ display: 'grid', gridTemplateColumns: gridCols }}
    >
      {days.map((day, i) => {
        const isMonthStart =
          i > 0 && getMonth(day) !== getMonth(days[i - 1]);
        const isToday = isSameDay(day, today);
        return (
          <div
            key={i}
            className={`${
              isToday
                ? 'bg-[#fbf9fe]'
                : ''
            } ${
              isMonthStart
                ? 'border-l-2 border-primary-20'
                : i > 0
                  ? 'border-l border-neutral-90'
                  : ''
            }`}
          />
        );
      })}
    </div>
  );
};

export default ColumnDividers;
