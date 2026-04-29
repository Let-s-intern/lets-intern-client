'use client';

import { getMonth } from 'date-fns';

interface MonthDividerProps {
  /** The array of days in the current week (7 days, Mon-Sun) */
  days: Date[];
}

/**
 * Displays a month divider line when the week spans two different months.
 * The divider is positioned at the column boundary where the month changes.
 */
const MonthDivider = ({ days }: MonthDividerProps) => {
  // Find the index where the month changes
  let dividerIndex = -1;
  for (let i = 1; i < days.length; i++) {
    if (getMonth(days[i]) !== getMonth(days[i - 1])) {
      dividerIndex = i;
      break;
    }
  }

  if (dividerIndex === -1) return null;

  const nextMonth = days[dividerIndex];
  const monthLabel = `${nextMonth.getMonth() + 1}월`;

  // Position: dividerIndex / 7 * 100%
  const leftPercent = (dividerIndex / 7) * 100;

  return (
    <div
      className="pointer-events-none absolute bottom-0 top-0 z-10 flex flex-col items-center"
      style={{ left: `${leftPercent}%` }}
    >
      <div className="bg-primary-20 h-full w-px" />
      <span className="bg-primary-10 text-primary-dark absolute -top-5 rounded-full px-2 py-0.5 text-[10px] font-semibold">
        {monthLabel}
      </span>
    </div>
  );
};

export default MonthDivider;
