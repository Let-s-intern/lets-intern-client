import type { PeriodBarData } from '../types';

/**
 * 서면 피드백 목데이터 — 각 회차를 3개 단계 바로 분할 (멘토 오픈기간 패턴).
 *   1) written-mission-submit : 유저 제출기간   (멘토 대기)
 *   2) written-review          : 운영진 검수기간 (멘토 대기)
 *   3) written-feedback        : 피드백 제출기간 (멘토 액션)
 */

function buildRoundBars(input: {
  challengeId: number;
  challengeTitle: string;
  colorIndex: number;
  th: number;
  missionIdBase: number;
  missionStart: string;
  missionEnd: string;
  reviewDate: string;
  feedbackStart: string;
  feedbackEnd: string;
  submittedCount: number;
  notSubmittedCount: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
}): PeriodBarData[] {
  const common = {
    challengeId: input.challengeId,
    challengeTitle: input.challengeTitle,
    colorIndex: input.colorIndex,
    th: input.th,
    submittedCount: input.submittedCount,
    notSubmittedCount: input.notSubmittedCount,
    waitingCount: input.waitingCount,
    inProgressCount: input.inProgressCount,
    completedCount: input.completedCount,
  };
  return [
    {
      ...common,
      barType: 'written-mission-submit',
      missionId: input.missionIdBase,
      startDate: input.missionStart,
      endDate: input.missionEnd,
      feedbackStartDate: input.missionStart,
      feedbackDeadline: input.missionEnd,
    },
    {
      ...common,
      barType: 'written-review',
      missionId: input.missionIdBase + 1,
      startDate: input.reviewDate,
      endDate: input.reviewDate,
      feedbackStartDate: input.reviewDate,
      feedbackDeadline: input.reviewDate,
    },
    {
      ...common,
      barType: 'written-feedback',
      missionId: input.missionIdBase + 2,
      startDate: input.feedbackStart,
      endDate: input.feedbackEnd,
      feedbackStartDate: input.feedbackStart,
      feedbackDeadline: input.feedbackEnd,
    },
  ];
}

export const WRITTEN_FEEDBACK_MOCK_DATA: PeriodBarData[] = [
  // ── Challenge 1 ───────────────────────────────────────────────
  ...buildRoundBars({
    challengeId: 1,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    colorIndex: 0,
    th: 1,
    missionIdBase: 1001,
    missionStart: '2026-03-28',
    missionEnd: '2026-04-03',
    reviewDate: '2026-04-04',
    feedbackStart: '2026-04-05',
    feedbackEnd: '2026-04-07',
    submittedCount: 10,
    notSubmittedCount: 2,
    waitingCount: 0,
    inProgressCount: 2,
    completedCount: 8,
  }),
  ...buildRoundBars({
    challengeId: 1,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    colorIndex: 0,
    th: 2,
    missionIdBase: 1011,
    missionStart: '2026-04-08',
    missionEnd: '2026-04-14',
    reviewDate: '2026-04-15',
    feedbackStart: '2026-04-16',
    feedbackEnd: '2026-04-18',
    submittedCount: 11,
    notSubmittedCount: 1,
    waitingCount: 3,
    inProgressCount: 4,
    completedCount: 4,
  }),
  ...buildRoundBars({
    challengeId: 1,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    colorIndex: 0,
    th: 3,
    missionIdBase: 1021,
    missionStart: '2026-05-04',
    missionEnd: '2026-05-10',
    reviewDate: '2026-05-11',
    feedbackStart: '2026-05-12',
    feedbackEnd: '2026-05-14',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
  }),

  // ── Challenge 2 ───────────────────────────────────────────────
  ...buildRoundBars({
    challengeId: 2,
    challengeTitle: '커리어 설계 챌린지 5기',
    colorIndex: 1,
    th: 1,
    missionIdBase: 2001,
    missionStart: '2026-04-07',
    missionEnd: '2026-04-13',
    reviewDate: '2026-04-14',
    feedbackStart: '2026-04-15',
    feedbackEnd: '2026-04-17',
    submittedCount: 7,
    notSubmittedCount: 1,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 7,
  }),
  ...buildRoundBars({
    challengeId: 2,
    challengeTitle: '커리어 설계 챌린지 5기',
    colorIndex: 1,
    th: 2,
    missionIdBase: 2011,
    missionStart: '2026-05-03',
    missionEnd: '2026-05-09',
    reviewDate: '2026-05-10',
    feedbackStart: '2026-05-11',
    feedbackEnd: '2026-05-13',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
  }),
];

export const MOCK_CHALLENGE_FILTER_ITEMS = [
  { challengeId: 1, title: '기필코 경험정리 챌린지 21기', colorIndex: 0 },
  { challengeId: 2, title: '커리어 설계 챌린지 5기', colorIndex: 1 },
];
