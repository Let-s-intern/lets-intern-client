import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';

import {
  getDefaultScheduleInput,
  withEndTime,
  withStartTime,
} from './scheduleDefaultTime';

// 일부러 초와 밀리초가 0 이 아닌 시각을 기준으로 삼는다
const today = dayjs('2026-11-24T15:42:37.512');

describe('withStartTime', () => {
  it('날짜는 두고 시각을 11:00:00 으로 맞춘다', () => {
    const result = withStartTime(today);

    expect(result.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(
      '2026-11-24T11:00:00.000',
    );
  });
});

describe('withEndTime', () => {
  it('날짜는 두고 시각을 23:59:00 으로 맞춘다', () => {
    const result = withEndTime(today);

    expect(result.format('YYYY-MM-DDTHH:mm:ss.SSS')).toBe(
      '2026-11-24T23:59:00.000',
    );
  });

  it('원본을 바꾸지 않는다', () => {
    withEndTime(today);

    expect(today.format('HH:mm:ss')).toBe('15:42:37');
  });
});

describe('getDefaultScheduleInput', () => {
  it('시작은 11:00, 종료와 모집 마감은 23:59 이고 날짜는 오늘이다', () => {
    expect(getDefaultScheduleInput(today)).toEqual({
      startDate: '2026-11-24T11:00',
      endDate: '2026-11-24T23:59',
      deadline: '2026-11-24T23:59',
    });
  });

  it('기준일을 주지 않으면 오늘 날짜를 쓴다', () => {
    const result = getDefaultScheduleInput();

    expect(result.startDate).toMatch(
      new RegExp(`^${dayjs().format('YYYY-MM-DD')}T11:00$`),
    );
  });
});
