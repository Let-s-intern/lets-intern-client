/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';

let mockPathname = '/challenge/1/369';

jest.mock('@/api/challenge/challenge', () => ({
  useChallengeMissionAttendanceInfoQuery: () => ({ error: null }),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ applicationId: '1', programId: '369' }),
  usePathname: () => mockPathname,
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// 이용 기록 모듈은 axios 를 끌고 온다. 카드를 누르지 않는 테스트라 통째로 막는다.
jest.mock('@/domain/challenge/api/missionAccessLog', () => ({
  logMissionAccess: jest.fn(),
}));

jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => ({
    // 챌린지 종료 + 2일 판정('최종 반려')에만 쓰인다. 진행 중인 챌린지로 둔다.
    currentChallenge: { endDate: mockChallengeEndDate },
  }),
}));

import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { Dayjs } from 'dayjs';
import {
  buildChallengeSchedules,
  buildSchedule,
  dawnAfterMission,
  noonOfMission,
  submittedAttendance,
} from '../../../utils/__fixtures__/challengeSchedule';
import MissionCalendarItem from './MissionCalendarItem';

const mockChallengeEndDate = dayjs('2026-08-20T23:59:00+09:00');

const renderItem = (schedule: Schedule, now: Dayjs) =>
  render(
    <MissionCalendarItem schedule={schedule} now={now} isDone={false} />,
  ).container;

/** 시작 전 회차는 회색 '미션' 아이콘을 쓴다. 제출 배지와 아이콘 alt 로 갈린다. */
const isNotStarted = (container: HTMLElement) =>
  container.querySelector('img[alt="not-started-icon"]') !== null;

const isCardHighlighted = (container: HTMLElement) =>
  container.querySelector('.border-\\[\\#A6AAFA\\]') !== null;

describe('MissionCalendarItem 카드 상태', () => {
  beforeEach(() => {
    mockPathname = '/challenge/1/369';
  });

  it('시작 전 회차는 회색 "N회차 / 미션" 으로 그린다', () => {
    const container = renderItem(
      buildSchedule({ th: 5, day: 4 }),
      noonOfMission(3),
    );

    expect(isNotStarted(container)).toBe(true);
    expect(container.querySelector('.text-neutral-30')?.textContent).toBe(
      '5회차미션',
    );
  });

  it('진행 중인 회차는 진행중으로 그린다', () => {
    const container = renderItem(
      buildSchedule({ th: 3, day: 2 }),
      noonOfMission(3),
    );

    expect(isNotStarted(container)).toBe(false);
    expect(container.textContent).toContain('진행중');
  });

  it('마감된 회차에 출석 기록이 없으면 미제출', () => {
    const container = renderItem(
      buildSchedule({ th: 2, day: 1 }),
      noonOfMission(3),
    );

    expect(container.textContent).toContain('미제출');
  });

  it('마감된 회차에 출석 기록이 있으면 제출 배지', () => {
    const container = renderItem(
      buildSchedule({ th: 2, day: 1, attendance: submittedAttendance }),
      noonOfMission(3),
    );

    expect(container.textContent).toContain('제출 성공');
    expect(container.textContent).not.toContain('미제출');
  });

  it('시작일·마감일을 모르는 미션은 지나간 것으로 보지 않는다', () => {
    const container = renderItem(
      buildSchedule({ th: 7, startDate: null, endDate: null }),
      noonOfMission(3),
    );

    expect(isNotStarted(container)).toBe(true);
    expect(container.textContent).not.toContain('미제출');
  });

  it('대시보드에서 진행 중인 카드만 테두리를 강조한다', () => {
    const inProgress = renderItem(
      buildSchedule({ th: 3, day: 2 }),
      noonOfMission(3),
    );
    const upcoming = renderItem(
      buildSchedule({ th: 5, day: 4 }),
      noonOfMission(3),
    );

    expect(isCardHighlighted(inProgress)).toBe(true);
    expect(isCardHighlighted(upcoming)).toBe(false);
  });
});

// LC-3207. 이 챌린지는 미션이 매일 08:00~23:59 라 매일 새벽 여덟 시간 동안
// 진행 중인 미션이 없다. 예전에는 그 시간대에 24개 카드가 전부 '미제출' 이었다.
describe('MissionCalendarItem — 진행 중인 미션이 없는 새벽', () => {
  const dawn = dawnAfterMission(1);
  const schedules = buildChallengeSchedules();

  it('아직 열리지 않은 회차는 여전히 회색이다', () => {
    for (const schedule of schedules.slice(1)) {
      const container = renderItem(schedule, dawn);

      expect(isNotStarted(container)).toBe(true);
      expect(container.textContent).not.toContain('미제출');
    }
  });

  it('이미 마감된 회차만 미제출로 남는다', () => {
    const container = renderItem(schedules[0], dawn);

    expect(container.textContent).toContain('미제출');
  });

  it('1회차를 제출했다면 제출 상태가 그대로 유지된다', () => {
    const container = renderItem(
      buildSchedule({ th: 1, day: 0, attendance: submittedAttendance }),
      dawn,
    );

    expect(container.textContent).toContain('제출 성공');
  });

  it('어느 카드도 테두리를 강조하지 않는다', () => {
    for (const schedule of schedules) {
      expect(isCardHighlighted(renderItem(schedule, dawn))).toBe(false);
    }
  });
});
