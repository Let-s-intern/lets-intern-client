// 하반기 공채 멤버십(구버전) 랜딩 전용 결제 설정.
//
// [LC-3294] 상세페이지가 마케팅 취준 올인원 패스로 교체되면서 이 랜딩은 `/membership` 에
// 보존본으로 남았다. 이미 결제한 사람이 자기가 산 상품 설명을 다시 볼 수 있어야 해서다.
//
// 그래서 `NEXT_PUBLIC_MEMBERSHIP_CHALLENGE_ID` 를 여기서 읽지 않는다. 그 env 는 이제
// 마케팅 패스를 가리키므로, 그대로 읽으면 하반기 멤버십 상세페이지에서 결제했을 때
// 마케팅 패스가 팔린다. 기수는 아래에 고정한다.
//
// 기수별 노션 가이드(`membershipGuideUrl`)는 여기 없다. 마이페이지·커리어보드가 쓰는
// 살아 있는 맵은 `@/domain/membership/lib/membershipChallenge` 한 곳뿐이고, 309·384 도
// 거기에 그대로 있다. 이 파일에 복사본을 두면 어느 쪽이 화면에 나오는지 알 수 없어진다.

/**
 * 하반기 공채 멤버십 마지막 기수(2026-08-20 모집 재개분, 이용 ~11/30).
 *
 * env 가 아니라 상수인 이유는 위 주석에 있다. 이 랜딩은 더 이상 새 기수를 받지 않으므로
 * 값이 바뀔 일이 없고, 모집 마감은 서버의 챌린지 마감일이 판정한다.
 */
export const MEMBERSHIP_CHALLENGE_ID = 384;

/**
 * 주어진 ID 가 결제에 쓸 수 있는 유효한 챌린지 ID(양의 정수)인지 판정한다.
 * 0·음수·NaN 이면 false → 호출부는 CTA 를 비활성화해 결제 진입을 막는다.
 */
export function isValidMembershipChallengeId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/** 현재 기수가 결제 가능한 상태인지. */
export function isMembershipChallengeConfigured(): boolean {
  return isValidMembershipChallengeId(MEMBERSHIP_CHALLENGE_ID);
}

/** 멤버십이 결제 가능한 상태인지 — 위 상수로 결정된다. */
export const IS_MEMBERSHIP_LAUNCHED = isValidMembershipChallengeId(
  MEMBERSHIP_CHALLENGE_ID,
);

/**
 * 멤버십 모집 종료 여부.
 *
 * [LC-3294] 하반기 공채 멤버십은 모집이 끝났다. 랜딩은 남기되 결제 진입만 막는다 —
 * 이미 결제한 사람이 자기가 산 상품 설명을 다시 볼 수 있어야 하고, 광고·메일에 뿌려진
 * `/membership` 링크가 404 로 떨어지면 안 되기 때문이다. 새로 파는 상품은 마케팅 취준
 * 올인원 패스(`/membership-marketing`)다.
 *
 * 결제 CTA 는 랜딩에 3곳 있고(하단 고정 ApplyBar, HeroSection, FinalCtaSection) 모두 이
 * 상수를 통해 잠긴다. 결제 컨트롤러(MembershipPaymentSheet)도 같은 상수로 한 번 더 막는다.
 *
 * `boolean` 을 명시해 리터럴 타입(`true`/`false`)으로 좁혀지지 않게 한다. 좁혀지면
 * 반대편 분기가 죽은 코드로 판정돼, 값만 되돌리는 운영이 타입 에러로 막힌다.
 */
export const IS_RECRUITMENT_CLOSED: boolean = true;

/**
 * CTA 라벨.
 *
 * 마감된 기수라 어떤 라벨을 넘겨도 "신청 마감" 으로 덮는다. 원래 이 자리에는 다음 시즌
 * 출시 알림 신청(`/library/52/apply?type=launch-alert`)으로 보내는 분기가 있었는데,
 * 이 랜딩에서는 뺐다 — 하반기 기수는 다음 시즌이 없고, 기다리는 사람을 받을 자리는
 * 마케팅 패스 랜딩이다. 알림 자석으로 보내면 오지 않을 상품을 기다리게 만든다.
 */
export function ctaLabel(label: string): string {
  if (IS_RECRUITMENT_CLOSED) return '신청 마감';
  return IS_MEMBERSHIP_LAUNCHED ? label : '출시 전';
}

/**
 * 결제 CTA 를 비활성화할지.
 *
 * 마감이면 잠근다. 원본(`domain/membership`)은 마감 중에도 버튼을 살려 뒀는데, 그건
 * 버튼이 결제가 아니라 출시 알림 신청으로 동작했기 때문이다. 여기는 보낼 곳이 없다.
 */
export const IS_CTA_DISABLED = IS_RECRUITMENT_CLOSED || !IS_MEMBERSHIP_LAUNCHED;

/**
 * 비로그인 시 로그인 후 되돌아올 redirect 경로를 만든다(ChallengeCTAButtons 동일 패턴).
 * @param pathname window.location.pathname
 * @param search   window.location.search (앞의 '?' 포함/미포함 모두 허용)
 */
export function buildLoginRedirectPath(
  pathname: string,
  search: string,
): string {
  const query = search.replace(/^\?/, '');
  const target = query ? `${pathname}?${query}` : pathname;
  return `/login?redirect=${encodeURIComponent(target)}`;
}
