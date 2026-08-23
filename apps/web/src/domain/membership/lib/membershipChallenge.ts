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
 * [LC-3219-MEMBERSHIP] 기수별 안내 가이드(노션) — 하드코딩. 멤버십 정식 개발 시 통째로 지운다.
 *
 * 결제는 최신 기수 하나(env `MEMBERSHIP_CHALLENGE_ID`)로만 받지만, 지난 기수 참여자도
 * 자기 프로그램이 끝날 때까지 가이드를 열 수 있어야 한다. 그래서 "결제 대상 기수"와
 * "멤버십으로 인정되는 기수"를 분리한다 — 이 맵이 후자이고, env 는 전자다.
 *
 * 이 분리가 없어서 사고가 났다. 2026-08-20 모집 재개로 운영 env 를 384 로 올리자
 * 멤버십 판정이 env 와의 비교였던 탓에 309 가 false 가 되어, 8월 기수 참여자 카드의
 * 버튼이 '가이드 확인' 대신 '대시보드 입장' 으로 바뀌었다. 멤버십은 챌린지 대시보드를
 * 쓰지 않으므로 가이드에 닿을 길이 사라졌다.
 *
 * 기수를 추가할 때는 env 와 이 맵을 <b>함께</b> 고친다. 맵에 빠뜨리면 신규 구매자가
 * 가이드를 못 본다. 로컬·테스트 env 의 챌린지 ID 는 운영 기수와 다른 값이라 이 짝맞춤을
 * 단위 테스트로 잡을 수 없다 — env 를 올리는 배포에서 사람이 확인해야 한다.
 * 기수가 끝나면 해당 줄을 지운다.
 *
 * 서버에 이미 챌린지별 가이드가 있다(`ChallengeGuide`, GET /challenge/{id}/guides).
 * 정식 개발 때 그쪽으로 옮기면 이 맵과 아래 함수는 통째로 사라진다.
 */
const MEMBERSHIP_GUIDE_URL_BY_CHALLENGE_ID: Record<number, string> = {
  // [LC-3219-MEMBERSHIP] 309 — 2026 하반기 1기(8월 구매분, 9월까지 진행). 종료되면 지운다.
  309: 'https://letsintern.notion.site/2026-38f5e77cbee180d7a77deab36a8ed88b',
  // [LC-3219-MEMBERSHIP] 384 — 2026-08-20 모집 재개분. 상세페이지가 연결하는 현행 기수.
  // TODO 384 전용 가이드 주소를 확인해 교체한다. 지금 값은 운영에 이미 나가 있는 1기 주소라
  //      384 참여자가 보는 화면은 이 변경 전후로 동일하다(이번 수정은 309 복구가 목적).
  384: 'https://letsintern.notion.site/2026-38f5e77cbee180d7a77deab36a8ed88b',
};

/**
 * [LC-3219-MEMBERSHIP] 해당 기수의 노션 가이드 주소. 멤버십 기수가 아니면 undefined.
 * 정식 개발 시 서버 가이드 조회로 대체하고 이 함수는 지운다.
 */
export function membershipGuideUrl(programId: number): string | undefined {
  return MEMBERSHIP_GUIDE_URL_BY_CHALLENGE_ID[programId];
}

/**
 * 멤버십이 출시(결제 가능)된 상태인지 — 빌드 타임 env 로 결정되는 상수.
 * false 면(=env 미설정) CTA 를 "출시 전" 비활성 상태로 표시한다.
 */
export const IS_MEMBERSHIP_LAUNCHED = isValidMembershipChallengeId(
  MEMBERSHIP_CHALLENGE_ID,
);

/**
 * 멤버십 모집 종료 여부.
 *
 * `true` 면 랜딩 페이지 자체는 남겨두되 결제 진입만 막는다 — 링크를 아는 사람이 종료된
 * 상품을 결제하는 걸 방지하기 위해서다. 결제 CTA 는 랜딩에 3곳 있고(하단 고정 ApplyBar,
 * HeroSection, FinalCtaSection) 모두 이 상수를 통해 잠긴다.
 *
 * 2026 하반기 시즌(마감 2026-07-26) 종료로 `true` 였고, 신규 시즌 모집을 재개하며
 * `false` 로 되돌렸다. 시즌이 끝나면 다시 `true` 로 바꾸면 CTA 3곳이 한 번에 잠긴다.
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
