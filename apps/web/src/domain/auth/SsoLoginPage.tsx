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
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-[360px] text-center">
          <p className="text-xsmall14 text-neutral-40">
            이동할 서비스 정보가 없습니다. 로그인 버튼을 눌렀던 곳에서 다시
            시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    // 이 화면은 팝업 창 안에서 단독으로 뜬다(구글 OAuth 동의 창과 같은 형태). 창 자체가
    // 이미 경계 역할을 하므로 카드 테두리·그림자·회색 배경을 두지 않는다 — 창 안에 또 카드가
    // 떠 있으면 액자 속 액자가 된다. 로고·네비가 없는 것은 렛츠커리어 사이트라는 티를
    // 내지 않기 위함이고, 이건 그대로 유지한다.
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-[360px]">
        {/*
          팝업 창(500x650)에서 단독으로 읽히는 제목이다. 18px 는 그 크기의 창에서 화면
          주인공으로 서지 못해 24px 로 올린다. 부제는 이 창이 무엇을 하는 곳인지 한 줄로만
          말한다 — 창을 연 서비스 이름은 제목이 이미 들고 있다.
        */}
        <div className="mb-8 text-center">
          <h1 className="text-medium24 text-neutral-0 font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-xsmall14 text-neutral-40 mt-2">
            렛츠커리어 계정으로 계속합니다
          </p>
        </div>

        {isRedirectUriError ? (
          // 화이트리스트에 없는 서비스다 — 다시 시도해도 결과가 같으므로 폼을 보여주지 않는다.
          <p
            role="alert"
            className="rounded-ms text-xsmall14 bg-red-50 p-4 text-center font-medium text-red-600"
          >
            {errorMessage}
          </p>
        ) : (
          <>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                className="text-xsmall14 min-h-5 text-center font-medium text-red-600"
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
                  <div className="bg-neutral-90 h-px flex-1" />
                  <span className="text-xxsmall12 text-neutral-45">또는</span>
                  <div className="bg-neutral-90 h-px flex-1" />
                </div>
                <div className="flex gap-4">
                  <a
                    className="shadow-02 hover:shadow-03 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE500] transition-transform hover:scale-105"
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
                    className="shadow-02 hover:shadow-03 flex h-12 w-12 items-center justify-center rounded-full bg-[#2db400] transition-transform hover:scale-105"
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
