import { renderHook, waitFor } from '@testing-library/react';
import { useLatestChallengeRedirect } from './useLatestChallengeRedirect';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

jest.mock('@/api/challenge/challenge', () => ({
  useGetActiveChallenge: () => ({
    data: { challengeList: [{ id: 42 }] },
    error: null,
    isLoading: false,
  }),
  useGetChallengeHome: () => ({
    data: { programList: [] },
    error: null,
    isLoading: false,
  }),
}));

jest.mock('@/utils/challengeFilter', () => ({
  filterB2CChallenges: async <T>(list: T[]) => list,
}));

describe('useLatestChallengeRedirect (LC-3611)', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('진입 URL 의 쿼리를 상세 페이지로 넘긴다', async () => {
    // 협찬 링크의 source=b2b 가 빠지면 경험정리 결제창 쿠폰칸이 닫힌다
    window.history.replaceState(
      null,
      '',
      '/challenge/experience-summary/latest?source=b2b&utm_source=yai',
    );

    renderHook(() => useLatestChallengeRedirect('EXPERIENCE_SUMMARY'));

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        '/program/challenge/42?source=b2b&utm_source=yai',
      ),
    );
  });

  it('쿼리가 없으면 상세 경로만 쓴다', async () => {
    window.history.replaceState(
      null,
      '',
      '/challenge/experience-summary/latest',
    );

    renderHook(() => useLatestChallengeRedirect('EXPERIENCE_SUMMARY'));

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/program/challenge/42'),
    );
  });
});
