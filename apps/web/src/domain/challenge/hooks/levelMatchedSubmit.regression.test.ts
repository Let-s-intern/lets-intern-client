/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';

/*
  LC-3557 병합 지점 회귀 테스트. LC-3555(레벨 보정)와 LC-3558(연타 잠금)이 함께
  돌아야 한다 — LV2 멘티에게 서버가 LV1 미션을 오늘 미션으로 줘도, 연타한 제출은
  레벨 보정된 LV2 미션으로 한 번만 나간다.
*/

const mockContext = {
  schedules: [] as Schedule[],
  myDailyMission: null as {
    dailyMission: { id: number; th: number } | null;
  } | null,
  currentChallenge: { endDate: '2099-01-01T00:00:00' },
  refetchSchedules: jest.fn(),
};

jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => mockContext,
}));

const submitMissionMutate = jest.fn();
jest.mock('@/domain/challenge/api/attendance', () => ({
  useSubmitMission: () => ({ mutateAsync: submitMissionMutate }),
  usePatchAttendance: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('@/domain/challenge/hooks/useChallengeNav', () => ({
  __esModule: true,
  default: () => ({ testDate: undefined }),
}));

import {
  buildChallengeSchedules,
  buildSchedule,
  noonOfMission,
  submittedAttendance,
} from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import { useMissionSubmitRegular } from '@/domain/challenge/my-challenge/mission/submit/hooks/useMissionSubmitRegular';
import { useMissionSelection } from '@/hooks/useMissionSelection';
import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { useLevelMatchedMissionSelection } from './useLevelMatchedMissionSelection';

const LV1_MISSION_ID = 1003;
const LV2_MISSION_ID = 2003;

const schedules = [
  buildSchedule({ th: 0, id: 1000, day: 0, attendance: submittedAttendance }),
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

/** /me 순서: 기본 선택 → 레벨 보정 → 제출 섹션은 스토어 id 로 제출한다. */
const renderMePageSubmit = () =>
  renderHook(() => {
    useMissionSelection();
    useLevelMatchedMissionSelection(mockContext.schedules, 'LV2', true);
    const { selectedMissionId, selectedMissionTh } = useMissionStore();
    return useMissionSubmitRegular({
      selectedMissionTh,
      missionId: selectedMissionId,
      attendanceInfo: null,
    });
  }).result;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers().setSystemTime(noonOfMission(3).valueOf());
  mockContext.schedules = schedules;
  mockContext.myDailyMission = { dailyMission: { id: LV1_MISSION_ID, th: 3 } };
  useMissionStore.setState({ selectedMissionId: 0, selectedMissionTh: 0 });
});

afterEach(() => {
  jest.useRealTimers();
});

it('LV2 멘티가 연타해도 레벨 보정된 LV2 미션으로 한 번만 제출한다', async () => {
  let resolveSubmit!: () => void;
  submitMissionMutate.mockReturnValue(
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    }),
  );
  const result = renderMePageSubmit();

  expect(useMissionStore.getState().selectedMissionId).toBe(LV2_MISSION_ID);

  await act(async () => {
    void result.current.handleSubmit();
    void result.current.handleSubmit();
    void result.current.handleSubmit();
  });
  await act(async () => {
    resolveSubmit();
  });

  expect(submitMissionMutate).toHaveBeenCalledTimes(1);
  expect(submitMissionMutate).toHaveBeenCalledWith(
    expect.objectContaining({ missionId: LV2_MISSION_ID }),
  );
});
