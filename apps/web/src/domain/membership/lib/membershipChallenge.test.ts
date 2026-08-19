import {
  buildLoginRedirectPath,
  ctaLabel,
  IS_CTA_DISABLED,
  IS_MEMBERSHIP_LAUNCHED,
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

describe('모집 재개 상태의 CTA (LC-3219)', () => {
  it('모집이 열려 있으면 CTA 가 출시 알림 신청이 아니다', () => {
    // 모집을 재개했는데 라벨이 "출시 알림 신청" 으로 남아 있으면, 결제 가능한 상품을
    // 앞에 두고 사람을 알림 폼으로 보내게 된다. 상수 되돌림을 빠뜨렸을 때 나는 증상이라
    // 라벨 자체가 아니라 "알림 문구가 아님" 을 검증한다.
    expect(IS_RECRUITMENT_CLOSED).toBe(false);
    expect(ctaLabel('지금 바로 신청')).not.toBe('출시 알림 신청');
  });

  it('출시된 상태면 전달한 라벨을 그대로 쓴다', () => {
    // jest.config.js 가 .env.local 을 읽어 챌린지 ID 가 주입되므로 출시 상태다.
    // env 가 비면 '출시 전' 이 되는데, 그때는 결제할 곳이 없어 잠그는 것이 맞다.
    expect(ctaLabel('지금 바로 신청')).toBe(
      IS_MEMBERSHIP_LAUNCHED ? '지금 바로 신청' : '출시 전',
    );
  });

  it('출시된 상태에서는 CTA 를 잠그지 않는다', () => {
    expect(IS_CTA_DISABLED).toBe(!IS_MEMBERSHIP_LAUNCHED);
  });

  it('알림 신청 경로가 type=launch-alert 를 달고 있다', () => {
    // 다음 시즌 종료 시 다시 쓰는 경로다. 이 쿼리가 없으면 /apply 페이지가 일반 자료
    // 신청으로 처리해, 경로만 맞고 조용히 다른 폼이 열린다.
    expect(MEMBERSHIP_LAUNCH_ALERT_PATH).toContain('type=launch-alert');
    expect(MEMBERSHIP_LAUNCH_ALERT_PATH).toMatch(
      /^\/library\/\d+\/apply\?type=launch-alert$/,
    );
  });
});
