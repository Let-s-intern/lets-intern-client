/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

// context 는 react-query 로 서버를 부르므로 훅 입력만 목으로 주입한다.
const mockContext = {
  schedules: [] as Schedule[],
  myDailyMission: null as {
    dailyMission: { id: number; th: number } | null;
  } | null,
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
  todayMissionIdFromServer,
}: {
  schedules?: Schedule[];
  todayThFromServer?: number | null;
  /** 서버가 고른 오늘 미션 id. 생략하면 픽스처 규칙(th + 1000)을 따른다. */
  todayMissionIdFromServer?: number;
} = {}) => {
  mockContext.schedules = schedules;
  mockContext.myDailyMission =
    todayThFromServer === null
      ? { dailyMission: null }
      : {
          dailyMission: {
            id: todayMissionIdFromServer ?? todayThFromServer + 1000,
            th: todayThFromServer,
          },
        };

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

// V6: 2회차 경험정리는 같은 th 에 공통 미션 2개(EXPERIENCE_1/2)가 온다.
// th 첫 일치로 고르면 서버가 고른 미션과 다른 쪽이 열릴 수 있다.
describe('todayMissionId - 같은 회차에 미션이 둘일 때', () => {
  const experiencePairSchedules = () => [
    buildSchedule({ th: 1, day: 0 }),
    buildSchedule({ th: 2, id: 2021, day: 1 }),
    buildSchedule({ th: 2, id: 2022, day: 1 }),
    buildSchedule({ th: 3, day: 2 }),
  ];

  it('서버가 준 오늘 미션 id 를 고른다 (th 첫 일치가 아니다)', () => {
    freezeAt(noonOfMission(2));
    const { current } = setup({
      schedules: experiencePairSchedules(),
      todayThFromServer: 2,
      todayMissionIdFromServer: 2022,
    });

    expect(current.todayMissionId).toBe(2022);
  });

  it('서버 미션이 편성에 없으면 마감된 회차로 떨어진다', () => {
    freezeAt(noonOfMission(2));
    const { current } = setup({
      schedules: experiencePairSchedules(),
      todayThFromServer: 2,
      todayMissionIdFromServer: 9999,
    });

    expect(current.todayMissionId).toBe(1001);
  });
});

// E7: 버전 B 에는 4회차가 없다. 마지막 판정은 회차 번호가 아니라 배열 끝을 본다.
describe('isLastMissionSubmitted - 회차가 빠진 편성', () => {
  const withMissingRound = (attendance?: typeof submittedAttendance) =>
    [1, 2, 3, 5].map((th, day) =>
      buildSchedule({
        th,
        day,
        attendance: th === 5 ? attendance : submittedAttendance,
      }),
    );

  it('마지막 회차(5)를 냈으면 참이다', () => {
    freezeAt(noonOfMission(4));
    const { current } = setup({
      schedules: withMissingRound(submittedAttendance),
    });

    expect(current.isLastMissionSubmitted).toBe(true);
  });

  it('마지막 회차(5)를 안 냈으면 거짓이다', () => {
    freezeAt(noonOfMission(4));
    const { current } = setup({ schedules: withMissingRound() });

    expect(current.isLastMissionSubmitted).toBe(false);
  });

  it('빠진 회차 뒤에 보너스가 있으면 마지막 정규 회차와 보너스를 함께 본다', () => {
    freezeAt(noonOfMission(4));
    const schedules = [
      ...withMissingRound(submittedAttendance),
      buildSchedule({ th: 100, day: 4 }),
    ];
    const { current } = setup({ schedules });

    expect(current.isLastMissionSubmitted).toBe(false);
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
