/**
 * 화이트리스트에 등록된 URL 로 SSO 연동 스니펫을 만든다.
 *
 * 이 URL 은 서버가 scheme·host·port·path·query·fragment 까지 완전일치로 비교한다
 * (SsoRedirectWhitelistServiceImpl#isSameUri). 사람이 손으로 옮겨 적다 슬래시 하나만
 * 틀려도 그 서비스의 로그인이 통째로 막히고, 에러 메시지만 봐서는 어디가 틀렸는지
 * 알기 어렵다. 그래서 등록된 값을 그대로 복사해 가게 한다.
 */

const DEFAULT_SSO_ORIGIN = 'https://letscareer.co.kr';

/** 스니펫 안에 문자열로 박히는 값이라 따옴표·줄바꿈이 섞이면 코드가 깨진다. */
const quote = (value: string) => JSON.stringify(value);

export function buildPopupSnippet({
  allowedRedirectUri,
  serviceName,
  ssoOrigin = DEFAULT_SSO_ORIGIN,
}: {
  allowedRedirectUri: string;
  serviceName: string;
  ssoOrigin?: string;
}): string {
  return `// 렛츠커리어 SSO 팝업 로그인 — ${serviceName}
// 붙이는 방법 전체: .claude/docs/letscareer/sso-popup-integration.md

const REDIRECT_URI = ${quote(allowedRedirectUri)};
const SSO_ORIGIN = ${quote(ssoOrigin)};

function openLetscareerLogin() {
  const url =
    SSO_ORIGIN +
    '/sso/login?redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
    '&service_name=' + encodeURIComponent(${quote(serviceName)});

  // 모바일은 팝업을 쓰지 않는다. window.close() 가 동작하지 않는 브라우저가 있다.
  if (window.innerWidth < 768) {
    window.location.href = url;
    return;
  }

  // 클릭 핸들러 안에서 동기적으로 연다. 앞에 await 이 끼면 사용자 제스처가 소실돼 차단된다.
  const width = 500;
  const height = 650;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const popup = window.open(
    url,
    'letscareer-sso',
    'popup=yes,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top,
  );

  // 팝업 차단. 조용히 실패하면 버튼이 고장난 것처럼 보인다.
  if (!popup) window.location.href = url;
  return popup;
}

// 팝업이 로그인 후 REDIRECT_URI 로 돌아온다. 그 라우트에서 토큰을 httpOnly 쿠키에 심고
// (?token=&refreshToken= 또는 ?result={...} 두 형식이 온다) opener 에 알린 뒤 창을 닫는다.
window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;   // 오리진 확인은 반드시
  if (event.data?.type !== 'letscareer-sso:result') return;
  if (event.data.ok) location.reload();
});
`;
}
