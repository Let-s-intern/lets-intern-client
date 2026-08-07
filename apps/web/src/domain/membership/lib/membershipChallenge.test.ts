import {
  buildLoginRedirectPath,
  ctaLabel,
  IS_CTA_DISABLED,
  IS_RECRUITMENT_CLOSED,
  isValidMembershipChallengeId,
  MEMBERSHIP_LAUNCH_ALERT_PATH,
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

describe('모집 종료 상태의 CTA (LC-3203)', () => {
  it('모집이 끝나면 "모집 종료" 가 아니라 출시 알림을 권한다', () => {
    // 끝났다는 사실만 알리면 다음 시즌을 기다릴 의사가 있는 사람이 아무것도 남기지 못하고
    // 나간다. 랜딩을 살려 두는 이유가 그 사람들을 받기 위해서다.
    expect(IS_RECRUITMENT_CLOSED).toBe(true);
    expect(ctaLabel('지금 바로 신청')).toBe('출시 알림 신청');
  });

  it('모집 종료 중에도 CTA 를 잠그지 않는다', () => {
    // 버튼이 결제가 아니라 알림 신청으로 동작한다. 잠그면 누를 수가 없다.
    expect(IS_CTA_DISABLED).toBe(false);
  });

  it('알림 신청 경로가 type=launch-alert 를 달고 있다', () => {
    // 이 쿼리가 없으면 /apply 페이지가 일반 자료 신청으로 처리해, 출시 알림이 아니라
    // 다른 폼이 뜬다. 경로만 맞고 조용히 다른 화면이 열리는 종류의 어긋남이다.
    expect(MEMBERSHIP_LAUNCH_ALERT_PATH).toContain('type=launch-alert');
    expect(MEMBERSHIP_LAUNCH_ALERT_PATH).toMatch(
      /^\/library\/\d+\/apply\?type=launch-alert$/,
    );
  });
});
