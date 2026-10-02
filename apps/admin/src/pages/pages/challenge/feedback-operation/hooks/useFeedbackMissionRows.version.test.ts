import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { challengeMissionFeedbackListSchema } from '@/api/challenge/challengeSchema';
import { formatMissionRoundLabel } from '@/domain/admin/challenge/version/utils/missionVersion';

const { feedbackData } = vi.hoisted(() => ({
  feedbackData: { current: undefined as unknown },
}));

vi.mock('@/api/challenge/challenge', () => ({
  isLegacyChallenge: () => false,
  useChallengeMissionFeedbackListQuery: () => ({ data: feedbackData.current }),
  useMentorMissionFeedbackListQuery: () => ({ data: undefined }),
}));
vi.mock('@/api/challenge/challengeOption', () => ({
  useGetChallengeOptions: () => ({ data: undefined }),
}));
vi.mock('@/api/user/user', () => ({
  useIsAdminQuery: () => ({ data: true }),
}));
vi.mock('react-router-dom', () => ({
  useParams: () => ({ programId: '300' }),
}));
vi.mock('./useLegacyMissionCounts', () => ({
  useLegacyMissionCounts: () => ({}),
}));

import useFeedbackMissionRows from './useFeedbackMissionRows';

describe('useFeedbackMissionRows 버전명', () => {
  it('행에 미션 대상 버전을 싣고 회차 라벨에 버전명이 붙는다', () => {
    feedbackData.current = challengeMissionFeedbackListSchema.parse({
      missionList: [
        {
          id: 1,
          th: 3,
          challengeVersionList: [{ challengeVersionId: 10, title: '대학생' }],
        },
        { id: 2, th: 3, challengeVersionList: [] },
      ],
    });

    const { result } = renderHook(() => useFeedbackMissionRows());

    expect(result.current.map(formatMissionRoundLabel)).toEqual([
      '3회차 (대학생)',
      '3회차',
    ]);
  });

  it('서버가 버전 필드를 주지 않으면 공통처럼 회차만 보인다', () => {
    feedbackData.current = challengeMissionFeedbackListSchema.parse({
      missionList: [{ id: 1, th: 3 }],
    });

    const { result } = renderHook(() => useFeedbackMissionRows());

    expect(result.current[0].challengeVersionList).toEqual([]);
    expect(formatMissionRoundLabel(result.current[0])).toBe('3회차');
  });
});
