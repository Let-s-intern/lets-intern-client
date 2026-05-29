import type {
  FeedbackAdminVo,
  FeedbackDetailAdminVo,
  FeedbackHistoryItem,
  FeedbackSlotVo,
} from '@/api/feedback/feedbackSchema';

/**
 * LIVE 피드백 목 시드 데이터.
 *
 * 이미지 스펙과 유사하게 구성:
 * - 멘토 "쥬디"(mentorId 101)의 멘토링 30분 슬롯 다수 (17:00-17:30 등)
 * - 프로그램: "면접 준비 7일 끝장 챌린지 2기"(challengeId 2),
 *   "자기소개서 1주 완성 챌린지 27기"(challengeId 27)
 * - 멘토/멘티/신청시각 세트
 *
 * 날짜는 2026-06-01(월) ~ 2026-06-05(금) 주를 기준으로 한다.
 */

/** 멘토 메타 (핸들러 필터·슬롯 생성용) */
export interface SeedMentor {
  mentorId: number;
  name: string;
  email: string;
}

export const seedMentors: SeedMentor[] = [
  { mentorId: 101, name: '쥬디', email: 'judy@letscareer.co.kr' },
  { mentorId: 102, name: '제이슨', email: 'jason@letscareer.co.kr' },
];

/** 챌린지(프로그램) 메타 */
export interface SeedChallenge {
  challengeId: number;
  title: string;
}

export const seedChallenges: SeedChallenge[] = [
  { challengeId: 2, title: '면접 준비 7일 끝장 챌린지 2기' },
  { challengeId: 27, title: '자기소개서 1주 완성 챌린지 27기' },
];

/** 예약 행 + 필터링에 필요한 식별자(challengeId/mentorId/menteeId)를 함께 보관 */
export interface SeedFeedback {
  vo: FeedbackAdminVo;
  challengeId: number;
  mentorId: number;
  menteeId: number;
  detail: FeedbackDetailAdminVo;
}

export const seedFeedbacks: SeedFeedback[] = [
  {
    challengeId: 2,
    mentorId: 101,
    menteeId: 201,
    vo: {
      feedbackId: 1,
      programTitle: '면접 준비 7일 끝장 챌린지 2기',
      mentorName: '쥬디',
      menteeName: '홍길동',
      startDate: '2026-06-01T17:00:00',
      endDate: '2026-06-01T17:30:00',
      createDate: '2026-05-20T10:12:00',
      mentorStatus: 'PENDING',
      menteeStatus: 'PENDING',
      status: 'RESERVED',
    },
    detail: {
      feedbackId: 1,
      programTitle: '면접 준비 7일 끝장 챌린지 2기',
      mentorName: '쥬디',
      mentorEmail: 'judy@letscareer.co.kr',
      menteeName: '홍길동',
      menteeEmail: 'hong@example.com',
      menteePhoneNum: '01012340001',
      startDate: '2026-06-01T17:00:00',
      endDate: '2026-06-01T17:30:00',
      createDate: '2026-05-20T10:12:00',
      preQuestion: '면접에서 자기소개를 어떻게 시작하면 좋을까요?',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      mentorStatus: 'PENDING',
      menteeStatus: 'PENDING',
    },
  },
  {
    challengeId: 2,
    mentorId: 101,
    menteeId: 202,
    vo: {
      feedbackId: 2,
      programTitle: '면접 준비 7일 끝장 챌린지 2기',
      mentorName: '쥬디',
      menteeName: '김민지',
      startDate: '2026-06-01T18:00:00',
      endDate: '2026-06-01T18:30:00',
      createDate: '2026-05-21T14:03:00',
      mentorStatus: 'PRESENT',
      menteeStatus: 'PRESENT',
      status: 'COMPLETED',
    },
    detail: {
      feedbackId: 2,
      programTitle: '면접 준비 7일 끝장 챌린지 2기',
      mentorName: '쥬디',
      mentorEmail: 'judy@letscareer.co.kr',
      menteeName: '김민지',
      menteeEmail: 'minji@example.com',
      menteePhoneNum: '01012340002',
      startDate: '2026-06-01T18:00:00',
      endDate: '2026-06-01T18:30:00',
      createDate: '2026-05-21T14:03:00',
      preQuestion: '압박 면접 대비 방법이 궁금합니다.',
      meetingUrl: 'https://meet.google.com/klm-nopq-rst',
      mentorStatus: 'PRESENT',
      menteeStatus: 'PRESENT',
    },
  },
  {
    challengeId: 27,
    mentorId: 101,
    menteeId: 203,
    vo: {
      feedbackId: 3,
      programTitle: '자기소개서 1주 완성 챌린지 27기',
      mentorName: '쥬디',
      menteeName: '이서준',
      startDate: '2026-06-03T17:00:00',
      endDate: '2026-06-03T17:30:00',
      createDate: '2026-05-22T09:30:00',
      mentorStatus: 'PENDING',
      menteeStatus: 'PENDING',
      status: 'RESERVED',
    },
    detail: {
      feedbackId: 3,
      programTitle: '자기소개서 1주 완성 챌린지 27기',
      mentorName: '쥬디',
      mentorEmail: 'judy@letscareer.co.kr',
      menteeName: '이서준',
      menteeEmail: 'seojun@example.com',
      menteePhoneNum: '01012340003',
      startDate: '2026-06-03T17:00:00',
      endDate: '2026-06-03T17:30:00',
      createDate: '2026-05-22T09:30:00',
      preQuestion: '지원 동기 문항을 차별화하는 방법이 궁금합니다.',
      meetingUrl: 'https://meet.google.com/uvw-xyz0-123',
      mentorStatus: 'PENDING',
      menteeStatus: 'PENDING',
    },
  },
  {
    challengeId: 27,
    mentorId: 102,
    menteeId: 204,
    vo: {
      feedbackId: 4,
      programTitle: '자기소개서 1주 완성 챌린지 27기',
      mentorName: '제이슨',
      menteeName: '박지우',
      startDate: '2026-06-04T19:00:00',
      endDate: '2026-06-04T19:30:00',
      createDate: '2026-05-23T16:45:00',
      mentorStatus: 'ABSENT',
      menteeStatus: 'PRESENT',
      status: 'CANCELED',
    },
    detail: {
      feedbackId: 4,
      programTitle: '자기소개서 1주 완성 챌린지 27기',
      mentorName: '제이슨',
      mentorEmail: 'jason@letscareer.co.kr',
      menteeName: '박지우',
      menteeEmail: 'jiwoo@example.com',
      menteePhoneNum: '01012340004',
      startDate: '2026-06-04T19:00:00',
      endDate: '2026-06-04T19:30:00',
      createDate: '2026-05-23T16:45:00',
      preQuestion: null,
      meetingUrl: null,
      mentorStatus: 'ABSENT',
      menteeStatus: 'PRESENT',
    },
  },
];

