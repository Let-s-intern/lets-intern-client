/**
 * 오늘의 공고(오공고) 웹 주소. 비우면 운영 주소다 — 헤더의 오공고 링크가 늘 갈 곳이 있어야 해서
 * 값이 없다고 항목을 숨기지 않는다. 개발 서버로 보내 볼 때만 `.env.example` 대로 값을 넣는다.
 */
const OGONGGO_WEB_ORIGIN =
  process.env.NEXT_PUBLIC_OGONGGO_WEB_ORIGIN || 'https://ogonggo.co.kr';

/** 오공고 쪽 유입 분석에서 렛츠커리어 헤더를 거쳐 온 방문을 가르는 값. */
const UTM_PARAMS = {
  utm_source: 'letscareer',
  utm_medium: 'referral',
  utm_campaign: 'service_toggle',
  utm_content: 'header_logo',
} as const;

function ogonggoHomeUrl(): string {
  const url = new URL('/', OGONGGO_WEB_ORIGIN);
  for (const [key, value] of Object.entries(UTM_PARAMS)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

/** 헤더의 오공고 링크가 가는 곳. 로그인은 넘기지 않는다(토큰 없는 첫 화면). */
export const OGONGGO_WEB_HOME = ogonggoHomeUrl();
