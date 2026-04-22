import type { PeriodBarData } from '../types';

/**
 * 서면 피드백 목데이터 (PeriodBarData[]).
 *
 * 규칙:
 *  1. 같은 챌린지 내부에서 일정이 겹치지 않음 (mission startDate ~ feedbackDeadline 전체 span 기준)
 *  2. 서면 피드백 ↔ 라이브 피드백 간 최소 3일 간격 유지
 *  3. WRITTEN_FEEDBACK_CONFIG 준수:
 *     feedbackStartDate = missionEndDate + 2, feedbackDeadline = missionEndDate + 4
 *
 * [챌린지1] 기필코 경험정리 챌린지 21기 (challengeId: 1, colorIndex: 0)
 *   서면 1회차:  bar 3/28~4/7  (mission 3/28~4/3, feedback 4/5~4/7)
 *   서면 2회차:  bar 4/8~4/18  (mission 4/8~4/14, feedback 4/16~4/18)
 *   └ gap 4/19~4/21 (3일)
 *   라이브 멘토오픈: 4/22 / 멘티신청: 4/23~4/24
 *   └ gap 4/25~4/27 (3일)
 *   라이브 기간:     4/28~4/30
 *   └ gap 5/1~5/3 (3일)
 *   서면 3회차:  bar 5/4~5/14 (mission 5/4~5/10, feedback 5/12~5/14)
 *
 * [챌린지2] 커리어 설계 챌린지 5기 (challengeId: 2, colorIndex: 1)
 *   서면 1회차:  bar 4/7~4/17 (mission 4/7~4/13, feedback 4/15~4/17)
 *   └ gap 4/18~4/20 (3일)
 *   라이브 멘토오픈: 4/21 / 멘티신청: 4/22~4/23
 *   └ gap 4/24~4/26 (3일)
 *   라이브 기간:     4/27~4/29
 *   └ gap 4/30~5/2 (3일)
 *   서면 2회차:  bar 5/3~5/13 (mission 5/3~5/9,  feedback 5/11~5/13)
 */
export const WRITTEN_FEEDBACK_MOCK_DATA: PeriodBarData[] = [
  // ── Challenge 1: 기필코 경험정리 챌린지 21기 ──────────────────────────────
  {
    barType: 'written-feedback',
    challengeId: 1,
    missionId: 1001,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 1,
    startDate: '2026-03-28',
    endDate: '2026-04-03',
    feedbackStartDate: '2026-04-05',
    feedbackDeadline: '2026-04-07',
    submittedCount: 10,
    notSubmittedCount: 2,
    waitingCount: 0,
    inProgressCount: 2,
    completedCount: 8,
    colorIndex: 0,
  },
  {
    barType: 'written-feedback',
    challengeId: 1,
    missionId: 1002,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 2,
    startDate: '2026-04-08',
    endDate: '2026-04-14',
    feedbackStartDate: '2026-04-16',
    feedbackDeadline: '2026-04-18',
    submittedCount: 11,
    notSubmittedCount: 1,
    waitingCount: 3,
    inProgressCount: 4,
    completedCount: 4,
    colorIndex: 0,
  },
  {
    barType: 'written-feedback',
    challengeId: 1,
    missionId: 1003,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 3,
    startDate: '2026-05-04',
    endDate: '2026-05-10',
    feedbackStartDate: '2026-05-12',
    feedbackDeadline: '2026-05-14',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    colorIndex: 0,
  },

  // ── Challenge 2: 커리어 설계 챌린지 5기 ────────────────────────────────────
  {
    barType: 'written-feedback',
    challengeId: 2,
    missionId: 2001,
    challengeTitle: '커리어 설계 챌린지 5기',
    th: 1,
    startDate: '2026-04-07',
    endDate: '2026-04-13',
    feedbackStartDate: '2026-04-15',
    feedbackDeadline: '2026-04-17',
    submittedCount: 7,
    notSubmittedCount: 1,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 7,
    colorIndex: 1,
  },
  {
    barType: 'written-feedback',
    challengeId: 2,
    missionId: 2002,
    challengeTitle: '커리어 설계 챌린지 5기',
    th: 2,
    startDate: '2026-05-03',
    endDate: '2026-05-09',
    feedbackStartDate: '2026-05-11',
    feedbackDeadline: '2026-05-13',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    colorIndex: 1,
  },
];

/** 챌린지 필터 태그용 목데이터 (라이브 피드백 mock과 challengeId 일치). */
export const MOCK_CHALLENGE_FILTER_ITEMS = [
  { challengeId: 1, title: '기필코 경험정리 챌린지 21기', colorIndex: 0 },
  { challengeId: 2, title: '커리어 설계 챌린지 5기', colorIndex: 1 },
];