/**
 * 예약별 변경(이동) 내역 (feedbackId 기준).
 * 멘토/멘티가 잡았던 예약을 다른 날(시간)로 옮긴 기록. 행 우측 "예약 변경 내역" 펼침에서 조회. 최신순.
 */
export const seedHistoryByFeedbackId: Record<number, FeedbackHistoryItem[]> = {
  1: [
    {
      id: 11,
      changedAt: '2026-05-28T09:15:00',
      beforeStartDate: '2026-05-29T17:00:00',
      beforeEndDate: '2026-05-29T17:30:00',
    },
    {
      id: 10,
      changedAt: '2026-05-25T14:02:00',
      beforeStartDate: '2026-05-27T16:00:00',
      beforeEndDate: '2026-05-27T16:30:00',
    },
  ],
  2: [
    {
      id: 21,
      changedAt: '2026-05-26T11:40:00',
      beforeStartDate: '2026-05-30T18:00:00',
      beforeEndDate: '2026-05-30T18:30:00',
    },
  ],
  3: [],
  4: [
    {
      id: 41,
      changedAt: '2026-05-30T16:20:00',
      beforeStartDate: '2026-06-02T19:00:00',
      beforeEndDate: '2026-06-02T19:30:00',
    },
  ],
};

/**
 * 멘토별 주간 슬롯.
 * 예약된(RESERVED) 슬롯은 위 예약과 시간대가 일치한다.
 */
export const seedSlotsByMentorId: Record<number, FeedbackSlotVo[]> = {
  101: [
    {
      feedbackSlotId: 1001,
      startDate: '2026-06-01T17:00:00',
      endDate: '2026-06-01T17:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 1002,
      startDate: '2026-06-01T18:00:00',
      endDate: '2026-06-01T18:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 1003,
      startDate: '2026-06-02T17:00:00',
      endDate: '2026-06-02T17:30:00',
      status: 'OPEN',
    },
    {
      feedbackSlotId: 1004,
      startDate: '2026-06-03T17:00:00',
      endDate: '2026-06-03T17:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 1005,
      startDate: '2026-06-03T17:30:00',
      endDate: '2026-06-03T18:00:00',
      status: 'OPEN',
    },
  ],
  102: [
    {
      feedbackSlotId: 2001,
      startDate: '2026-06-04T19:00:00',
      endDate: '2026-06-04T19:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 2002,
      startDate: '2026-06-05T10:00:00',
      endDate: '2026-06-05T10:30:00',
      status: 'OPEN',
    },
  ],
};
