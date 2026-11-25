/**
 * 구매 창이 끝난 뒤 돌아갈 주소(returnUrl) 검증. 허용 목록 없이 쿼리를 그대로 쓰면 아무 주소로
 * 보내는 오픈 리다이렉트가 된다. 허용 목록은 서버 SsoRedirectWhitelist(로그인 리다이렉트용, 어드민이
 * 관리) 대신 클라이언트 설정으로 둔다. 허용할 곳이 오공고 하나이고 서버 변경을 만들지 않기 위해서다.
 */

/** 오공고 웹 주소. 헤더의 오공고 링크(ogonggoHref)와 같은 환경 변수를 쓰고, 비우면 운영 주소다 */
const OGONGGO_WEB_ORIGIN =
  process.env.NEXT_PUBLIC_OGONGGO_WEB_ORIGIN || 'https://ogonggo.co.kr';

const ALLOWED_RETURN_ORIGINS = [new URL(OGONGGO_WEB_ORIGIN).origin];

/**
 * 허용된 주소면 그 주소를, 아니면 null 을 돌려준다.
 * 절대 https 주소이고 origin 이 허용 목록과 정확히 같아야 한다. 상대 경로, 프로토콜 상대 주소(//evil.com),
 * 사용자 정보가 붙은 주소, 도메인 뒤에 이어 붙인 주소(ogonggo.co.kr.evil.com)는 모두 거른다.
 */
export const parseReturnUrl = (
  value: string | null | undefined,
  allowedOrigins: readonly string[] = ALLOWED_RETURN_ORIGINS,
): string | null => {
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  if (!allowedOrigins.includes(url.origin)) return null;

  return url.toString();
};
