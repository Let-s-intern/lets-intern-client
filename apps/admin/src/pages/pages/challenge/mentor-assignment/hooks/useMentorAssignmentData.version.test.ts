import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { challengeApplicationsSchema } from '@/schema';

const applicationsData = challengeApplicationsSchema.parse({
  applicationList: [
    {
      application: {
        id: 1,
        challengePricePlanType: 'STANDARD',
        challengeVersionId: 10,
        challengeVersionTitle: '대학생',
      },
    },
    { application: { id: 2, challengePricePlanType: 'PREMIUM' } },
  ],
});

vi.mock('@/api/challenge/challenge', () => ({
  ChallengeApplicationsQueryKey: 'applications',
  isLegacyChallenge: () => false,
  useChallengeApplicationsQuery: () => ({
    data: applicationsData,
    isLoading: false,
  }),
  useChallengeMissionFeedbackListQuery: () => ({ data: undefined }),
}));
vi.mock('@/api/mentor/mentor', () => ({
  useAdminChallengeMentorListQuery: () => ({
    data: { mentorList: [] },
    isLoading: false,
  }),
}));
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock('./usePaybackParticipants', () => ({
  PaybackParticipantsQueryKey: 'payback',
  default: () => ({
    data: {
      missionApplications: [
        { applicationId: 1, name: '김대학' },
        { applicationId: 2, name: '이공통' },
      ],
    },
    isLoading: false,
  }),
}));
vi.mock('./useMentorMatchHandler', () => ({
  default: () => ({ handleMatch: vi.fn(), isPending: false }),
}));
vi.mock('./useLegacyMentorAssignmentMap', () => ({
  useLegacyMentorAssignmentMap: () => ({}),
}));

import useMentorAssignmentData from './useMentorAssignmentData';

describe('useMentorAssignmentData 버전 컬럼', () => {
  it('행에 신청 버전명을 싣고, 버전 없는 신청은 null 이다', () => {
    const { result } = renderHook(() => useMentorAssignmentData('300'));

    expect(
      result.current.rows.map(({ id, versionTitle }) => ({ id, versionTitle })),
    ).toEqual([
      { id: 1, versionTitle: '대학생' },
      { id: 2, versionTitle: null },
    ]);
  });
});
