/**
 * 등록 폼의 허용 URL 검증 (LC-3208).
 *
 * **이것은 UX 장치이지 보안 경계가 아니다.** 실제 신뢰 경계는 서버의
 * `isAllowedRedirectUri`(server Push 1)이고, SSO 로그인 시 리다이렉트 허용 여부는
 * 거기서만 판정된다. 여기서 걸러 주는 이유는 오타 난 값이 DB 에 들어가면
 * 로그인이 조용히 실패하고 원인을 화이트리스트에서 찾기 어렵기 때문이다.
 */

/**
 * http 를 허용하는 호스트.
 *
 * 전부 https 만 받으면 개발자가 자기 로컬 콜백을 등록하지 못한다. 반대로 http 를
 * 통째로 열면 평문 리다이렉트에 토큰이 실린다(PRD 확정 사항 7 — 토큰은 URL 쿼리로 간다).
 */
const HTTP_ALLOWED_HOSTS = new Set(['localhost', '127.0.0.1']);

/** 문제가 없으면 null, 있으면 화면에 그대로 띄울 한국어 사유. */
export const validateRedirectUri = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return '허용 URL을 입력해 주세요.';

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    // 스킴이 없으면 `new URL` 이 실패한다. `vod.letscareer.co.kr/auth/callback` 같은 값이 여기 걸린다.
    return 'https://로 시작하는 전체 주소를 입력해 주세요.';
  }

  if (url.protocol === 'https:') return null;

  if (url.protocol === 'http:' && HTTP_ALLOWED_HOSTS.has(url.hostname)) {
    return null;
  }

  if (url.protocol === 'http:') {
    return 'http는 localhost에서만 등록할 수 있습니다. 그 외에는 https 주소를 입력해 주세요.';
  }

  return 'http 또는 https 주소만 등록할 수 있습니다.';
};
