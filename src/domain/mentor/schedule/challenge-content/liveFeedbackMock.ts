import type { PeriodBarData } from '../types';

/**
 * 라이브 피드백 목데이터 (1:1 세션).
 * API 연동 시 useLiveFeedbackData 훅의 반환값만 교체하면 됩니다.
 *
 * - barType: 'live-feedback'
 * - startDate / endDate / feedbackDeadline: 세션 당일로 동일 (단일 날짜)
 * - missionId: 음수 — 서면 피드백 missionId와 충돌 방지
 * - challengeId: API 연동 시 실제 챌린지 ID로 교체 필요
 */
export const LIVE_FEEDBACK_MOCK_DATA: PeriodBarData[] = [
  {
    barType: 'live-feedback',
    challengeId: 1,
    missionId: -101,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 1,
    startDate: '2026-04-28',
    endDate: '2026-04-28',
    feedbackStartDate: '2026-04-28',
    feedbackDeadline: '2026-04-28',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    colorIndex: 0,
    liveFeedback: {
      id: 101,
      menteeName: '이지수',
      startTime: '09:00',
      endTime: '09:30',
    },
  },
  {
    barType: 'live-feedback',
    challengeId: 1,
    missionId: -102,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 2,
    startDate: '2026-05-07',
    endDate: '2026-05-07',
    feedbackStartDate: '2026-05-07',
    feedbackDeadline: '2026-05-07',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    colorIndex: 0,
    liveFeedback: {
      id: 102,
      menteeName: '이지수',
      startTime: '09:00',
      endTime: '09:30',
    },
  },
];
