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
 * liveFeedbackMock.ts의 개별 라이브 세션과 1:1 매칭 + 신청이 들어오지 않은 슬롯 일부 포함.
 */
export const MENTOR_OPEN_SCHEDULES_BY_CHALLENGE: Record<
  number,
  MentorOpenSlot[]
> = {
  // Challenge 1
  1: [
    // 4/28 화
    { date: '2026-04-28', time: '09:00' },
    { date: '2026-04-28', time: '09:30' }, // 빈 슬롯 (신청 없음)
    { date: '2026-04-28', time: '10:00' },
    { date: '2026-04-28', time: '11:00' },
    // 4/29 수
    { date: '2026-04-29', time: '16:00' },
    { date: '2026-04-29', time: '16:30' },
    { date: '2026-04-29', time: '17:00' },
    { date: '2026-04-29', time: '18:00' },
    // 4/30 목 오전
    { date: '2026-04-30', time: '09:00' },
    { date: '2026-04-30', time: '10:00' },
    { date: '2026-04-30', time: '11:00' },
    { date: '2026-04-30', time: '11:30' }, // 빈 슬롯
    // 4/30 목 오후
    { date: '2026-04-30', time: '14:00' },
    { date: '2026-04-30', time: '15:00' },
    { date: '2026-04-30', time: '16:00' },
    { date: '2026-04-30', time: '17:00' },
    { date: '2026-04-30', time: '18:00' },
  ],
  // Challenge 2
  2: [
    // 4/27 월
    { date: '2026-04-27', time: '14:00' },
    { date: '2026-04-27', time: '15:00' },
    { date: '2026-04-27', time: '15:30' }, // 빈 슬롯
    // 4/28 화
    { date: '2026-04-28', time: '11:30' },
    { date: '2026-04-28', time: '15:00' },
    // 4/29 수
    { date: '2026-04-29', time: '10:00' },
    { date: '2026-04-29', time: '10:30' },
  ],
};

/** 챌린지별 멘티 신청 완료 슬롯 (liveFeedbackMock 세션과 1:1 매칭). */
export const MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE: Record<
  number,
  AppliedBooking[]
> = {
  1: [
    { date: '2026-04-28', time: '09:00', menteeName: '이지수' },
    { date: '2026-04-28', time: '10:00', menteeName: '김민준' },
    { date: '2026-04-28', time: '11:00', menteeName: '박서연' },
    { date: '2026-04-29', time: '16:00', menteeName: '정하늘' },
    { date: '2026-04-29', time: '16:30', menteeName: '최지훈' },
    { date: '2026-04-29', time: '17:00', menteeName: '강민서' },
    { date: '2026-04-29', time: '18:00', menteeName: '윤서준' },
    { date: '2026-04-30', time: '09:00', menteeName: '임채원' },
    { date: '2026-04-30', time: '10:00', menteeName: '송지아' },
    { date: '2026-04-30', time: '11:00', menteeName: '한도윤' },
    { date: '2026-04-30', time: '14:00', menteeName: '오지민' },
    { date: '2026-04-30', time: '15:00', menteeName: '노은서' },
    { date: '2026-04-30', time: '16:00', menteeName: '백준혁' },
    { date: '2026-04-30', time: '17:00', menteeName: '류다연' },
    { date: '2026-04-30', time: '18:00', menteeName: '권태양' },
  ],
  2: [
    { date: '2026-04-27', time: '14:00', menteeName: '문수아' },
    { date: '2026-04-27', time: '15:00', menteeName: '장우현' },
    { date: '2026-04-28', time: '11:30', menteeName: '서지안' },
    { date: '2026-04-28', time: '15:00', menteeName: '조예린' },
    { date: '2026-04-29', time: '10:00', menteeName: '유채린' },
    { date: '2026-04-29', time: '10:30', menteeName: '황도경' },
  ],
};

/** 레거시 호환 */
export const MENTOR_OPEN_SCHEDULE_MOCK: MentorOpenSlot[] =
  MENTOR_OPEN_SCHEDULES_BY_CHALLENGE[1];
