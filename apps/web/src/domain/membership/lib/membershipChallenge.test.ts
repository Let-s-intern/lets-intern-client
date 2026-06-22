import { isValidMembershipChallengeId } from './membershipChallenge';

describe('isValidMembershipChallengeId', () => {
  it('양의 정수면 true (정상 챌린지 ID)', () => {
    expect(isValidMembershipChallengeId(100000427)).toBe(true);
  });

  it('NaN(env 미설정) 이면 false → 결제 비활성', () => {
    expect(isValidMembershipChallengeId(Number(undefined))).toBe(false);
    expect(isValidMembershipChallengeId(Number('not-a-number'))).toBe(false);
  });

  it('0·음수·소수면 false', () => {
    expect(isValidMembershipChallengeId(0)).toBe(false);
    expect(isValidMembershipChallengeId(-1)).toBe(false);
    expect(isValidMembershipChallengeId(1.5)).toBe(false);
  });
});
