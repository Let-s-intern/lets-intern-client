import type { PeriodBarData } from '../types';

/**
 * 라이브 피드백 목데이터 (1:1 세션).
 * API 연동 시 useLiveFeedbackData 훅의 반환값만 교체하면 됩니다.
 *
 * - barType: 'live-feedback-period' — 상단 기간 바 (캘린더 상단)
 * - barType: 'live-feedback'        — 하단 시간 그리드 개별 세션
 * - barType: 'live-feedback-mentor-open' — 멘토 일정 오픈기간 (캘린더 상단)
 * - barType: 'live-feedback-mentee-open' — 멘티 신청기간 (멘토에게는 비표시)
 * - missionId 음수: 서면 피드백 ID와 충돌 방지
 *
 * 일정 구성 (오늘=2026-05-03 기준):
 *   [챌린지1] 기필코 경험정리 챌린지 21기
 *     - 멘토 오픈기간 4/24~25 (완료) → 멘티 신청 4/26~28 → 라이브 기간 5/4~6
 *     - 5/4 월: 4명 (오전 3 + 오후 1)
 *     - 5/5 화: 5명 (오전 + 오후, back-to-back 포함)  ※ 4회차 서면(5/5~7)과 겹치는 날
 *     - 5/6 수: 4명 (오전)
 *   [챌린지2] 커리어 설계 챌린지 5기
 *     - 멘토 오픈기간 4/27~28 (완료) → 멘티 신청 4/29~5/1 → 라이브 기간 5/6~8
 *     - 5/6 수: 3명 (오후)  ※ 4회차 서면(5/6~8)과 정확히 겹침 → 같은 챌린지 위아래 인접 케이스
 *     - 5/7 목: 4명 (오전 + 오후)
 *     - 5/8 금: 2명 (오후)
 */
