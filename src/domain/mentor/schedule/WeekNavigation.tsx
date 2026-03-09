'use client';

import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';

interface WeekNavigationProps {
  weekStartDate: Date;
  onWeekChange: (date: Date) => void;
}

const WeekNavigation = ({
  weekStartDate,
  onWeekChange,
}: WeekNavigationProps) => {
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
    <div className="inline-flex items-start gap-2">
      <button
        type="button"
        onClick={handlePrev}
        className="flex h-6 w-6 items-center justify-center"
        aria-label="이전 주"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 9L10 13L14 17"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <span className="text-base font-semibold leading-6 text-neutral-900">
        {formatDate(weekStart)} – {formatDate(weekEnd)}
      </span>
      <button
        type="button"
        onClick={handleNext}
        className="flex h-6 w-6 items-center justify-center"
        aria-label="다음 주"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 9L14 13L10 17"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default WeekNavigation;
