/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

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
  noonOfMission,
  submittedAttendance,
} from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import { useMissionSelection } from '@/hooks/useMissionSelection';
import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { useLevelMatchedMissionSelection } from './useLevelMatchedMissionSelection';

// 3회차가 경험정리 쌍이다. 서버는 레벨을 모르고 오늘 미션으로 LV1(1003)을 준다.
const LV1_MISSION_ID = 1003;
const LV2_MISSION_ID = 2003;

const buildSchedules = ({ zeroPassed }: { zeroPassed: boolean }) => [
  buildSchedule({
    th: 0,
    id: 1000,
    day: 0,
    attendance: zeroPassed ? submittedAttendance : undefined,
  }),
  ...buildChallengeSchedules().flatMap((schedule) =>
    schedule.missionInfo.th === 3
      ? [
          buildSchedule({
            th: 3,
            id: LV1_MISSION_ID,
            day: 2,
            missionType: 'EXPERIENCE_1',
          }),
          buildSchedule({
            th: 3,
            id: LV2_MISSION_ID,
            day: 2,
            missionType: 'EXPERIENCE_2',
          }),
        ]
      : [schedule],
  ),
];

type Props = { level: 'LV1' | 'LV2'; isLevelReady: boolean };

/** /me 와 같은 순서로 기본 선택 뒤에 레벨 보정을 얹는다. */
const renderMePageSelection = (initialProps: Props) =>
  renderHook(
    ({ level, isLevelReady }: Props) => {
      useMissionSelection();
      useLevelMatchedMissionSelection(
        mockContext.schedules,
        level,
        isLevelReady,
      );
    },
    { initialProps },
  );

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(noonOfMission(3).valueOf());
  mockContext.schedules = buildSchedules({ zeroPassed: true });
  mockContext.myDailyMission = {
    dailyMission: { id: LV1_MISSION_ID, th: 3 },
  };
  useMissionStore.setState({ selectedMissionId: 0, selectedMissionTh: 0 });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useLevelMatchedMissionSelection', () => {
  it('LV2 이면 서버가 준 LV1 기본 선택을 같은 회차 LV2 미션으로 바꾼다', () => {
    renderMePageSelection({ level: 'LV2', isLevelReady: true });

    expect(useMissionStore.getState()).toMatchObject({
      selectedMissionId: LV2_MISSION_ID,
      selectedMissionTh: 3,
    });
  });

  it('LV2 이면 스토어에 남은 LV1 선택도 LV2 미션으로 바꾼다', () => {
    useMissionStore.setState({
      selectedMissionId: LV1_MISSION_ID,
      selectedMissionTh: 3,
    });

    renderMePageSelection({ level: 'LV2', isLevelReady: true });

    expect(useMissionStore.getState().selectedMissionId).toBe(LV2_MISSION_ID);
  });

  it('LV1 이면 LV1 기본 선택을 그대로 둔다', () => {
    renderMePageSelection({ level: 'LV1', isLevelReady: true });

    expect(useMissionStore.getState().selectedMissionId).toBe(LV1_MISSION_ID);
  });

  it('판정이 LV1 기본값에서 LV2 로 바뀌면 선택도 LV2 미션으로 바뀐다', () => {
    const { rerender } = renderMePageSelection({
      level: 'LV1',
      isLevelReady: false,
    });
    expect(useMissionStore.getState().selectedMissionId).toBe(LV1_MISSION_ID);

    rerender({ level: 'LV2', isLevelReady: true });

    expect(useMissionStore.getState().selectedMissionId).toBe(LV2_MISSION_ID);
  });

  it('판정 전에는 LV1 기본값으로 LV2 선택을 되돌리지 않는다', () => {
    useMissionStore.setState({
      selectedMissionId: LV2_MISSION_ID,
      selectedMissionTh: 3,
    });

    renderMePageSelection({ level: 'LV1', isLevelReady: false });

    expect(useMissionStore.getState().selectedMissionId).toBe(LV2_MISSION_ID);
  });

  it('0회차를 통과하지 않았으면 0회차 선택을 유지한다', () => {
    mockContext.schedules = buildSchedules({ zeroPassed: false });

    renderMePageSelection({ level: 'LV2', isLevelReady: true });

    expect(useMissionStore.getState()).toMatchObject({
      selectedMissionId: 1000,
      selectedMissionTh: 0,
    });
  });
});
