/**
 * @jest-environment jsdom
 */
import { Schedule } from '@/schema';
import { act, renderHook } from '@testing-library/react';

const patchAttendanceMutate = jest.fn();
jest.mock('@/domain/challenge/api/attendance', () => ({
  usePatchAttendance: () => ({ mutateAsync: patchAttendanceMutate }),
}));

const submitBlogBonusMutate = jest.fn();
jest.mock('@/api/mission/mission', () => ({
  useSubmitMissionBlogBonus: () => ({ mutateAsync: submitBlogBonusMutate }),
}));

jest.mock('@/api/challenge/challenge', () => ({
  useChallengeMissionAttendanceInfoQuery: () => ({ data: undefined }),
}));

jest.mock('@/context/CurrentChallengeProvider', () => ({
  useCurrentChallenge: () => ({
    currentChallenge: { id: 12 },
    refetchSchedules: jest.fn(),
  }),
}));

jest.mock('@/domain/challenge/hooks/useChallengeNav', () => ({
  __esModule: true,
  default: () => ({ testDate: undefined }),
}));

import { useMissionSubmitBonus } from './useMissionSubmitBonus';

/** 응답이 늦는 상황. resolve 를 테스트가 직접 쥔다. */
const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

const submittedAttendance: Schedule['attendanceInfo'] = {
  submitted: true,
  id: 77,
  link: 'https://blog.example.com/review',
  comments: null,
  status: 'PRESENT',
  result: 'WAITING',
  feedbackStatus: null,
  accountType: '국민',
  accountNum: '123456',
  submittedUserExperienceIds: null,
};

const setup = (attendanceInfo: Schedule['attendanceInfo'] | null) =>
  renderHook(() => useMissionSubmitBonus({ missionId: 99, attendanceInfo }))
    .result;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useMissionSubmitBonus — 연타', () => {
  it('제출 중에 handleSubmit 을 연속으로 불러도 블로그 보너스 제출은 한 번만 나간다', async () => {
    const pending = deferred();
    submitBlogBonusMutate.mockReturnValue(pending.promise);
    const result = setup(null);

    act(() => {
      void result.current.handleSubmit();
      void result.current.handleSubmit();
      void result.current.handleSubmit();
    });

    expect(submitBlogBonusMutate).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      pending.resolve();
      await pending.promise;
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('저장 중에 handleSaveEdit 을 연속으로 불러도 수정은 한 번만 나간다', async () => {
    const pending = deferred();
    patchAttendanceMutate.mockReturnValue(pending.promise);
    const result = setup(submittedAttendance);

    act(() => {
      void result.current.handleSaveEdit();
      void result.current.handleSaveEdit();
      void result.current.handleSaveEdit();
    });

    expect(patchAttendanceMutate).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      pending.resolve();
      await pending.promise;
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});
