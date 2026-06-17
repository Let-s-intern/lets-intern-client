'use client';

import Button from '@/common/button/Button';
import Input from '@/common/input/v1/Input';
import LoadingContainer from '@/common/loading/LoadingContainer';
import useLogin from '@/domain/auth/hooks/useLogin';
import SocialLogin from '@/domain/auth/ui/SocialLogin';
import TextLink from '@/domain/auth/ui/TextLink';

const LoginPage = () => {
  const {
    email,
    password,
    errorMessage,
    hasCredentialError,
    buttonDisabled,
    isPending,
    isSocialCallbackPending,
    redirect,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useLogin();

  return (
    <>
      <main className="mx-auto px-4 sm:max-w-md">
        <header>
          <h1 className="mb-8 mt-12 text-center text-xl font-semibold">
            반갑습니다!
          </h1>
        </header>
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
        <SocialLogin type="LOGIN" />
        <div className="mt-8 flex justify-center gap-8">
          <TextLink to={`/signup?redirect=${encodeURIComponent(redirect)}`}>
            회원가입
          </TextLink>
          <TextLink to="/find-password" dark>
            비밀번호 찾기
          </TextLink>
        </div>
      </main>
      {isSocialCallbackPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <LoadingContainer />
        </div>
      )}
    </>
  );
};

export default LoginPage;
