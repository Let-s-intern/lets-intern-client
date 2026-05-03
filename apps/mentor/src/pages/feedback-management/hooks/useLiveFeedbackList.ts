import { useMemo } from 'react';

import { LIVE_FEEDBACK_MOCK_DATA } from '@/pages/schedule/challenge-content/liveFeedbackMock';
import type { PeriodBarData } from '@/pages/schedule/types';

/** 라이브 피드백 1개 "회차" = 하나의 live-feedback-period 바 + 그 기간 내 session 바들 */
export interface LiveFeedbackRound {
  challengeId: number;
  challengeTitle: string;
  colorIndex: number;
  th: number;
  startDate: string;
  endDate: string;
  /** 예약 완료된 (세션이 있는) 멘티 수 */
  totalMentees: number;
  /** status === 'completed' 인 세션 수 */
  completedCount: number;
  /** 진행중 + 지각 등 active 상태 수 */
  inProgressCount: number;
  /** waiting + undefined 상태 수 */
  waitingCount: number;
  /** 해당 회차의 개별 라이브 세션 바들 (모달에서 사용) */
  sessionBars: PeriodBarData[];
}

export interface LiveFeedbackChallenge {
  challengeId: number;
  title: string;
  colorIndex: number;
  rounds: LiveFeedbackRound[];
}

function countByStatus(bars: PeriodBarData[]) {
  let completed = 0;
  let inProgress = 0;
  let waiting = 0;
  for (const b of bars) {
    const status = b.liveFeedback?.status;
    if (status === 'completed') completed += 1;
    else if (
      status === 'in-progress' ||
      status === 'mentor-late' ||
      status === 'mentee-late'
    )
      inProgress += 1;
    else waiting += 1;
  }
  return { completed, inProgress, waiting };
}

/** 라이브 피드백을 챌린지 → 회차 단위로 묶어 반환. */
export function useLiveFeedbackList(): {
  challenges: LiveFeedbackChallenge[];
  /** 모든 세션 바 (모달 네비게이션용) */
  allSessionBars: PeriodBarData[];
} {
  return useMemo(() => {
    type Group = {
      periodBars: PeriodBarData[];
      sessionBars: PeriodBarData[];
      title: string;
      colorIndex: number;
    };
    const byChallenge = new Map<number, Group>();

    for (const bar of LIVE_FEEDBACK_MOCK_DATA) {
      if (
        bar.barType !== 'live-feedback' &&
        bar.barType !== 'live-feedback-period'
      )
        continue;

      if (!byChallenge.has(bar.challengeId)) {
        byChallenge.set(bar.challengeId, {
          periodBars: [],
          sessionBars: [],
          title: bar.challengeTitle,
          colorIndex: bar.colorIndex ?? 0,
        });
      }
      const g = byChallenge.get(bar.challengeId)!;
      if (bar.barType === 'live-feedback-period') g.periodBars.push(bar);
      else g.sessionBars.push(bar);
    }

    const challenges: LiveFeedbackChallenge[] = [];
    const allSessionBars: PeriodBarData[] = [];

    byChallenge.forEach((group, challengeId) => {
      const rounds: LiveFeedbackRound[] = group.periodBars
        .sort((a, b) => a.th - b.th)
        .map((period) => {
          const sessions = group.sessionBars.filter(
            (s) =>
              s.startDate >= period.startDate && s.startDate <= period.endDate,
          );
          const { completed, inProgress, waiting } = countByStatus(sessions);

          return {
            challengeId,
            challengeTitle: period.challengeTitle,
            colorIndex: group.colorIndex,
            th: period.th,
            startDate: period.startDate,
            endDate: period.endDate,
            totalMentees: sessions.length,
            completedCount: completed,
            inProgressCount: inProgress,
            waitingCount: waiting,
            sessionBars: sessions,
          };
        });

      allSessionBars.push(...group.sessionBars);

      challenges.push({
        challengeId,
        title: group.title,
        colorIndex: group.colorIndex,
        rounds,
      });
    });

    return { challenges, allSessionBars };
  }, []);
}
