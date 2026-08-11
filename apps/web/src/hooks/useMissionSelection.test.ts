/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

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
import { useMissionStore } from '@/store/useMissionStore';
import { useMissionSelection } from './useMissionSelection';

const BONUS_MISSION_ID = 1100;

const setup = ({
  schedules,
  todayThFromServer,
}: {
  schedules: Schedule[];
  todayThFromServer: number | null;
}) => {
  mockContext.schedules = schedules;
  mockContext.myDailyMission =
    todayThFromServer === null
      ? { dailyMission: null }
      : { dailyMission: { th: todayThFromServer } };

  renderHook(() => useMissionSelection());

  return useMissionStore.getState();
};

const freezeAt = (time: { valueOf: () => number }) => {
  jest.useFakeTimers().setSystemTime(time.valueOf());
};

/** 0회차를 통과한 뒤의 편성. 0회차가 없으면 언제나 0회차로 보내진다. */
const withPassedZeroMission = () => [
  buildSchedule({ th: 0, id: 1000, day: 0, attendance: submittedAttendance }),
  ...buildChallengeSchedules(),
];

beforeEach(() => {
  useMissionStore.setState({ selectedMissionId: 0, selectedMissionTh: 0 });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useMissionSelection 기본 선택', () => {
  it('오늘 회차가 있으면 그 미션을 연다', () => {
    freezeAt(noonOfMission(3));
    const state = setup({
      schedules: withPassedZeroMission(),
      todayThFromServer: 3,
    });

    expect(state.selectedMissionId).toBe(1003);
    expect(state.selectedMissionTh).toBe(3);
  });

  // LC-3207. 예전에는 진행 중인 미션이 없으면 0회차로 튕기거나, 0회차가 없는 편성에서는
  // schedules 의 마지막 항목인 보너스 미션이 열렸다.
  it('진행 중인 미션이 없으면 가장 최근에 마감된 회차를 연다', () => {
    freezeAt(dawnAfterMission(3));
    const state = setup({
      schedules: withPassedZeroMission(),
      todayThFromServer: null,
    });

    expect(state.selectedMissionId).toBe(1003);
    expect(state.selectedMissionTh).toBe(3);
    expect(state.selectedMissionId).not.toBe(BONUS_MISSION_ID);
  });

  it('진행 중인 미션이 없어도 0회차로 튕기지 않는다', () => {
    freezeAt(dawnAfterMission(3));
    const state = setup({
      schedules: withPassedZeroMission(),
      todayThFromServer: null,
    });

    expect(state.selectedMissionTh).not.toBe(0);
  });

  it('0회차를 통과하지 않았으면 0회차로 보낸다', () => {
    freezeAt(dawnAfterMission(3));
    const state = setup({
      schedules: [
        buildSchedule({ th: 0, id: 1000, day: 0 }),
        ...buildChallengeSchedules(),
      ],
      todayThFromServer: null,
    });

    expect(state.selectedMissionId).toBe(1000);
    expect(state.selectedMissionTh).toBe(0);
  });

  // falsy 검사(`!th`)로는 0회차가 오늘 회차인 것과 오늘 회차가 없는 것을 구분하지 못했다.
  it('오늘 회차가 0회차여도 0 을 그대로 쓴다', () => {
    freezeAt(noonOfMission(1));
    const state = setup({
      schedules: withPassedZeroMission(),
      todayThFromServer: 0,
    });

    expect(state.selectedMissionTh).toBe(0);
  });

  it('사용자가 고른 미션이 있으면 덮어쓰지 않는다', () => {
    freezeAt(dawnAfterMission(3));
    useMissionStore.setState({ selectedMissionId: 1007, selectedMissionTh: 7 });

    const state = setup({
      schedules: withPassedZeroMission(),
      todayThFromServer: null,
    });

    expect(state.selectedMissionId).toBe(1007);
  });
});
