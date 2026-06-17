import type {
  FeedbackAdminVo,
  FeedbackAttendanceStatus,
  FeedbackDetailAdminVo,
  FeedbackHistoryItem,
  FeedbackSlotVo,
  FeedbackStatus,
} from '@/api/feedback/feedbackSchema';

/**
 * LIVE 피드백 목 시드 데이터.
 *
 * 여러 멘토·챌린지·멘티에 걸쳐 다양한 상태(RESERVED/COMPLETED/CANCELED)·시간대의
 * 예약을 2026-05-25(월) ~ 2026-06-07(일) 두 주에 분포시켜, 캘린더 기본 주와
 * 다음 주 모두에서 데이터가 보이도록 구성한다.
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
  { mentorId: 103, name: '에이미', email: 'amy@letscareer.co.kr' },
  { mentorId: 104, name: '케빈', email: 'kevin@letscareer.co.kr' },
];

/** 챌린지(프로그램) 메타 */
export interface SeedChallenge {
  challengeId: number;
  title: string;
}

export const seedChallenges: SeedChallenge[] = [
  { challengeId: 2, title: '면접 준비 7일 끝장 챌린지 2기' },
  { challengeId: 27, title: '자기소개서 1주 완성 챌린지 27기' },
  { challengeId: 15, title: '포트폴리오 2주 완성 챌린지 15기' },
  { challengeId: 8, title: '이력서 완성 챌린지 8기' },
];

/** 예약 행 + 필터링에 필요한 식별자(challengeId/mentorId/menteeId)를 함께 보관 */
export interface SeedFeedback {
  vo: FeedbackAdminVo;
  challengeId: number;
  mentorId: number;
  menteeId: number;
  detail: FeedbackDetailAdminVo;
}

/** 컴팩트 스펙 → vo/detail 동시 생성 (필드 중복 제거) */
interface FeedbackSpec {
  feedbackId: number;
  challengeId: number;
  programTitle: string;
  mentorId: number;
  mentorName: string;
  mentorEmail: string;
  menteeId: number;
  menteeName: string;
  menteeEmail: string;
  menteePhoneNum: string;
  startDate: string;
  endDate: string;
  createDate: string;
  status: FeedbackStatus;
  mentorStatus: FeedbackAttendanceStatus;
  menteeStatus: FeedbackAttendanceStatus;
  preQuestion: string | null;
  meetingUrl: string | null;
}

function buildFeedback(s: FeedbackSpec): SeedFeedback {
  return {
    challengeId: s.challengeId,
    mentorId: s.mentorId,
    menteeId: s.menteeId,
    vo: {
      feedbackId: s.feedbackId,
      programTitle: s.programTitle,
      mentorId: s.mentorId,
      mentorName: s.mentorName,
      menteeName: s.menteeName,
      startDate: s.startDate,
      endDate: s.endDate,
      createDate: s.createDate,
      mentorStatus: s.mentorStatus,
      menteeStatus: s.menteeStatus,
      status: s.status,
    },
    detail: {
      feedbackId: s.feedbackId,
      programTitle: s.programTitle,
      mentorName: s.mentorName,
      mentorEmail: s.mentorEmail,
      menteeName: s.menteeName,
      menteeEmail: s.menteeEmail,
      menteePhoneNum: s.menteePhoneNum,
      startDate: s.startDate,
      endDate: s.endDate,
      createDate: s.createDate,
      preQuestion: s.preQuestion,
      meetingUrl: s.meetingUrl,
      mentorStatus: s.mentorStatus,
      menteeStatus: s.menteeStatus,
    },
  };
}

const MEET = (slug: string) => `https://meet.google.com/${slug}`;

