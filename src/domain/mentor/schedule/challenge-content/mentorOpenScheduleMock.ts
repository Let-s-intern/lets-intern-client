export interface MentorOpenSlot {
  dayIndex: number;
  time: string;
}

/**
 * 목데이터: 멘토가 기본으로 오픈한 시간대.
 * dayIndex는 월요일=0, 일요일=6 기준이다.
 */
export const MENTOR_OPEN_SCHEDULE_MOCK: MentorOpenSlot[] = [
  { dayIndex: 0, time: '10:00' },
  { dayIndex: 0, time: '10:30' },
  { dayIndex: 2, time: '14:00' },
  { dayIndex: 2, time: '14:30' },
  { dayIndex: 4, time: '16:00' },
  { dayIndex: 4, time: '16:30' },
];
