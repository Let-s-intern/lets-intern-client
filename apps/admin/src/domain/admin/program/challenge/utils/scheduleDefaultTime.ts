import dayjs, { Dayjs } from 'dayjs';

interface TimeOfDay {
  hour: number;
  minute: number;
}

/** 챌린지 시작 일자의 기본 시각 */
export const DEFAULT_START_TIME: TimeOfDay = { hour: 11, minute: 0 };
/** 챌린지 종료 일자와 모집 마감 일자의 기본 시각 */
export const DEFAULT_END_TIME: TimeOfDay = { hour: 23, minute: 59 };

const INPUT_FORMAT = 'YYYY-MM-DDTHH:mm';

const withTime = (date: Dayjs, { hour, minute }: TimeOfDay) =>
  date.hour(hour).minute(minute).second(0).millisecond(0);

/** 날짜는 그대로 두고 시각만 시작 기본 시각(11:00)으로 맞춘다 */
export const withStartTime = (date: Dayjs) =>
  withTime(date, DEFAULT_START_TIME);

/** 날짜는 그대로 두고 시각만 종료, 모집 마감 기본 시각(23:59)으로 맞춘다 */
export const withEndTime = (date: Dayjs) => withTime(date, DEFAULT_END_TIME);

/** 챌린지 생성 입력의 시작, 종료, 모집 마감 초기값. 기준일은 오늘이다 */
export const getDefaultScheduleInput = (today: Dayjs = dayjs()) => ({
  startDate: withStartTime(today).format(INPUT_FORMAT),
  endDate: withEndTime(today).format(INPUT_FORMAT),
  deadline: withEndTime(today).format(INPUT_FORMAT),
});