export const seedFeedbacks: SeedFeedback[] = [
  buildFeedback({
    feedbackId: 1,
    challengeId: 2,
    programTitle: '면접 준비 7일 끝장 챌린지 2기',
    mentorId: 101,
    mentorName: '쥬디',
    mentorEmail: 'judy@letscareer.co.kr',
    menteeId: 201,
    menteeName: '홍길동',
    menteeEmail: 'hong@example.com',
    menteePhoneNum: '01012340001',
    startDate: '2026-06-01T17:00:00',
    endDate: '2026-06-01T17:30:00',
    createDate: '2026-05-20T10:12:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: '면접에서 자기소개를 어떻게 시작하면 좋을까요?',
    meetingUrl: MEET('abc-defg-hij'),
  }),
  buildFeedback({
    feedbackId: 2,
    challengeId: 2,
    programTitle: '면접 준비 7일 끝장 챌린지 2기',
    mentorId: 101,
    mentorName: '쥬디',
    mentorEmail: 'judy@letscareer.co.kr',
    menteeId: 202,
    menteeName: '김민지',
    menteeEmail: 'minji@example.com',
    menteePhoneNum: '01012340002',
    startDate: '2026-06-01T18:00:00',
    endDate: '2026-06-01T18:30:00',
    createDate: '2026-05-21T14:03:00',
    status: 'COMPLETED',
    mentorStatus: 'PRESENT',
    menteeStatus: 'PRESENT',
    preQuestion: '압박 면접 대비 방법이 궁금합니다.',
    meetingUrl: MEET('klm-nopq-rst'),
  }),
  buildFeedback({
    feedbackId: 3,
    challengeId: 27,
    programTitle: '자기소개서 1주 완성 챌린지 27기',
    mentorId: 101,
    mentorName: '쥬디',
    mentorEmail: 'judy@letscareer.co.kr',
    menteeId: 203,
    menteeName: '이서준',
    menteeEmail: 'seojun@example.com',
    menteePhoneNum: '01012340003',
    startDate: '2026-06-03T17:00:00',
    endDate: '2026-06-03T17:30:00',
    createDate: '2026-05-22T09:30:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: '지원 동기 문항을 차별화하는 방법이 궁금합니다.',
    meetingUrl: MEET('uvw-xyz0-123'),
  }),
  buildFeedback({
    feedbackId: 4,
    challengeId: 27,
    programTitle: '자기소개서 1주 완성 챌린지 27기',
    mentorId: 102,
    mentorName: '제이슨',
    mentorEmail: 'jason@letscareer.co.kr',
    menteeId: 204,
    menteeName: '박지우',
    menteeEmail: 'jiwoo@example.com',
    menteePhoneNum: '01012340004',
    startDate: '2026-06-04T19:00:00',
    endDate: '2026-06-04T19:30:00',
    createDate: '2026-05-23T16:45:00',
    status: 'CANCELED',
    mentorStatus: 'ABSENT',
    menteeStatus: 'PRESENT',
    preQuestion: null,
    meetingUrl: null,
  }),
  buildFeedback({
    feedbackId: 5,
    challengeId: 2,
    programTitle: '면접 준비 7일 끝장 챌린지 2기',
    mentorId: 102,
    mentorName: '제이슨',
    mentorEmail: 'jason@letscareer.co.kr',
    menteeId: 205,
    menteeName: '최수연',
    menteeEmail: 'sooyeon@example.com',
    menteePhoneNum: '01012340005',
    startDate: '2026-05-26T10:00:00',
    endDate: '2026-05-26T10:30:00',
    createDate: '2026-05-19T08:40:00',
    status: 'COMPLETED',
    mentorStatus: 'PRESENT',
    menteeStatus: 'PRESENT',
    preQuestion: '직무 면접에서 경험을 어떻게 어필할까요?',
    meetingUrl: MEET('aaa-bbbb-ccc'),
  }),
  buildFeedback({
    feedbackId: 6,
    challengeId: 15,
    programTitle: '포트폴리오 2주 완성 챌린지 15기',
    mentorId: 103,
    mentorName: '에이미',
    mentorEmail: 'amy@letscareer.co.kr',
    menteeId: 206,
    menteeName: '한지민',
    menteeEmail: 'jimin@example.com',
    menteePhoneNum: '01012340006',
    startDate: '2026-05-27T14:00:00',
    endDate: '2026-05-27T14:30:00',
    createDate: '2026-05-18T19:05:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: '포트폴리오 첫 페이지 구성이 고민입니다.',
    meetingUrl: MEET('ddd-eeee-fff'),
  }),
  buildFeedback({
    feedbackId: 7,
    challengeId: 15,
    programTitle: '포트폴리오 2주 완성 챌린지 15기',
    mentorId: 103,
    mentorName: '에이미',
    mentorEmail: 'amy@letscareer.co.kr',
    menteeId: 207,
    menteeName: '오태식',
    menteeEmail: 'taesik@example.com',
    menteePhoneNum: '01012340007',
    startDate: '2026-05-28T11:00:00',
    endDate: '2026-05-28T11:30:00',
    createDate: '2026-05-24T12:30:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: null,
    meetingUrl: MEET('ggg-hhhh-iii'),
  }),
  buildFeedback({
    feedbackId: 8,
    challengeId: 8,
    programTitle: '이력서 완성 챌린지 8기',
    mentorId: 104,
    mentorName: '케빈',
    mentorEmail: 'kevin@letscareer.co.kr',
    menteeId: 208,
    menteeName: '정유진',
    menteeEmail: 'yujin@example.com',
    menteePhoneNum: '01012340008',
    startDate: '2026-05-29T09:00:00',
    endDate: '2026-05-29T09:30:00',
    createDate: '2026-05-22T21:10:00',
    status: 'COMPLETED',
    mentorStatus: 'PRESENT',
    menteeStatus: 'ABSENT',
    preQuestion: '경력 기술서 분량 조절이 어렵습니다.',
    meetingUrl: MEET('jjj-kkkk-lll'),
  }),
  buildFeedback({
    feedbackId: 9,
    challengeId: 8,
    programTitle: '이력서 완성 챌린지 8기',
    mentorId: 104,
    mentorName: '케빈',
    mentorEmail: 'kevin@letscareer.co.kr',
    menteeId: 209,
    menteeName: '강도현',
    menteeEmail: 'dohyun@example.com',
    menteePhoneNum: '01012340009',
    startDate: '2026-05-29T20:00:00',
    endDate: '2026-05-29T20:30:00',
    createDate: '2026-05-25T17:55:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: '신입 이력서에 인턴 경험을 어디까지 적을지 고민입니다.',
    meetingUrl: MEET('mmm-nnnn-ooo'),
  }),
  buildFeedback({
    feedbackId: 10,
    challengeId: 2,
    programTitle: '면접 준비 7일 끝장 챌린지 2기',
    mentorId: 101,
    mentorName: '쥬디',
    mentorEmail: 'judy@letscareer.co.kr',
    menteeId: 210,
    menteeName: '신예은',
    menteeEmail: 'yeeun@example.com',
    menteePhoneNum: '01012340010',
    startDate: '2026-05-25T13:00:00',
    endDate: '2026-05-25T13:30:00',
    createDate: '2026-05-17T11:20:00',
    status: 'COMPLETED',
    mentorStatus: 'PRESENT',
    menteeStatus: 'PRESENT',
    preQuestion: '1분 자기소개 스크립트를 봐주실 수 있나요?',
    meetingUrl: MEET('ppp-qqqq-rrr'),
  }),
  buildFeedback({
    feedbackId: 11,
    challengeId: 27,
    programTitle: '자기소개서 1주 완성 챌린지 27기',
    mentorId: 102,
    mentorName: '제이슨',
    mentorEmail: 'jason@letscareer.co.kr',
    menteeId: 211,
    menteeName: '문가영',
    menteeEmail: 'gayoung@example.com',
    menteePhoneNum: '01012340011',
    startDate: '2026-06-02T16:00:00',
    endDate: '2026-06-02T16:30:00',
    createDate: '2026-05-26T13:15:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: '성장 과정 문항을 진부하지 않게 쓰는 법이 궁금합니다.',
    meetingUrl: MEET('sss-tttt-uuu'),
  }),
  buildFeedback({
    feedbackId: 12,
    challengeId: 15,
    programTitle: '포트폴리오 2주 완성 챌린지 15기',
    mentorId: 103,
    mentorName: '에이미',
    mentorEmail: 'amy@letscareer.co.kr',
    menteeId: 212,
    menteeName: '배준호',
    menteeEmail: 'junho@example.com',
    menteePhoneNum: '01012340012',
    startDate: '2026-06-05T15:00:00',
    endDate: '2026-06-05T15:30:00',
    createDate: '2026-05-27T10:05:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: null,
    meetingUrl: MEET('vvv-wwww-xxx'),
  }),
  buildFeedback({
    feedbackId: 13,
    challengeId: 8,
    programTitle: '이력서 완성 챌린지 8기',
    mentorId: 104,
    mentorName: '케빈',
    mentorEmail: 'kevin@letscareer.co.kr',
    menteeId: 213,
    menteeName: '윤서아',
    menteeEmail: 'seoa@example.com',
    menteePhoneNum: '01012340013',
    startDate: '2026-06-03T10:30:00',
    endDate: '2026-06-03T11:00:00',
    createDate: '2026-05-28T22:40:00',
    status: 'CANCELED',
    mentorStatus: 'ABSENT',
    menteeStatus: 'ABSENT',
    preQuestion: '직무 전환 이력서 방향이 맞는지 점검받고 싶습니다.',
    meetingUrl: null,
  }),
  buildFeedback({
    feedbackId: 14,
    challengeId: 27,
    programTitle: '자기소개서 1주 완성 챌린지 27기',
    mentorId: 101,
    mentorName: '쥬디',
    mentorEmail: 'judy@letscareer.co.kr',
    menteeId: 214,
    menteeName: '임도윤',
    menteeEmail: 'doyoon@example.com',
    menteePhoneNum: '01012340014',
    startDate: '2026-05-30T18:30:00',
    endDate: '2026-05-30T19:00:00',
    createDate: '2026-05-29T09:25:00',
    status: 'RESERVED',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    preQuestion: '지원 직무에 맞춘 강점 3가지를 어떻게 추릴까요?',
    meetingUrl: MEET('yyy-zzzz-000'),
  }),
];

