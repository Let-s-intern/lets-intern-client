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
 * `true` 면 랜딩 페이지 자체는 남겨두되 결제 진입만 막는다. 결제 CTA 는 랜딩에 3곳
 * 있고(하단 고정 ApplyBar, HeroSection, FinalCtaSection) 모두 이 상수를 통해 잠긴다.
 *
 * 하반기 기수를 실제로 닫을 때 `true` 로 바꾸면 3곳이 한 번에 "출시 알림 신청" 이 된다.
 *
 * `boolean` 을 명시해 리터럴 타입(`true`/`false`)으로 좁혀지지 않게 한다. 좁혀지면
 * 반대편 분기가 죽은 코드로 판정돼, 값만 되돌리는 운영이 타입 에러로 막힌다.
 */
export const IS_RECRUITMENT_CLOSED: boolean = false;

/**
 * 멤버십 출시 알림을 받는 라이브러리 자석 ID.
 *
 * 숫자를 링크에 그대로 박지 않는다. 다음 시즌에 자석을 새로 만들면 이 값만 바꾸면 되고,
 * 코드를 읽는 사람이 `/library/52` 가 무엇인지 되짚지 않아도 된다.
 */
export const MEMBERSHIP_LAUNCH_ALERT_MAGNET_ID = 52;

/** 출시 알림 신청 경로. 이 페이지가 `type=launch-alert` 를 알림 신청으로 해석한다. */
export const MEMBERSHIP_LAUNCH_ALERT_PATH = `/library/${MEMBERSHIP_LAUNCH_ALERT_MAGNET_ID}/apply?type=launch-alert`;

/**
 * CTA 라벨.
 *
 * 모집이 끝나면 "모집 종료" 대신 <b>"출시 알림"</b> 을 보여준다. 종료를 알리는 것으로 끝내면
 * 광고로 들어온 사람이 아무것도 남기지 못하고 나간다.
 */
export function ctaLabel(label: string): string {
  if (IS_RECRUITMENT_CLOSED) return '출시 알림 신청';
  return IS_MEMBERSHIP_LAUNCHED ? label : '출시 전';
}

/**
 * 결제 CTA 를 비활성화할지.
 *
 * 모집 종료 중에는 <b>비활성화하지 않는다</b> — 버튼이 결제가 아니라 출시 알림 신청으로
 * 동작하기 때문이다. 결제 진입을 막는 것은 `IS_RECRUITMENT_CLOSED` 분기가 맡는다.
 */
export const IS_CTA_DISABLED =
  !IS_RECRUITMENT_CLOSED && !IS_MEMBERSHIP_LAUNCHED;

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