export const LIVE_FEEDBACK_MOCK_DATA: PeriodBarData[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // [챌린지1] 기필코 경험정리 챌린지 21기
  // ═══════════════════════════════════════════════════════════════════════════

  // 멘토 일정 오픈 (4/24~25, 2일) — 완료
  {
    barType: 'live-feedback-mentor-open',
    challengeId: 1,
    missionId: -10,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 1,
    startDate: '2026-04-24',
    endDate: '2026-04-25',
    feedbackStartDate: '2026-04-24',
    feedbackDeadline: '2026-04-25',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 1, // 멘토 슬롯 등록 완료
  },

  // 멘티 신청 기간 (4/26~28, 3일) — 완료 (멘토 캘린더에서는 비표시)
  {
    barType: 'live-feedback-mentee-open',
    challengeId: 1,
    missionId: -11,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 1,
    startDate: '2026-04-26',
    endDate: '2026-04-28',
    feedbackStartDate: '2026-04-26',
    feedbackDeadline: '2026-04-28',
    submittedCount: 13,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 13,
  },

  // 라이브 피드백 기간 (5/4~6, 3일) — 진행 예정
  {
    barType: 'live-feedback-period',
    challengeId: 1,
    missionId: -1,
    challengeTitle: '기필코 경험정리 챌린지 21기',
    th: 1,
    startDate: '2026-05-04',
    endDate: '2026-05-06',
    feedbackStartDate: '2026-05-04',
    feedbackDeadline: '2026-05-06',
    submittedCount: 13, // 신청 멘티 13명
    notSubmittedCount: 0,
    waitingCount: 13,
    inProgressCount: 0,
    completedCount: 0,
  },

  // 5/4 월: 4명 (10:00, 11:00, 14:00, 15:00)
  {
    barType: 'live-feedback', challengeId: 1, missionId: -101,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-04', endDate: '2026-05-04',
    feedbackStartDate: '2026-05-04', feedbackDeadline: '2026-05-04',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 101, menteeName: '이지수', startTime: '10:00', endTime: '10:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -102,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-04', endDate: '2026-05-04',
    feedbackStartDate: '2026-05-04', feedbackDeadline: '2026-05-04',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 102, menteeName: '김민준', startTime: '11:00', endTime: '11:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -103,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-04', endDate: '2026-05-04',
    feedbackStartDate: '2026-05-04', feedbackDeadline: '2026-05-04',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 103, menteeName: '박서연', startTime: '14:00', endTime: '14:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -104,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-04', endDate: '2026-05-04',
    feedbackStartDate: '2026-05-04', feedbackDeadline: '2026-05-04',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 104, menteeName: '정하늘', startTime: '15:00', endTime: '15:30' },
  },

  // 5/5 화: 5명 (10:00 / 10:30 back-to-back / 14:00 / 15:00 / 16:00)
  {
    barType: 'live-feedback', challengeId: 1, missionId: -201,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-05', endDate: '2026-05-05',
    feedbackStartDate: '2026-05-05', feedbackDeadline: '2026-05-05',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 201, menteeName: '최지훈', startTime: '10:00', endTime: '10:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -202,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-05', endDate: '2026-05-05',
    feedbackStartDate: '2026-05-05', feedbackDeadline: '2026-05-05',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 202, menteeName: '강민서', startTime: '10:30', endTime: '11:00' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -203,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-05', endDate: '2026-05-05',
    feedbackStartDate: '2026-05-05', feedbackDeadline: '2026-05-05',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 203, menteeName: '윤서준', startTime: '14:00', endTime: '14:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -204,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-05', endDate: '2026-05-05',
    feedbackStartDate: '2026-05-05', feedbackDeadline: '2026-05-05',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 204, menteeName: '임채원', startTime: '15:00', endTime: '15:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -205,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-05', endDate: '2026-05-05',
    feedbackStartDate: '2026-05-05', feedbackDeadline: '2026-05-05',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 205, menteeName: '송지아', startTime: '16:00', endTime: '16:30' },
  },

  // 5/6 수: 4명 (09:00 / 10:00 / 11:00 / 12:00)
  {
    barType: 'live-feedback', challengeId: 1, missionId: -301,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-06', endDate: '2026-05-06',
    feedbackStartDate: '2026-05-06', feedbackDeadline: '2026-05-06',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 301, menteeName: '한도윤', startTime: '09:00', endTime: '09:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -302,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-06', endDate: '2026-05-06',
    feedbackStartDate: '2026-05-06', feedbackDeadline: '2026-05-06',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 302, menteeName: '오지민', startTime: '10:00', endTime: '10:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -303,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-06', endDate: '2026-05-06',
    feedbackStartDate: '2026-05-06', feedbackDeadline: '2026-05-06',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 303, menteeName: '노은서', startTime: '11:00', endTime: '11:30' },
  },
  {
    barType: 'live-feedback', challengeId: 1, missionId: -304,
    challengeTitle: '기필코 경험정리 챌린지 21기', th: 1,
    startDate: '2026-05-06', endDate: '2026-05-06',
    feedbackStartDate: '2026-05-06', feedbackDeadline: '2026-05-06',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 304, menteeName: '백준혁', startTime: '12:00', endTime: '12:30' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // [챌린지2] 커리어 설계 챌린지 5기
  // ═══════════════════════════════════════════════════════════════════════════

  // 멘토 일정 오픈 (4/27~28, 2일) — 완료
  {
    barType: 'live-feedback-mentor-open',
    challengeId: 2,
    missionId: -20,
    challengeTitle: '커리어 설계 챌린지 5기',
    th: 1,
    startDate: '2026-04-27',
    endDate: '2026-04-28',
    feedbackStartDate: '2026-04-27',
    feedbackDeadline: '2026-04-28',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 1,
  },

  // 멘티 신청 기간 (4/29~5/1, 3일) — 완료 (멘토에게는 비표시)
  {
    barType: 'live-feedback-mentee-open',
    challengeId: 2,
    missionId: -21,
    challengeTitle: '커리어 설계 챌린지 5기',
    th: 1,
    startDate: '2026-04-29',
    endDate: '2026-05-01',
    feedbackStartDate: '2026-04-29',
    feedbackDeadline: '2026-05-01',
    submittedCount: 9,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 9,
  },

  // 라이브 피드백 기간 (5/6~8, 3일) — 진행 예정
  // ※ 4회차 서면 피드백(5/6~8)과 정확히 겹침 → 같은 챌린지 위아래 인접 케이스
  {
    barType: 'live-feedback-period',
    challengeId: 2,
    missionId: -2,
    challengeTitle: '커리어 설계 챌린지 5기',
    th: 1,
    startDate: '2026-05-06',
    endDate: '2026-05-08',
    feedbackStartDate: '2026-05-06',
    feedbackDeadline: '2026-05-08',
    submittedCount: 9,
    notSubmittedCount: 0,
    waitingCount: 9,
    inProgressCount: 0,
    completedCount: 0,
  },

  // 5/6 수: 3명 (14:00 / 15:00 / 16:00)
  {
    barType: 'live-feedback', challengeId: 2, missionId: -501,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-06', endDate: '2026-05-06',
    feedbackStartDate: '2026-05-06', feedbackDeadline: '2026-05-06',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 501, menteeName: '문수아', startTime: '14:00', endTime: '14:30' },
  },
  {
    barType: 'live-feedback', challengeId: 2, missionId: -502,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-06', endDate: '2026-05-06',
    feedbackStartDate: '2026-05-06', feedbackDeadline: '2026-05-06',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 502, menteeName: '장우현', startTime: '15:00', endTime: '15:30' },
  },
  {
    barType: 'live-feedback', challengeId: 2, missionId: -503,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-06', endDate: '2026-05-06',
    feedbackStartDate: '2026-05-06', feedbackDeadline: '2026-05-06',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 503, menteeName: '서지안', startTime: '16:00', endTime: '16:30' },
  },

  // 5/7 목: 4명 (10:00 / 11:00 / 14:00 / 15:00)
  {
    barType: 'live-feedback', challengeId: 2, missionId: -601,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-07', endDate: '2026-05-07',
    feedbackStartDate: '2026-05-07', feedbackDeadline: '2026-05-07',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 601, menteeName: '조예린', startTime: '10:00', endTime: '10:30' },
  },
  {
    barType: 'live-feedback', challengeId: 2, missionId: -602,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-07', endDate: '2026-05-07',
    feedbackStartDate: '2026-05-07', feedbackDeadline: '2026-05-07',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 602, menteeName: '유채린', startTime: '11:00', endTime: '11:30' },
  },
  {
    barType: 'live-feedback', challengeId: 2, missionId: -603,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-07', endDate: '2026-05-07',
    feedbackStartDate: '2026-05-07', feedbackDeadline: '2026-05-07',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 603, menteeName: '황도경', startTime: '14:00', endTime: '14:30' },
  },
  {
    barType: 'live-feedback', challengeId: 2, missionId: -604,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-07', endDate: '2026-05-07',
    feedbackStartDate: '2026-05-07', feedbackDeadline: '2026-05-07',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 604, menteeName: '권태양', startTime: '15:00', endTime: '15:30' },
  },

  // 5/8 금: 2명 (14:00 / 15:00)
  {
    barType: 'live-feedback', challengeId: 2, missionId: -701,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-08', endDate: '2026-05-08',
    feedbackStartDate: '2026-05-08', feedbackDeadline: '2026-05-08',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 701, menteeName: '류다연', startTime: '14:00', endTime: '14:30' },
  },
  {
    barType: 'live-feedback', challengeId: 2, missionId: -702,
    challengeTitle: '커리어 설계 챌린지 5기', th: 1,
    startDate: '2026-05-08', endDate: '2026-05-08',
    feedbackStartDate: '2026-05-08', feedbackDeadline: '2026-05-08',
    submittedCount: 0, notSubmittedCount: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0,
    liveFeedback: { id: 702, menteeName: '백지윤', startTime: '15:00', endTime: '15:30' },
  },
];
