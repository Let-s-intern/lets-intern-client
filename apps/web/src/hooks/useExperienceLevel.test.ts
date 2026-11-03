/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

type MockExperience = { createDate: string; isAddedByAdmin: boolean };

const mockQuery = {
  data: undefined as { userExperiences: MockExperience[] } | undefined,
  isPending: true,
};
const mockEnabled = jest.fn();

jest.mock('@/api/user/userExperience', () => ({
  useSearchUserExperiencesQuery: (_request: unknown, enabled: boolean) => {
    mockEnabled(enabled);
    return mockQuery;
  },
}));

import { buildSchedule } from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import {
  useExperienceLevel,
  useExperienceLevelState,
} from './useExperienceLevel';

// 경험정리1 첫 미션은 8월 10일에 시작한다
const EXPERIENCE_START = dayjs('2026-08-10T08:00:00+09:00');

const experienceSchedules: Schedule[] = [
  buildSchedule({ th: 1, day: 0 }),
  buildSchedule({
    th: 2,
    id: 1002,
    startDate: EXPERIENCE_START,
    missionType: 'EXPERIENCE_1',
  }),
  buildSchedule({
    th: 2,
    id: 2002,
    startDate: EXPERIENCE_START,
    missionType: 'EXPERIENCE_2',
  }),
];

const loaded = (userExperiences: MockExperience[]) => {
  mockQuery.data = { userExperiences };
  mockQuery.isPending = false;
};

beforeEach(() => {
  mockQuery.data = undefined;
  mockQuery.isPending = true;
  mockEnabled.mockClear();
});

describe('useExperienceLevelState 판정 완료 여부', () => {
  it('경험 조회 중에는 판정 전이다', () => {
    const { result } = renderHook(() =>
      useExperienceLevelState(experienceSchedules),
    );

    expect(result.current).toEqual({ level: 'LV1', isLevelReady: false });
  });

  it('경험 조회가 끝나면 판정이 끝난다', () => {
    loaded([]);
    const { result } = renderHook(() =>
      useExperienceLevelState(experienceSchedules),
    );

    expect(result.current).toEqual({ level: 'LV1', isLevelReady: true });
  });

  it('경험정리 미션이 없는 일정은 조회 없이 바로 판정이 끝난다', () => {
    const { result } = renderHook(() =>
      useExperienceLevelState([buildSchedule({ th: 1, day: 0 })]),
    );

    expect(result.current).toEqual({ level: 'LV1', isLevelReady: true });
    expect(mockEnabled).toHaveBeenLastCalledWith(false);
  });

  it('조회 중 LV1 에서 조회 후 LV2 로 바뀐다', () => {
    const { result, rerender } = renderHook(() =>
      useExperienceLevelState(experienceSchedules),
    );
    expect(result.current.level).toBe('LV1');

    loaded([
      { createDate: '2026-08-01T10:00:00+09:00', isAddedByAdmin: false },
    ]);
    rerender();

    expect(result.current).toEqual({ level: 'LV2', isLevelReady: true });
  });
});

describe('useExperienceLevel LV2 판정 기준', () => {
  const levelWith = (experiences: MockExperience[]) => {
    loaded(experiences);
    return renderHook(() => useExperienceLevel(experienceSchedules)).result
      .current;
  };

  it('경험정리1 첫 시작일 전에 직접 만든 경험이 있으면 LV2', () => {
    expect(
      levelWith([
        { createDate: '2026-08-05T12:00:00+09:00', isAddedByAdmin: false },
      ]),
    ).toBe('LV2');
  });

  it('시작일 당일에 만든 경험은 LV1', () => {
    expect(
      levelWith([
        { createDate: '2026-08-10T12:00:00+09:00', isAddedByAdmin: false },
      ]),
    ).toBe('LV1');
  });

  it('관리자가 추가한 경험만 있으면 LV1', () => {
    expect(
      levelWith([
        { createDate: '2026-08-01T10:00:00+09:00', isAddedByAdmin: true },
      ]),
    ).toBe('LV1');
  });

  it('레벨 값만 돌려준다', () => {
    loaded([]);
    const { result } = renderHook(() =>
      useExperienceLevel(experienceSchedules),
    );

    expect(result.current).toBe('LV1');
  });
});
