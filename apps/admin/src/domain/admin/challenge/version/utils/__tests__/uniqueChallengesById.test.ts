import { describe, expect, it } from 'vitest';

import { uniqueChallengesById } from '../uniqueChallengesById';

describe('uniqueChallengesById', () => {
  it('같은 챌린지의 버전 행은 첫 행만 남기고 순서를 유지한다', () => {
    const result = uniqueChallengesById([
      { id: 7, challengeVersionId: 70 },
      { id: 8, challengeVersionId: null },
      { id: 7, challengeVersionId: 71 },
    ]);

    expect(result).toEqual([
      { id: 7, challengeVersionId: 70 },
      { id: 8, challengeVersionId: null },
    ]);
  });

  it('빈 목록은 빈 목록이다', () => {
    expect(uniqueChallengesById([])).toEqual([]);
  });
});