/**
 * 예약별 변경(이동) 내역 (feedbackId 기준).
 * 예약을 다른 날로 옮긴 기록 — 옮기기 전(이전) 예약 일시를 보여준다. 최신순.
 * 일부 예약은 이동 내역이 없다(빈 배열 또는 미정의).
 */
export const seedHistoryByFeedbackId: Record<number, FeedbackHistoryItem[]> = {
  1: [
    {
      id: 1102,
      changedAt: '2026-05-28T09:15:00',
      beforeStartDate: '2026-05-29T17:00:00',
      beforeEndDate: '2026-05-29T17:30:00',
    },
    {
      id: 1101,
      changedAt: '2026-05-25T14:02:00',
      beforeStartDate: '2026-05-27T16:00:00',
      beforeEndDate: '2026-05-27T16:30:00',
    },
  ],
  2: [
    {
      id: 1201,
      changedAt: '2026-05-26T11:40:00',
      beforeStartDate: '2026-05-30T18:00:00',
      beforeEndDate: '2026-05-30T18:30:00',
    },
  ],
  // 3: 이동 내역 없음
  4: [
    {
      id: 1401,
      changedAt: '2026-05-30T16:20:00',
      beforeStartDate: '2026-06-02T19:00:00',
      beforeEndDate: '2026-06-02T19:30:00',
    },
  ],
  6: [
    {
      id: 1601,
      changedAt: '2026-05-24T10:00:00',
      beforeStartDate: '2026-05-26T14:00:00',
      beforeEndDate: '2026-05-26T14:30:00',
    },
  ],
  9: [
    {
      id: 1902,
      changedAt: '2026-05-28T18:30:00',
      beforeStartDate: '2026-05-30T20:00:00',
      beforeEndDate: '2026-05-30T20:30:00',
    },
    {
      id: 1901,
      changedAt: '2026-05-27T09:10:00',
      beforeStartDate: '2026-05-28T11:00:00',
      beforeEndDate: '2026-05-28T11:30:00',
    },
  ],
  11: [
    {
      id: 1110,
      changedAt: '2026-05-29T15:30:00',
      beforeStartDate: '2026-06-01T16:00:00',
      beforeEndDate: '2026-06-01T16:30:00',
    },
  ],
};

