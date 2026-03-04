'use client';

import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';

interface WeekNavigationProps {
  weekStartDate: Date;
  onWeekChange: (date: Date) => void;
}

const WeekNavigation = ({ weekStartDate, onWeekChange }: WeekNavigationProps) => {
  const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 });

  const handlePrev = () => {
    onWeekChange(subWeeks(weekStart, 1));
  };

  const handleNext = () => {
    onWeekChange(addWeeks(weekStart, 1));
  };

  const formatDate = (date: Date) => format(date, 'MM.dd', { locale: ko });

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handlePrev}
        className="text-neutral-500 hover:text-neutral-900"
        aria-label="이전 주"
      >
        &larr;
      </button>
      <span className="text-sm font-medium text-neutral-700">
        {formatDate(weekStart)} ~ {formatDate(weekEnd)}
      </span>
      <button
        type="button"
        onClick={handleNext}
        className="text-neutral-500 hover:text-neutral-900"
        aria-label="다음 주"
      >
        &rarr;
      </button>
    </div>
  );
};

export default WeekNavigation;
