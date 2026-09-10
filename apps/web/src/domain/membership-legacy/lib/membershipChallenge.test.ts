import {
  buildLoginRedirectPath,
  ctaLabel,
  IS_CTA_DISABLED,
  IS_MEMBERSHIP_LAUNCHED,
  IS_RECRUITMENT_CLOSED,
  isValidMembershipChallengeId,
  MEMBERSHIP_CHALLENGE_ID,
  MEMBERSHIP_LAUNCH_ALERT_PATH,
} from './membershipChallenge';

describe('구버전 랜딩이 파는 기수 (LC-3294)', () => {
  it('마케팅 패스 env 를 따라가지 않고 하반기 기수에 고정돼 있다', () => {
    // 이 랜딩은 하반기 공채 멤버십 설명이다. env 를 읽게 두면 마케팅 패스로 값이 바뀐
    // 순간부터 "하반기 멤버십" 상세를 읽고 결제한 사람에게 다른 상품이 팔린다.
    // 화면의 설명과 결제되는 상품이 어긋나는 것이라 조용히 지나가고, 환불로만 드러난다.
    expect(MEMBERSHIP_CHALLENGE_ID).toBe(384);
  });

  it('고정 기수가 결제 가능한 값이라 CTA 가 잠기지 않는다', () => {
    expect(IS_MEMBERSHIP_LAUNCHED).toBe(true);
    expect(IS_CTA_DISABLED).toBe(false);
  });
});

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

describe('모집 상태의 CTA (LC-3219)', () => {
  it('모집이 열려 있으면 CTA 가 출시 알림 신청이 아니다', () => {
    // 모집을 재개했는데 라벨이 "출시 알림 신청" 으로 남아 있으면, 결제 가능한 상품을
    // 앞에 두고 사람을 알림 폼으로 보내게 된다. 상수 되돌림을 빠뜨렸을 때 나는 증상이라
    // 라벨 자체가 아니라 "알림 문구가 아님" 을 검증한다.
    expect(IS_RECRUITMENT_CLOSED).toBe(false);
    expect(ctaLabel('지금 바로 신청')).not.toBe('출시 알림 신청');
  });

  it('출시된 상태면 전달한 라벨을 그대로 쓴다', () => {
    expect(ctaLabel('지금 바로 신청')).toBe('지금 바로 신청');
  });

  it('알림 신청 경로가 type=launch-alert 를 달고 있다', () => {
    // 기수를 닫을 때 다시 쓰는 경로다. 이 쿼리가 없으면 /apply 페이지가 일반 자료
    // 신청으로 처리해, 경로만 맞고 조용히 다른 폼이 열린다.
    expect(MEMBERSHIP_LAUNCH_ALERT_PATH).toContain('type=launch-alert');
    expect(MEMBERSHIP_LAUNCH_ALERT_PATH).toMatch(
      /^\/library\/\d+\/apply\?type=launch-alert$/,
    );
  });
});
