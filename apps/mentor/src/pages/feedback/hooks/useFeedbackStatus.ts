import { useMemo } from 'react';

import { resolveWrittenSubmissionState } from '../utils/writtenSubmissionState';

interface AttendanceItem {
  id?: number | null;
  status?: string | null;
  feedbackStatus?: string | null;
}

interface FeedbackStatusCounts {
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  /** 지각 제출 — 피드백 대상이 아니라 진행 상태 3종 어디에도 들어가지 않는다. */
  blockedCount: number;
}

/**
 * Single-pass aggregation of feedback status counts from attendance list.
 *
 * 지각 제출자는 피드백을 진행할 수 없으므로 '진행 전'에 섞지 않고 따로 센다.
 * 섞어 두면 헤더의 진행 전 건수가 영원히 줄지 않아 멘토가 남은 일을 오판한다.
 */
export function useFeedbackStatus(
  attendanceList: AttendanceItem[],
): FeedbackStatusCounts {
  return useMemo(() => {
    let waiting = 0;
    let inProgress = 0;
    let completed = 0;
    let blocked = 0;

    for (const a of attendanceList) {
      const submissionState = resolveWrittenSubmissionState({
        status: a.status,
        attendanceId: a.id,
      });
      if (submissionState === 'late') {
        blocked++;
        continue;
      }
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
      blockedCount: blocked,
    };
  }, [attendanceList]);
}
