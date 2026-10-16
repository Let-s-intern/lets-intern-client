import useAuthStore from '@/store/useAuthStore';

/**
 * 오늘의 공고(오공고) 웹 주소. 비우면 운영 주소다 — 헤더의 오공고 링크가 늘 갈 곳이 있어야 해서
 * 값이 없다고 항목을 숨기지 않는다. 개발 서버로 보내 볼 때만 `.env.example` 대로 값을 넣는다.
 */
const OGONGGO_WEB_ORIGIN =
  process.env.NEXT_PUBLIC_OGONGGO_WEB_ORIGIN || 'https://ogonggo.co.kr';

/** 오공고가 로그인을 넘겨받는 경로. 해시 형식은 오공고 `AuthHandoffPage` 에 있다. */
const OGONGGO_HANDOFF_PATH = '/auth/handoff';

/** 오공고 쪽 유입 분석에서 렛츠커리어 헤더를 거쳐 온 방문을 가르는 값. 토큰 유무와 상관없이 늘 붙인다. */
const UTM_PARAMS = {
  utm_source: 'letscareer',
  utm_medium: 'referral',
  utm_campaign: 'service_toggle',
  utm_content: 'header_logo',
} as const;

/** 만료가 이 안으로 다가온 액세스 토큰은 오공고가 교환하러 가기 전에 만료될 수 있어 넘기지 않는다. */
const EXPIRY_MARGIN_MS = 30 * 1000;

function withUtm(url: URL): URL {
  for (const [key, value] of Object.entries(UTM_PARAMS)) {
    url.searchParams.set(key, value);
  }
  return url;
}

/** 토큰 없는 첫 화면. 서버 렌더와 새 탭 열기(가운데 버튼 등)의 `href` 로 쓴다. */
export const OGONGGO_WEB_HOME = withUtm(
  new URL('/', OGONGGO_WEB_ORIGIN),
).toString();

/**
 * 헤더의 오공고 링크가 가는 곳. 로그인해 있으면 `#__sso=<accessToken>|<refreshToken>` 을 붙여 오공고에서도
 * 로그인된 채로 열리게 한다. 오공고 계정이 없으면 오공고가 교환하면서 만든다.
 *
 * 오공고 → 렛츠커리어(오공고 `shared/api/letsCareerHandoff.ts`)와 같은 형식이고, 렛츠커리어가 admin·mentor 로
 * 넘길 때(`common/utils/crossAppUrl.ts`)도 같다. 프래그먼트라 서버 로그와 `Referer` 에 실리지 않고, 받는 쪽이
 * 읽자마자 주소에서 지운다.
 *
 * 누르는 순간 만든다. 토큰이 브라우저 저장소에만 있어 서버 렌더에서는 알 수 없고, `href` 에 미리 박아 두면
 * 로그아웃한 뒤에도 옛 토큰이 남는다.
 *
 * 로그아웃했거나 액세스 토큰이 만료됐으면 오공고 첫 화면만 연다.
 */
export function ogonggoWebHref(): string {
  const { isLoggedIn, accessToken, refreshToken, accessTokenExpiresAt } =
    useAuthStore.getState();
  if (
    !isLoggedIn ||
    !accessToken ||
    !refreshToken ||
    !accessTokenExpiresAt ||
    accessTokenExpiresAt - EXPIRY_MARGIN_MS <= Date.now()
  ) {
    return OGONGGO_WEB_HOME;
  }
  const url = withUtm(new URL(OGONGGO_HANDOFF_PATH, OGONGGO_WEB_ORIGIN));
  url.hash = `__sso=${encodeURIComponent(`${accessToken}|${refreshToken}`)}`;
  return url.toString();
}
