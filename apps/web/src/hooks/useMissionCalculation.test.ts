/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

// context 는 react-query 로 서버를 부르므로 훅 입력만 목으로 주입한다.
const mockContext = {
  schedules: [] as Schedule[],
  myDailyMission: null as { dailyMission: { th: number } | null } | null,
};

jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => mockContext,
}));

import {
  buildChallengeSchedules,
  buildSchedule,
  dawnAfterMission,
  noonOfMission,
  submittedAttendance,
} from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import { Schedule } from '@/schema';
import { useMissionCalculation } from './useMissionCalculation';

const setup = ({
  schedules = buildChallengeSchedules(),
  todayThFromServer = null as number | null,
}: {
  schedules?: Schedule[];
  todayThFromServer?: number | null;
} = {}) => {
  mockContext.schedules = schedules;
  mockContext.myDailyMission =
    todayThFromServer === null
      ? { dailyMission: null }
      : { dailyMission: { th: todayThFromServer } };

  return renderHook(() => useMissionCalculation()).result;
};

// 시각을 고정한다. todayMissionId 는 dayjs() 로 "지금" 을 읽는다.
const freezeAt = (time: { valueOf: () => number }) => {
  jest.useFakeTimers().setSystemTime(time.valueOf());
};

afterEach(() => {
  jest.useRealTimers();
});

describe('todayTh', () => {
  it('서버가 오늘 회차를 주면 그 값을 쓴다', () => {
    freezeAt(noonOfMission(3));
    const { current } = setup({ todayThFromServer: 3 });

    expect(current.todayTh).toBe(3);
  });

  // LC-3207. 예전에는 (가장 큰 th + 1) = 101 로 채워, 24개 카드가 전부
  // "이미 지나간 회차" 로 판정되어 '미제출' 로 그려졌다.
  it('진행 중인 미션이 없는 새벽에는 null 이다 (101 이 아니다)', () => {
    freezeAt(dawnAfterMission(1));
    const { current } = setup({ todayThFromServer: null });

    expect(current.todayTh).toBeNull();
  });

  it('0회차가 오늘 회차여도 0 을 그대로 쓴다', () => {
    freezeAt(noonOfMission(1));
    const { current } = setup({
      schedules: [buildSchedule({ th: 0, day: 0 })],
      todayThFromServer: 0,
    });

    expect(current.todayTh).toBe(0);
  });

  it('schedules 가 비어 있으면 null 이고 todayMissionId 는 -1', () => {
    freezeAt(noonOfMission(3));
    const { current } = setup({ schedules: [], todayThFromServer: null });

    expect(current.todayTh).toBeNull();
    expect(current.todayMissionId).toBe(-1);
  });

  // "완주했다" 와 "오늘이 101회차다" 는 다르다.
  it('마지막 미션까지 제출했으면 서버 값이 있어도 null 이다', () => {
    freezeAt(noonOfMission(23));
    const schedules = buildChallengeSchedules().map((schedule) =>
      buildSchedule({
        th: schedule.missionInfo.th,
        id: schedule.missionInfo.id,
        startDate: schedule.missionInfo.startDate,
        endDate: schedule.missionInfo.endDate,
        attendance: submittedAttendance,
      }),
    );
    const { current } = setup({ schedules, todayThFromServer: 23 });

    expect(current.isLastMissionSubmitted).toBe(true);
    expect(current.todayTh).toBeNull();
  });
});

describe('todayMissionId', () => {
  it('오늘 회차가 있으면 그 미션을 고른다', () => {
    freezeAt(noonOfMission(3));
    const { current } = setup({ todayThFromServer: 3 });

    expect(current.todayMissionId).toBe(1003);
  });

  // 예전에는 schedules 의 마지막 항목(=보너스)으로 떨어져, 새벽에 나의 기록장을 열면
  // 보너스 미션이 선택되어 있었다.
  it('오늘 회차가 없으면 가장 최근에 마감된 회차를 고른다 (보너스가 아니다)', () => {
    freezeAt(dawnAfterMission(3));
    const { current } = setup({ todayThFromServer: null });

    expect(current.todayMissionId).toBe(1003);
    expect(current.todayMissionId).not.toBe(1100);
  });

  it('마감된 회차가 없으면 (챌린지 시작 전) 가장 이른 회차를 고른다', () => {
    freezeAt({
      valueOf: () => new Date('2026-07-01T12:00:00+09:00').getTime(),
    });
    const { current } = setup({ todayThFromServer: null });

    expect(current.todayMissionId).toBe(1001);
  });

  it('오늘 회차에 해당하는 미션이 편성에 없으면 마감된 회차로 떨어진다', () => {
    freezeAt(dawnAfterMission(3));
    const { current } = setup({ todayThFromServer: 99 });

    expect(current.todayMissionId).toBe(1003);
  });
});

describe('0회차', () => {
  it('0회차를 PASS 했으면 isZeroMissionPassed 가 참', () => {
    freezeAt(noonOfMission(3));
    const { current } = setup({
      schedules: [
        buildSchedule({ th: 0, day: 0, attendance: submittedAttendance }),
        ...buildChallengeSchedules(),
      ],
      todayThFromServer: 3,
    });

    expect(current.zeroMission?.missionInfo.th).toBe(0);
    expect(current.isZeroMissionPassed).toBe(true);
  });
});
