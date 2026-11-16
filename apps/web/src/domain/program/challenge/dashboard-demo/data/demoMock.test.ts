import dayjs from '@/lib/dayjs';
import { buildDemoSchedules } from './demoMock';

describe('buildDemoSchedules', () => {
  const today = dayjs('2026-11-16T15:30:00');
  const schedules = buildDemoSchedules(today);

  it('0회차부터 순서대로 회차를 만든다', () => {
    expect(schedules.map((schedule) => schedule.th)).toEqual(
      Array.from({ length: schedules.length }, (_, index) => index),
    );
  });

  it('0회차는 오늘 열려 있다', () => {
    const zero = schedules[0];

    expect(zero.startDate.isAfter(today)).toBe(false);
    expect(zero.endDate.isBefore(today)).toBe(false);
  });

  it('1회차는 0회차가 끝난 다음 날 열리고 이후 하루씩 이어진다', () => {
    expect(schedules[1].startDate.isAfter(schedules[0].endDate)).toBe(true);
    expect(schedules[1].startDate.diff(schedules[0].endDate, 'hour')).toBe(0);

    schedules.slice(2).forEach((schedule, index) => {
      expect(
        schedule.startDate.diff(schedules[index + 1].startDate, 'day'),
      ).toBe(1);
    });
  });
});