/**
 * 멘토별 주간 슬롯.
 * 예약된(RESERVED/COMPLETED/CANCELED) 슬롯은 위 예약과 시간대가 일치하고,
 * 그 외 OPEN 슬롯을 섞어 다양한 일정을 표현한다.
 */
export const seedSlotsByMentorId: Record<number, FeedbackSlotVo[]> = {
  101: [
    {
      feedbackSlotId: 10101,
      startDate: '2026-05-25T13:00:00',
      endDate: '2026-05-25T13:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10102,
      startDate: '2026-05-30T18:30:00',
      endDate: '2026-05-30T19:00:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10103,
      startDate: '2026-06-01T17:00:00',
      endDate: '2026-06-01T17:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10104,
      startDate: '2026-06-01T18:00:00',
      endDate: '2026-06-01T18:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10105,
      startDate: '2026-06-03T17:00:00',
      endDate: '2026-06-03T17:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10106,
      startDate: '2026-06-03T17:30:00',
      endDate: '2026-06-03T18:00:00',
      status: 'OPEN',
    },
    {
      feedbackSlotId: 10107,
      startDate: '2026-06-04T11:00:00',
      endDate: '2026-06-04T11:30:00',
      status: 'OPEN',
    },
  ],
  102: [
    {
      feedbackSlotId: 10201,
      startDate: '2026-05-26T10:00:00',
      endDate: '2026-05-26T10:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10202,
      startDate: '2026-06-02T16:00:00',
      endDate: '2026-06-02T16:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10203,
      startDate: '2026-06-02T16:30:00',
      endDate: '2026-06-02T17:00:00',
      status: 'OPEN',
    },
    {
      feedbackSlotId: 10204,
      startDate: '2026-06-04T19:00:00',
      endDate: '2026-06-04T19:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10205,
      startDate: '2026-06-05T09:30:00',
      endDate: '2026-06-05T10:00:00',
      status: 'OPEN',
    },
  ],
  103: [
    {
      feedbackSlotId: 10301,
      startDate: '2026-05-27T14:00:00',
      endDate: '2026-05-27T14:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10302,
      startDate: '2026-05-28T11:00:00',
      endDate: '2026-05-28T11:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10303,
      startDate: '2026-05-28T11:30:00',
      endDate: '2026-05-28T12:00:00',
      status: 'OPEN',
    },
    {
      feedbackSlotId: 10304,
      startDate: '2026-06-05T15:00:00',
      endDate: '2026-06-05T15:30:00',
      status: 'RESERVED',
    },
  ],
  104: [
    {
      feedbackSlotId: 10401,
      startDate: '2026-05-29T09:00:00',
      endDate: '2026-05-29T09:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10402,
      startDate: '2026-05-29T20:00:00',
      endDate: '2026-05-29T20:30:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10403,
      startDate: '2026-06-03T10:30:00',
      endDate: '2026-06-03T11:00:00',
      status: 'RESERVED',
    },
    {
      feedbackSlotId: 10404,
      startDate: '2026-06-03T11:00:00',
      endDate: '2026-06-03T11:30:00',
      status: 'OPEN',
    },
    {
      feedbackSlotId: 10405,
      startDate: '2026-06-06T14:00:00',
      endDate: '2026-06-06T14:30:00',
      status: 'OPEN',
    },
  ],
};
