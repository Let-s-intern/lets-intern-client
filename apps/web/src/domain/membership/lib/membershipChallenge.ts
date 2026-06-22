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

/**
 * 멤버십이 출시(결제 가능)된 상태인지 — 빌드 타임 env 로 결정되는 상수.
 * false 면(=env 미설정) CTA 를 "출시 전" 비활성 상태로 표시한다.
 */
export const IS_MEMBERSHIP_LAUNCHED = isValidMembershipChallengeId(
  MEMBERSHIP_CHALLENGE_ID,
);

/** CTA 라벨 — 출시 전이면 "출시 전", 출시됐으면 원래 라벨. */
export function ctaLabel(label: string): string {
  return IS_MEMBERSHIP_LAUNCHED ? label : '출시 전';
}

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
