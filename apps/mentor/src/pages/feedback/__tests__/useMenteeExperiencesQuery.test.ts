/**
 * Unit tests for useMenteeExperiencesQuery enabled logic.
 *
 * The hook wraps useMissionAttendanceUserExperiencesQuery and forwards an
 * `enabled` flag computed from submission state. We verify that the API is
 * only enabled for submitted, link-less mentees with a valid userId/missionId.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';

const queryMock = vi.fn();

vi.mock('@/api/challenge/challenge', () => ({
  useMissionAttendanceUserExperiencesQuery: (args: unknown) => {
    queryMock(args);
    return { data: undefined, isLoading: false, error: null };
  },
}));

import { useMenteeExperiencesQuery } from '../hooks/useMenteeExperiencesQuery';

beforeEach(() => {
  queryMock.mockClear();
});

describe('useMenteeExperiencesQuery (enabled logic)', () => {
  it('경험정리형(제출됨·링크없음·userId 존재) → enabled true', () => {
    useMenteeExperiencesQuery({
      missionId: 100,
      userId: 5,
      isAbsent: false,
      hasLink: false,
    });

    expect(queryMock).toHaveBeenCalledWith({
      missionId: 100,
      userId: 5,
      enabled: true,
    });
  });

  it('링크형(link 존재) → enabled false (경험 조회 호출 안 함)', () => {
    useMenteeExperiencesQuery({
      missionId: 100,
      userId: 5,
      isAbsent: false,
      hasLink: true,
    });

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it('미제출자(isAbsent) → enabled false', () => {
    useMenteeExperiencesQuery({
      missionId: 100,
      userId: 5,
      isAbsent: true,
      hasLink: false,
    });

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it('userId 없음(null) → enabled false', () => {
    useMenteeExperiencesQuery({
      missionId: 100,
      userId: null,
      isAbsent: false,
      hasLink: false,
    });

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false, userId: undefined }),
    );
  });

  it('missionId 없음 → enabled false', () => {
    useMenteeExperiencesQuery({
      missionId: undefined,
      userId: 5,
      isAbsent: false,
      hasLink: false,
    });

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });
});
