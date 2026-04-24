import { useMemo } from 'react';

interface AttendanceItem {
  feedbackStatus?: string | null;
}

interface FeedbackStatusCounts {
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
}

/**
 * Single-pass aggregation of feedback status counts from attendance list.
 */
export function useFeedbackStatus(
  attendanceList: AttendanceItem[],
): FeedbackStatusCounts {
  return useMemo(() => {
    let waiting = 0;
    let inProgress = 0;
    let completed = 0;

    for (const a of attendanceList) {
      const status = a.feedbackStatus;
      if (status === 'COMPLETED' || status === 'CONFIRMED') {
        completed++;
      } else if (status === 'IN_PROGRESS') {
        inProgress++;
      } else {
        waiting++;
      }
    }

    return {
      waitingCount: waiting,
      inProgressCount: inProgress,
      completedCount: completed,
    };
  }, [attendanceList]);
}
