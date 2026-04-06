import { useMemo } from 'react';
import { isSameDay } from 'date-fns';

import type { PeriodBarData } from '../types';

interface WeeklySummaryCounts {
  totalCount: number;
  todayDueCount: number;
  incompleteCount: number;
  completedCount: number;
}

/**
 * Computes summary counts from ALL bars (no week filtering).
 * Aggregates across all participating in-progress challenges.
 * Tag filtering does NOT affect these counts — always pass unfiltered bars.
 */
export function useWeeklySummary(bars: PeriodBarData[]): WeeklySummaryCounts {
  return useMemo(() => {
    const today = new Date();

    let total = 0;
    let todayDue = 0;
    let incomplete = 0;
    let completed = 0;

    for (const bar of bars) {
      const barTotal = bar.submittedCount + bar.notSubmittedCount;
      total += barTotal;

      // Today due: endDate is today
      if (isSameDay(new Date(bar.endDate), today)) {
        todayDue += barTotal;
      }

      // Incomplete: waiting + in progress
      incomplete += bar.waitingCount + bar.inProgressCount;

      // Completed
      completed += bar.completedCount;
    }

    return {
      totalCount: total,
      todayDueCount: todayDue,
      incompleteCount: incomplete,
      completedCount: completed,
    };
  }, [bars]);
}
