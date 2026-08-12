'use client';

import Button from '@/common/button/Button';
import Input from '@/common/input/v1/Input';
import useSsoLogin from '@/domain/auth/hooks/useSsoLogin';

const SsoLoginPage = () => {
  const {
    email,
    password,
    errorMessage,
    hasCredentialError,
    isRedirectUriError,
    isMissingRedirectUri,
    buttonDisabled,
    isPending,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useSsoLogin();

  // redirect_uri 자체가 없으면 서버에 물어볼 것도 없다 — 어디로도 보낼 수 없는 요청이다.
  if (isMissingRedirectUri) {
    return (
      <main className="mx-auto px-4 py-12 sm:max-w-md">
        <h1 className="mb-4 text-center text-xl font-semibold">
          잘못된 접근입니다
        </h1>
        <p className="text-center text-sm text-gray-600">
          이동할 서비스 정보가 없습니다. 로그인 버튼을 눌렀던 서비스에서 다시
          시도해주세요.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto px-4 sm:max-w-md">
      <header>
        <h1 className="mb-8 mt-12 text-center text-xl font-semibold">
          렛츠커리어 계정으로 로그인
        </h1>
      </header>

      {isRedirectUriError ? (
        // 화이트리스트에 없는 서비스다 — 다시 시도해도 결과가 같으므로 폼을 보여주지 않는다.
        <p
          role="alert"
          className="rounded-md bg-red-50 p-4 text-center text-sm font-medium text-red-600"
        >
          {errorMessage}
        </p>
      ) : (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="이메일"
            value={email}
            error={hasCredentialError}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          <Input
            type="password"
            label="비밀번호"
            value={password}
            error={hasCredentialError}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          {/* 박스를 항상 렌더해 레이아웃 시프트 방지. 빈 상태에서도 한 줄 높이를 차지한다. */}
          <p
            role="alert"
            aria-live="polite"
            className="min-h-5 text-center text-sm font-medium text-red-600"
          >
            {errorMessage && !isPending ? errorMessage : ''}
          </p>
          <Button type="submit" disabled={buttonDisabled || isPending}>
            {isPending ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      )}
    </main>
  );
};

export default SsoLoginPage;
