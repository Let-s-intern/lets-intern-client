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
// 로그인 후 REDIRECT_URI 로 ?token= 이 돌아온다. 이 토큰은 검증 없이 믿으면 안 된다.
// 검증: GET {렛츠커리어 API}/api/v2/user/sso-profile  (Authorization: Bearer {token})
//       성공해야 유효한 토큰이다. 서명 키는 공유하지 않는다 — 검증은 렛츠커리어 서버가 한다.
// 전체 연동 방법은 어드민의 "연동 AI 프롬프트 복사" 를 AI 에게 붙여 넣으면 된다.

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

/**
 * 외부 서비스 개발자가 AI 에게 그대로 붙여 넣는 연동 프롬프트.
 *
 * 연동 코드만 주면 AI 는 "토큰이 진짜인지 확인할 방법"을 모른 채 멈춘다. 검증 API 와
 * 콜백 처리까지 한 번에 담아, 별도 문서를 받지 않아도 끝까지 만들 수 있게 한다.
 * 근거 문서: .claude/docs/letscareer/sso-popup-integration.md
 */
export function buildAiPrompt({
  allowedRedirectUri,
  serviceName,
  ssoOrigin = DEFAULT_SSO_ORIGIN,
  apiBase,
}: {
  allowedRedirectUri: string;
  serviceName: string;
  ssoOrigin?: string;
  /** 렛츠커리어 API v2 기준 주소. 절대 주소가 아니면 담당자 확인으로 안내한다. */
  apiBase?: string;
}): string {
  const profileUrl = apiBase?.startsWith('http')
    ? `${apiBase.replace(/\/$/, '')}/user/sso-profile`
    : '{렛츠커리어 API 주소}/api/v2/user/sso-profile (주소는 렛츠커리어 담당자에게 확인)';

  return `${serviceName} 에 "렛츠커리어 계정으로 로그인" 기능을 붙여 줘. 렛츠커리어 SSO 팝업 방식이야.

## 전제
- 로그인 버튼: ${quote(ssoOrigin)} 의 /sso/login 을 팝업(500x650)으로 연다. 코드는 아래 "팝업 코드" 를 쓴다.
- 로그인이 끝나면 팝업이 ${allowedRedirectUri} 로 돌아온다. 이 주소는 이미 렛츠커리어에 등록돼 있다. 한 글자도 바꾸지 마라(완전일치 비교다).
- 모바일(너비 768 미만)은 팝업 대신 전체 페이지 이동으로 폴백한다.

## 콜백 처리 (${allowedRedirectUri})
1. 쿼리는 두 형식 중 하나로 온다. 둘 다 처리해야 소셜 로그인이 된다.
   - ?token=...&refreshToken=...  (이메일·비밀번호)
   - ?result={"accessToken":"...","refreshToken":"..."}  (카카오·네이버)
2. 토큰을 아래 "토큰 검증" 으로 확인한 뒤에만 로그인 처리한다.
3. 토큰은 httpOnly 쿠키에 저장한다. localStorage 에 두지 마라(XSS 로 유출된다).
4. 팝업이면 302 리다이렉트를 하지 말고, opener 에 postMessage({type:'letscareer-sso:result', ok:true}, 내 서비스 오리진) 를 보낸 뒤 window.close() 하는 HTML 을 200 으로 응답한다. targetOrigin 에 '*' 를 쓰지 마라. 응답에 Cache-Control: no-store 를 붙인다.
5. opener 쪽은 message 이벤트에서 event.origin 이 자기 오리진인지 확인한 뒤 화면을 갱신한다.

## 토큰 검증 (가장 중요)
토큰은 "회원 번호와 권한이 적힌 종이" 일 뿐이다. 서명을 우리가 확인할 수 없으니 렛츠커리어 서버에 물어본다.

  GET ${profileUrl}
  Authorization: Bearer {accessToken}

- 성공(200)이면 유효한 토큰이다. 응답에 회원 정보가 담겨 있다.
- 실패(401 등)면 로그인시키지 말고 쿠키를 지운다.
- 이 검증 없이 쿠키 존재만으로 로그인 판정하지 마라. 주소창에 가짜 token 을 넣어 누구나 관리자로 들어올 수 있게 된다.
- JWT 서명 키는 요구하지 마라. 렛츠커리어는 키를 공유하지 않고, 검증은 위 API 가 맡는다.
- 보호가 필요한 요청마다 이 검증(또는 검증을 거친 세션)을 통과해야 한다.

## 팝업 코드
\`\`\`js
${buildPopupSnippet({ allowedRedirectUri, serviceName, ssoOrigin })}\`\`\`

모르는 값(API 주소 등)이 있으면 추측해서 만들지 말고 나에게 물어봐.
`;
}
