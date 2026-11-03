/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';

const submitMissionMutate = jest.fn();
const patchAttendanceMutate = jest.fn();
jest.mock('@/domain/challenge/api/attendance', () => ({
  useSubmitMission: () => ({ mutateAsync: submitMissionMutate }),
  usePatchAttendance: () => ({ mutateAsync: patchAttendanceMutate }),
}));

jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => ({
    schedules: [],
    currentChallenge: { endDate: '2099-01-01T00:00:00' },
    refetchSchedules: jest.fn(),
  }),
}));

jest.mock('@/domain/challenge/hooks/useChallengeNav', () => ({
  __esModule: true,
  default: () => ({ testDate: undefined }),
}));

jest.mock('@/store/useMissionStore', () => ({
  useMissionStore: () => ({
    selectedMissionId: 34,
    setSelectedMission: jest.fn(),
  }),
}));

import { useMissionSubmitRegular } from './useMissionSubmitRegular';

/** 응답이 늦는 상황. resolve·reject 를 테스트가 직접 쥔다. */
const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const setup = (
  attendanceInfo: Parameters<
    typeof useMissionSubmitRegular
  >[0]['attendanceInfo'] = null,
) =>
  renderHook(() =>
    useMissionSubmitRegular({
      selectedMissionTh: 1,
      missionId: 34,
      attendanceInfo,
    }),
  ).result;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useMissionSubmitRegular — 제출 연타', () => {
  it('제출 중에 handleSubmit 을 연속으로 불러도 제출 요청은 한 번만 나간다', async () => {
    const pending = deferred();
    submitMissionMutate.mockReturnValue(pending.promise);
    const result = setup();

    act(() => {
      void result.current.handleSubmit();
      void result.current.handleSubmit();
      void result.current.handleSubmit();
    });

    expect(submitMissionMutate).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      pending.resolve();
      await pending.promise;
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('제출이 실패하면 잠금이 풀려 다시 누르면 요청이 다시 나간다', async () => {
    const pending = deferred();
    submitMissionMutate.mockReturnValueOnce(pending.promise);
    const result = setup();

    act(() => {
      void result.current.handleSubmit();
    });
    await act(async () => {
      pending.reject(new Error('서버 오류'));
      await pending.promise.catch(() => {});
    });

    expect(result.current.isSubmitting).toBe(false);

    submitMissionMutate.mockResolvedValueOnce(undefined);
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(submitMissionMutate).toHaveBeenCalledTimes(2);
  });
});
