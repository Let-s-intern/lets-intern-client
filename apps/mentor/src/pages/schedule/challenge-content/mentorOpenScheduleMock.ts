export interface MentorOpenSlot {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" */
  time: string;
}

export interface AppliedBooking {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" */
  time: string;
  menteeName: string;
}

/**
 * 챌린지별 멘토 오픈 슬롯 목데이터.
 * 각 슬롯은 특정 날짜에 귀속되므로 주를 넘기면 다른 주에는 표시되지 않음.
 *
 * liveFeedbackMock.ts의 개별 라이브 세션 + 신청 들어오지 않은 빈 슬롯 일부 포함.
 *
 * 일정 (오늘=2026-05-03 기준):
 *  - ch1 라이브 기간 5/4~6
 *  - ch2 라이브 기간 5/6~8
 */
export const MENTOR_OPEN_SCHEDULES_BY_CHALLENGE: Record<
  number,
  MentorOpenSlot[]
> = {
  // Challenge 1 — 5/4(월), 5/5(화), 5/6(수)
  1: [
    // 5/4 월: 오전 3 + 오후 1 (+ 빈 슬롯 1)
    { date: '2026-05-04', time: '10:00' },
    { date: '2026-05-04', time: '10:30' }, // 빈 슬롯
    { date: '2026-05-04', time: '11:00' },
    { date: '2026-05-04', time: '14:00' },
    { date: '2026-05-04', time: '15:00' },
    // 5/5 화: 5명 + 빈 슬롯 1
    { date: '2026-05-05', time: '10:00' },
    { date: '2026-05-05', time: '10:30' },
    { date: '2026-05-05', time: '14:00' },
    { date: '2026-05-05', time: '14:30' }, // 빈 슬롯
    { date: '2026-05-05', time: '15:00' },
    { date: '2026-05-05', time: '16:00' },
    // 5/6 수: 4명
    { date: '2026-05-06', time: '09:00' },
    { date: '2026-05-06', time: '10:00' },
    { date: '2026-05-06', time: '11:00' },
    { date: '2026-05-06', time: '12:00' },
  ],
  // Challenge 2 — 5/6(수), 5/7(목), 5/8(금)
  2: [
    // 5/6 수: 3명
    { date: '2026-05-06', time: '14:00' },
    { date: '2026-05-06', time: '15:00' },
    { date: '2026-05-06', time: '16:00' },
    // 5/7 목: 4명 + 빈 슬롯 1
    { date: '2026-05-07', time: '10:00' },
    { date: '2026-05-07', time: '11:00' },
    { date: '2026-05-07', time: '11:30' }, // 빈 슬롯
    { date: '2026-05-07', time: '14:00' },
    { date: '2026-05-07', time: '15:00' },
    // 5/8 금: 2명
    { date: '2026-05-08', time: '14:00' },
    { date: '2026-05-08', time: '15:00' },
  ],
};

/** 챌린지별 멘티 신청 완료 슬롯 (liveFeedbackMock 세션과 1:1 매칭). */
export const MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE: Record<
  number,
  AppliedBooking[]
> = {
  1: [
    { date: '2026-05-04', time: '10:00', menteeName: '이지수' },
    { date: '2026-05-04', time: '11:00', menteeName: '김민준' },
    { date: '2026-05-04', time: '14:00', menteeName: '박서연' },
    { date: '2026-05-04', time: '15:00', menteeName: '정하늘' },
    { date: '2026-05-05', time: '10:00', menteeName: '최지훈' },
    { date: '2026-05-05', time: '10:30', menteeName: '강민서' },
    { date: '2026-05-05', time: '14:00', menteeName: '윤서준' },
    { date: '2026-05-05', time: '15:00', menteeName: '임채원' },
    { date: '2026-05-05', time: '16:00', menteeName: '송지아' },
    { date: '2026-05-06', time: '09:00', menteeName: '한도윤' },
    { date: '2026-05-06', time: '10:00', menteeName: '오지민' },
    { date: '2026-05-06', time: '11:00', menteeName: '노은서' },
    { date: '2026-05-06', time: '12:00', menteeName: '백준혁' },
  ],
  2: [
    { date: '2026-05-06', time: '14:00', menteeName: '문수아' },
    { date: '2026-05-06', time: '15:00', menteeName: '장우현' },
    { date: '2026-05-06', time: '16:00', menteeName: '서지안' },
    { date: '2026-05-07', time: '10:00', menteeName: '조예린' },
    { date: '2026-05-07', time: '11:00', menteeName: '유채린' },
    { date: '2026-05-07', time: '14:00', menteeName: '황도경' },
    { date: '2026-05-07', time: '15:00', menteeName: '권태양' },
    { date: '2026-05-08', time: '14:00', menteeName: '류다연' },
    { date: '2026-05-08', time: '15:00', menteeName: '백지윤' },
  ],
};

/** 레거시 호환 */
export const MENTOR_OPEN_SCHEDULE_MOCK: MentorOpenSlot[] =
  MENTOR_OPEN_SCHEDULES_BY_CHALLENGE[1];
