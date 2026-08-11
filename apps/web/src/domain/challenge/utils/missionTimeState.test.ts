import dayjs from '@/lib/dayjs';
import {
  buildChallengeSchedules,
  buildSchedule,
  dawnAfterMission,
  noonOfMission,
} from './__fixtures__/challengeSchedule';
import {
  countFinishedMissions,
  findLastFinishedSchedule,
  getMissionTimeState,
} from './missionTimeState';

// 챌린지 369 편성과 같은 하루 창(08:00~23:59)을 쓴다.
const START = dayjs('2026-08-11T08:00:00+09:00');
const END = dayjs('2026-08-11T23:59:00+09:00');

const period = (startDate = START, endDate = END) => ({ startDate, endDate });

describe('getMissionTimeState 경계', () => {
  it('시작 전이면 UPCOMING', () => {
    expect(
      getMissionTimeState(period(), dayjs('2026-08-11T07:59:59+09:00')),
    ).toBe('UPCOMING');
  });

  it('시작 정각이면 IN_PROGRESS (경계 포함)', () => {
    expect(getMissionTimeState(period(), START)).toBe('IN_PROGRESS');
  });

  it('진행 중이면 IN_PROGRESS', () => {
    expect(
      getMissionTimeState(period(), dayjs('2026-08-11T12:00:00+09:00')),
    ).toBe('IN_PROGRESS');
  });

  it('마감 정각이면 IN_PROGRESS (경계 포함)', () => {
    expect(getMissionTimeState(period(), END)).toBe('IN_PROGRESS');
  });

  it('마감 후면 PAST', () => {
    expect(
      getMissionTimeState(period(), dayjs('2026-08-11T23:59:01+09:00')),
    ).toBe('PAST');
  });

  // 이 챌린지가 매일 겪는 시간대. 전날 미션은 끝났고 오늘 미션은 아직 안 열렸다.
  it('미션이 없는 새벽 시간대 — 전날 회차는 PAST, 당일 회차는 UPCOMING', () => {
    const dawn = dayjs('2026-08-12T03:36:00+09:00');
    const yesterday = period();
    const today = period(
      dayjs('2026-08-12T08:00:00+09:00'),
      dayjs('2026-08-12T23:59:00+09:00'),
    );

    expect(getMissionTimeState(yesterday, dawn)).toBe('PAST');
    expect(getMissionTimeState(today, dawn)).toBe('UPCOMING');
  });
});

describe('getMissionTimeState 날짜 누락', () => {
  const now = dayjs('2026-08-11T12:00:00+09:00');

  // 날짜를 모르는 미션을 PAST 로 보면 출석 기록이 없는 회차가 '미제출' 이 된다.
  it.each([
    ['startDate 만 null', { startDate: null, endDate: END }],
    ['endDate 만 null', { startDate: START, endDate: null }],
    ['둘 다 null', { startDate: null, endDate: null }],
  ])('%s 이면 UPCOMING', (_, mission) => {
    expect(getMissionTimeState(mission, now)).toBe('UPCOMING');
  });

  it('마감이 이미 지난 시각이라도 startDate 를 모르면 UPCOMING', () => {
    expect(
      getMissionTimeState(
        { startDate: null, endDate: END },
        dayjs('2026-08-20T12:00:00+09:00'),
      ),
    ).toBe('UPCOMING');
  });
});

describe('countFinishedMissions', () => {
  const schedules = buildChallengeSchedules();

  it('3회차 진행 중이면 마감된 회차는 2개', () => {
    expect(countFinishedMissions(schedules, noonOfMission(3))).toBe(2);
  });

  it('3회차가 끝난 새벽이면 마감된 회차는 3개', () => {
    expect(countFinishedMissions(schedules, dawnAfterMission(3))).toBe(3);
  });

  it('챌린지 시작 전이면 0개', () => {
    expect(
      countFinishedMissions(schedules, dayjs('2026-07-01T12:00:00+09:00')),
    ).toBe(0);
  });
});

describe('findLastFinishedSchedule', () => {
  const schedules = buildChallengeSchedules();

  it('마감된 회차 중 가장 늦게 끝난 것을 고른다', () => {
    expect(
      findLastFinishedSchedule(schedules, dawnAfterMission(3))?.missionInfo.th,
    ).toBe(3);
  });

  it('진행 중인 회차는 고르지 않는다', () => {
    expect(
      findLastFinishedSchedule(schedules, noonOfMission(3))?.missionInfo.th,
    ).toBe(2);
  });

  it('마감된 회차가 없으면 undefined', () => {
    expect(
      findLastFinishedSchedule(schedules, dayjs('2026-07-01T12:00:00+09:00')),
    ).toBeUndefined();
  });

  it('편성 순서가 뒤섞여 있어도 endDate 로 고른다', () => {
    const shuffled = [
      buildSchedule({ th: 2, day: 1 }),
      buildSchedule({ th: 3, day: 2 }),
      buildSchedule({ th: 1, day: 0 }),
    ];

    expect(
      findLastFinishedSchedule(shuffled, dawnAfterMission(3))?.missionInfo.th,
    ).toBe(3);
  });
});
