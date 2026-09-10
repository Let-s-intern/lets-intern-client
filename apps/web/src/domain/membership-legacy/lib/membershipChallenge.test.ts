import {
  buildLoginRedirectPath,
  ctaLabel,
  IS_CTA_DISABLED,
  IS_MEMBERSHIP_LAUNCHED,
  IS_RECRUITMENT_CLOSED,
  isValidMembershipChallengeId,
  MEMBERSHIP_CHALLENGE_ID,
} from './membershipChallenge';

describe('구버전 랜딩이 파는 기수 (LC-3294)', () => {
  it('마케팅 패스 env 를 따라가지 않고 하반기 기수에 고정돼 있다', () => {
    // 이 랜딩은 하반기 공채 멤버십 설명이다. env 를 읽게 두면 마케팅 패스로 값이 바뀐
    // 순간부터 "하반기 멤버십" 상세를 읽고 결제한 사람에게 다른 상품이 팔린다.
    // 화면의 설명과 결제되는 상품이 어긋나는 것이라 조용히 지나가고, 환불로만 드러난다.
    expect(MEMBERSHIP_CHALLENGE_ID).toBe(384);
  });

  it('기수 자체는 유효하지만 마감이라 CTA 는 잠긴다', () => {
    expect(IS_MEMBERSHIP_LAUNCHED).toBe(true);
    expect(IS_CTA_DISABLED).toBe(true);
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

describe('마감된 기수의 CTA (LC-3294)', () => {
  it('모집이 닫혀 있다', () => {
    expect(IS_RECRUITMENT_CLOSED).toBe(true);
  });

  it('어떤 라벨을 넘겨도 신청 마감으로 덮는다', () => {
    // 호출부(Hero·FinalCta·ApplyBar)는 각자 자기 문구를 넘긴다. 여기서 덮지 않으면
    // 버튼은 잠겨 있는데 글자는 "지금 바로 신청" 이라, 눌리지 않는 이유가 화면에 없다.
    expect(ctaLabel('지금 바로 신청')).toBe('신청 마감');
    expect(ctaLabel('멤버십 시작하기')).toBe('신청 마감');
  });

  it('결제 CTA 를 잠근다', () => {
    // 원본(domain/membership)은 마감 중에도 버튼을 살려 뒀다 — 출시 알림 신청으로
    // 동작했기 때문이다. 이 랜딩은 보낼 곳이 없으므로 살려 두면 눌러도 아무 일이 없다.
    expect(IS_CTA_DISABLED).toBe(true);
  });
});
