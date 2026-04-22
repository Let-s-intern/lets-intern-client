import type { MentorFeedbackManagement } from '@/api/challenge/challengeSchema';

type Challenge = MentorFeedbackManagement['challengeList'][number];

/**
 * 피드백 현황 페이지용 mock 서면 피드백 챌린지.
 * useLiveFeedbackList의 challengeId와 일치시켜 통합 탭에서 동일 카드로 병합됨.
 */
export const WRITTEN_CHALLENGE_MOCK: Challenge[] = [
  {
    challengeId: 1,
    title: '기필코 경험정리 챌린지 21기',
    shortDesc: '3주간 경험정리 미션과 멘토 피드백으로 완성하는 자소서',
    startDate: '2026-04-14',
    endDate: '2026-05-04',
    feedbackMissions: [
      {
        missionId: 1001,
        missionTitle: '1회차 — 경험 리스트 작성',
        th: 1,
        submittedCount: 10,
        notSubmittedCount: 2,
        feedbackStatusCounts: [
          { feedbackStatus: 'COMPLETED', count: 8 },
          { feedbackStatus: 'IN_PROGRESS', count: 2 },
        ],
      },
      {
        missionId: 1002,
        missionTitle: '2회차 — 경험 구조화',
        th: 2,
        submittedCount: 11,
        notSubmittedCount: 1,
        feedbackStatusCounts: [
          { feedbackStatus: 'WAITING', count: 7 },
          { feedbackStatus: 'IN_PROGRESS', count: 4 },
        ],
      },
      {
        missionId: 1003,
        missionTitle: '3회차 — 자소서 초안 작성',
        th: 3,
        submittedCount: 0,
        notSubmittedCount: 0,
        feedbackStatusCounts: [],
      },
    ],
  },
  {
    challengeId: 2,
    title: '커리어 설계 챌린지 5기',
    shortDesc: '자신의 커리어 로드맵을 그려보는 2주 챌린지',
    startDate: '2026-04-15',
    endDate: '2026-04-28',
    feedbackMissions: [
      {
        missionId: 2001,
        missionTitle: '1회차 — 직무 탐색',
        th: 1,
        submittedCount: 7,
        notSubmittedCount: 1,
        feedbackStatusCounts: [
          { feedbackStatus: 'COMPLETED', count: 2 },
          { feedbackStatus: 'IN_PROGRESS', count: 3 },
          { feedbackStatus: 'WAITING', count: 2 },
        ],
      },
      {
        missionId: 2002,
        missionTitle: '2회차 — 커리어 로드맵 작성',
        th: 2,
        submittedCount: 0,
        notSubmittedCount: 0,
        feedbackStatusCounts: [],
      },
    ],
  },
];

/**
 * missionId → 서면 피드백 기간 {start, end} (writtenFeedbackMock과 동기화).
 * 통합 탭에서는 end를 날짜 그룹핑 키로, start~end를 MissionRow 기간 표시에 사용.
 */
export const WRITTEN_CHALLENGE_MISSION_FEEDBACK_RANGES: Record<
  number,
  { start: string; end: string }
> = {
  1001: { start: '2026-04-05', end: '2026-04-07' },
  1002: { start: '2026-04-16', end: '2026-04-18' },
  1003: { start: '2026-05-12', end: '2026-05-14' },
  2001: { start: '2026-04-15', end: '2026-04-17' },
  2002: { start: '2026-05-11', end: '2026-05-13' },
};
