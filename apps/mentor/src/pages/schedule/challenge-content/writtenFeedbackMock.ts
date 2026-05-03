import type { PeriodBarData } from '../types';

/**
 * 서면 피드백 목데이터 — 챌린지당 1회차 (단일 서면 + 단일 라이브 흐름).
 *
 * 서면 1회차는 3단계 바로 분할되며 멘토 캘린더에는 `written-feedback` 만 노출:
 *   1) written-mission-submit : 유저 제출기간   (멘토 대기, 캘린더 비표시)
 *   2) written-review          : 운영진 검수기간 (멘토 대기, 캘린더 비표시)
 *   3) written-feedback        : 피드백 제출기간 (멘토 액션, 캘린더 표시)
 *
 * 일정 규칙:
 *  - 한 챌린지 안에서 서면 끝난 뒤 약 1주 후 라이브 피드백이 진행됨 (겹치지 않음).
 *  - 챌린지마다 서면 1개 + 라이브 1개로 최소 구성.
 *
 * 오늘(2026-05-03 일) 기준:
 *  - 모든 서면은 직전 완료, 라이브는 다음 주(5/4~5/8)에 진행.
 */

function buildRoundBars(input: {
  challengeId: number;
  challengeTitle: string;
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
  // ── Challenge 1: 기필코 경험정리 챌린지 21기 ──
  // 서면 4/27~29(월~수) → 라이브 5/4~6(월~수, 약 1주 후)
  ...buildRoundBars({
    challengeId: 1,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 1,
    missionIdBase: 1001,
    missionStart: '2026-04-20',
    missionEnd: '2026-04-25',
    reviewDate: '2026-04-26',
    feedbackStart: '2026-04-27',
    feedbackEnd: '2026-04-29',
    submittedCount: 13,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 2,
    completedCount: 11,
  }),

  // ── Challenge 2: 커리어 설계 챌린지 5기 ──
  // 서면 4/29~5/1(수~금) → 라이브 5/6~8(수~금, 약 1주 후)
  ...buildRoundBars({
    challengeId: 2,
    challengeTitle: '커리어 설계 챌린지 5기',
    th: 1,
    missionIdBase: 2001,
    missionStart: '2026-04-22',
    missionEnd: '2026-04-27',
    reviewDate: '2026-04-28',
    feedbackStart: '2026-04-29',
    feedbackEnd: '2026-05-01',
    submittedCount: 9,
    notSubmittedCount: 0,
    waitingCount: 1,
    inProgressCount: 3,
    completedCount: 5,
  }),
];

export const MOCK_CHALLENGE_FILTER_ITEMS = [
  { challengeId: 1, title: '기필코 경험정리 챌린지 21기' },
  { challengeId: 2, title: '커리어 설계 챌린지 5기' },
];
