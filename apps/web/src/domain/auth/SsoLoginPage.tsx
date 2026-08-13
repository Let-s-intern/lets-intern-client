'use client';

import Button from '@/common/button/Button';
import Input from '@/common/input/v1/Input';
import useSsoLogin from '@/domain/auth/hooks/useSsoLogin';

function buildSocialLoginHref(
  provider: 'kakao' | 'naver',
  redirectUri: string,
): string {
  const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH;
  if (!basePath) return '#';
  // OAuth2AuthenticationSuccessHandler 가 이 redirect_uri 쿼리를 쿠키에 담아뒀다가
  // 로그인 성공 후 그대로 돌려보낸다 — SSO 화이트리스트(DB)에도 등록돼 있어야 통과한다.
  return `${basePath}/oauth2/authorize/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
}

const SsoLoginPage = () => {
  const {
    email,
    password,
    errorMessage,
    hasCredentialError,
    isRedirectUriError,
    isMissingRedirectUri,
    redirectUri,
    serviceName,
    buttonDisabled,
    isPending,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useSsoLogin();

  const title = serviceName ? `${serviceName} 로그인` : '로그인';

  // redirect_uri 자체가 없으면 서버에 물어볼 것도 없다 — 어디로도 보낼 수 없는 요청이다.
  if (isMissingRedirectUri) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-95 px-4">
        <div className="w-full max-w-[360px] rounded-xl border border-neutral-90 bg-white p-8 text-center shadow-04">
          <p className="text-xsmall14 text-neutral-40">
            이동할 서비스 정보가 없습니다. 로그인 버튼을 눌렀던 곳에서 다시
            시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    // 렛츠커리어 사이트라는 티가 나면 안 된다 — 로고·네비 없이 모달 크기의 카드 하나만
    // 화면 가운데에 고정한다. 배경은 중립색이라 뒤에 다른 사이트가 있어도 위화감이 적다.
    <div className="flex min-h-screen items-center justify-center bg-neutral-95 px-4">
      <div className="w-full max-w-[360px] rounded-xl border border-neutral-90 bg-white p-8 shadow-04">
        <h1 className="mb-7 text-center text-small18 font-semibold text-neutral-0">
          {title}
        </h1>

        {isRedirectUriError ? (
          // 화이트리스트에 없는 서비스다 — 다시 시도해도 결과가 같으므로 폼을 보여주지 않는다.
          <p
            role="alert"
            className="rounded-ms bg-red-50 p-4 text-center text-xsmall14 font-medium text-red-600"
          >
            {errorMessage}
          </p>
        ) : (
          <>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Input
                type="email"
                label="이메일"
                value={email}
                error={hasCredentialError}
                alwaysShrinkLabel
                onChange={(e) => handleEmailChange(e.target.value)}
              />
              <Input
                type="password"
                label="비밀번호"
                value={password}
                error={hasCredentialError}
                alwaysShrinkLabel
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              {/* 박스를 항상 렌더해 레이아웃 시프트 방지. 빈 상태에서도 한 줄 높이를 차지한다. */}
              <p
                role="alert"
                aria-live="polite"
                className="min-h-5 text-center text-xsmall14 font-medium text-red-600"
              >
                {errorMessage && !isPending ? errorMessage : ''}
              </p>
              <Button
                type="submit"
                className="rounded-ms shadow-button"
                disabled={buttonDisabled || isPending}
              >
                {isPending ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            {redirectUri && (
              <div className="mt-7 flex flex-col items-center">
                <div className="mb-5 flex w-full items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-90" />
                  <span className="text-xxsmall12 text-neutral-45">또는</span>
                  <div className="h-px flex-1 bg-neutral-90" />
                </div>
                <div className="flex gap-4">
                  <a
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FEE500] shadow-02 transition-transform hover:scale-105 hover:shadow-03"
                    href={buildSocialLoginHref('kakao', redirectUri)}
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/icons/kakao-icon.svg"
                      alt="카카오 로그인"
                      className="w-5"
                    />
                  </a>
                  <a
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2db400] shadow-02 transition-transform hover:scale-105 hover:shadow-03"
                    href={buildSocialLoginHref('naver', redirectUri)}
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/icons/naver-icon.svg"
                      alt="네이버 로그인"
                      className="h-4 w-4"
                    />
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SsoLoginPage;
