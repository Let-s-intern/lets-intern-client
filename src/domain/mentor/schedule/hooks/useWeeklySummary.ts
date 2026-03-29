import { useMemo } from 'react';
import { addDays, isSameDay, startOfWeek } from 'date-fns';

import type { PeriodBarData } from '../challenge-period/ChallengePeriodBar';

interface WeeklySummaryCounts {
  totalCount: number;
  todayDueCount: number;
  incompleteCount: number;
  completedCount: number;
}

/**
 * Computes weekly summary counts from period bars.
 * Filters bars that overlap with the given week and aggregates counts.
 */
export function useWeeklySummary(
  bars: PeriodBarData[],
  weekStartDate: Date,
): WeeklySummaryCounts {
  return useMemo(() => {
    const weekStart = startOfWeek(weekStartDate, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    const today = new Date();

    let total = 0;
    let todayDue = 0;
    let incomplete = 0;
    let completed = 0;

    for (const bar of bars) {
      const barStart = new Date(bar.startDate);
      const barEnd = new Date(bar.endDate);

      // Check if the bar overlaps with the current week
      if (barStart <= weekEnd && barEnd >= weekStart) {
        const barTotal = bar.submittedCount + bar.notSubmittedCount;
        total += barTotal;

        // Today due: endDate is today
        if (isSameDay(barEnd, today)) {
          todayDue += barTotal;
        }

        // Incomplete: waiting + in progress
        incomplete += bar.waitingCount + bar.inProgressCount;

        // Completed
        completed += bar.completedCount;
      }
    }

    return {
      totalCount: total,
      todayDueCount: todayDue,
      incompleteCount: incomplete,
      completedCount: completed,
    };
  }, [bars, weekStartDate]);
}
