import {
  buildLoginRedirectPath,
  isValidMembershipChallengeId,
} from './membershipChallenge';

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

describe('buildLoginRedirectPath (로그인 게이트)', () => {
  it('쿼리 없는 경로는 그대로 인코딩해 redirect 에 담는다', () => {
    expect(buildLoginRedirectPath('/membership', '')).toBe(
      `/login?redirect=${encodeURIComponent('/membership')}`,
    );
  });

  it('쿼리가 있으면 path?query 를 인코딩한다 (앞의 ? 제거)', () => {
    expect(buildLoginRedirectPath('/membership', '?utm=a&b=1')).toBe(
      `/login?redirect=${encodeURIComponent('/membership?utm=a&b=1')}`,
    );
  });
});
