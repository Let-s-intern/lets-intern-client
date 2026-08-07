// 멤버십 결제는 어드민에서 만든 챌린지 1개에 위임한다(자체 결제 UI 폐기).
// 그 챌린지 ID 를 env 로 주입받아 기존 챌린지 결제 플로우(PricePlanBottomSheet)를 연다.
// Next.js 가 빌드 타임에 NEXT_PUBLIC_* 를 인라인하므로 클라이언트에서도 안전히 읽힌다.

/** 멤버십 위임 챌린지 ID. env 미설정/숫자 아님이면 NaN. */
export const MEMBERSHIP_CHALLENGE_ID = Number(
  process.env.NEXT_PUBLIC_MEMBERSHIP_CHALLENGE_ID,
);

/**
 * 주어진 ID 가 결제에 쓸 수 있는 유효한 챌린지 ID(양의 정수)인지 판정한다.
 * env 미설정·NaN·0·음수면 false → 호출부는 CTA 를 비활성화해 결제 진입을 막는다.
 */
export function isValidMembershipChallengeId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/** 현재 env 의 멤버십 챌린지 ID 가 결제 가능한 상태인지. */
export function isMembershipChallengeConfigured(): boolean {
  return isValidMembershipChallengeId(MEMBERSHIP_CHALLENGE_ID);
}

/** 하반기 멤버십 안내 가이드(노션). 마이페이지 "가이드 확인" 버튼이 새 탭으로 연다. */
export const MEMBERSHIP_GUIDE_URL =
  'https://letsintern.notion.site/2026-38f5e77cbee180d7a77deab36a8ed88b';

/** 주어진 programId 가 멤버십 위임 챌린지인지. env 미설정이면 항상 false. */
export function isMembershipChallengeProgram(programId: number): boolean {
  return (
    isValidMembershipChallengeId(MEMBERSHIP_CHALLENGE_ID) &&
    programId === MEMBERSHIP_CHALLENGE_ID
  );
}

/**
 * 멤버십이 출시(결제 가능)된 상태인지 — 빌드 타임 env 로 결정되는 상수.
 * false 면(=env 미설정) CTA 를 "출시 전" 비활성 상태로 표시한다.
 */
export const IS_MEMBERSHIP_LAUNCHED = isValidMembershipChallengeId(
  MEMBERSHIP_CHALLENGE_ID,
);

/**
 * 2026 하반기 멤버십 모집 종료 여부 (마감 2026-07-26).
 *
 * 랜딩 페이지 자체는 남겨두되 결제 진입만 막는다 — 링크를 아는 사람이 종료된 상품을
 * 결제하는 걸 방지하기 위해서다. 결제 CTA 는 랜딩에 3곳 있고(하단 고정 ApplyBar,
 * HeroSection, FinalCtaSection) 모두 이 상수를 통해 잠긴다.
 *
 * 다음 시즌에 다시 열 때는 이 값을 `false` 로 되돌리면 카운트다운·결제 CTA 가 복구된다.
 */
export const IS_RECRUITMENT_CLOSED = true;

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
 * 광고로 들어온 사람이 아무것도 남기지 못하고 나간다. 다음 시즌을 기다릴 의사가 있는 사람을
 * 여기서 받는다.
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
 * 출시 전(env 미설정)일 때만 잠근다. 그때는 보낼 곳도 결제할 곳도 없다.
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
