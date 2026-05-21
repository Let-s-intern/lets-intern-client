'use client';

import Button from '@/common/button/Button';
import Input from '@/common/input/v1/Input';
import LoadingContainer from '@/common/loading/LoadingContainer';
import SocialLogin from '@/domain/auth/ui/SocialLogin';
import {
  emitSocialSigninSpan,
  runPasswordSigninSpan,
} from '@/domain/auth/utils/authSpan';
import useAuthStore from '@/store/useAuthStore';
import { captureAuthError } from '@/utils/captureError';
import * as log from '@/utils/log';
import axios from '@/utils/axios';
import { useToast } from '@letscareer/ui';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Token {
  accessToken: string;
  refreshToken: string;
  isNew: boolean;
}

interface TextLinkProps {
  to: string;
  className?: string;
  dark?: boolean;
  children: React.ReactNode;
}

const TextLink = ({ to, dark, className, children }: TextLinkProps) => {
  return (
    <Link
      href={to}
      className={twMerge(
        'text-sm underline',
        dark ? 'text-neutral-grey' : 'text-primary',
        className,
      )}
    >
      {children}
    </Link>
  );
};

/** 이메일을 sha256으로 해시하여 앞 8자만 반환 (PII 회피) */
async function hashEmailPrefix(email: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex.slice(0, 8);
  } catch {
    return 'unknown';
  }
}

const LoginContent = () => {
  const { isLoggedIn, login } = useAuthStore();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const redirect: string = searchParams.get('redirect') || '/';

  const fetchLogin = useMutation({
    mutationFn: async () =>
      runPasswordSigninSpan(async () => {
        const res = await axios.post('/user/signin', {
          email,
          password,
        });
        return res.data;
      }),
    onSuccess: async (data) => {
      const userIdHash = await hashEmailPrefix(email);
      log.signinSuccess('password', userIdHash);
      login(data.data.accessToken, data.data.refreshToken);
      router.push(redirect);
    },
    onError: async (error) => {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const serverMessage = (axiosError.response?.data as { message?: string })
        ?.message;

      if (status === 400 || status === 404) {
        // 자격증명 불일치 — 입력 자체 문제. 인라인 + toast 동시 노출.
        // 서버는 이메일/비밀번호 중 무엇이 틀렸는지 구분해주지 않으므로 중립 문구 사용.
        const inlineText = '이메일 또는 비밀번호가 일치하지 않습니다.';
        setErrorMessage(inlineText);
        toast.error('로그인 정보가 올바르지 않습니다', {
          description: '입력하신 이메일과 비밀번호를 다시 확인해주세요.',
        });
      } else if (status === 401) {
        toast.error('인증에 실패했습니다', {
          description:
            '다시 시도해주세요. 문제가 계속되면 비밀번호 찾기를 이용해주세요.',
        });
      } else if (status === 429) {
        toast.error('잠시 후 다시 시도해주세요', {
          description:
            '로그인 시도가 너무 많아요. 잠시 뒤에 다시 시도해주세요.',
        });
      } else if (status && status >= 500) {
        toast.error('서버에 일시적인 문제가 발생했어요', {
          description:
            '잠시 후 다시 시도해주세요. 계속되면 고객센터에 문의해주세요.',
        });
      } else {
        toast.error('로그인에 실패했습니다', {
          description:
            serverMessage ?? '네트워크 상태를 확인하고 다시 시도해주세요.',
        });
      }

      const reason =
        status === 400 || status === 404
          ? 'invalid_credentials'
          : (axiosError.code ?? 'unknown');
      log.signinReject('password', reason, status);
      const emailHash = await hashEmailPrefix(email);
      captureAuthError(error, {
        section: 'signin',
        extra: { emailHash },
      });
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled) return;
    fetchLogin.mutate();
  };

  // 비밀번호, 이메일 입력 시 버튼 활성화
  useEffect(() => {
    if (!email || !password) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [email, password]);

  useEffect(() => {
    const handleLoginSuccess = (token: Token) => {
      if (token.isNew) {
        router.push(
          `/signup?result=${encodeURIComponent(JSON.stringify(token))}&redirect=${encodeURIComponent(redirect)}`,
        );
      } else {
        login(token.accessToken, token.refreshToken);
        router.push(redirect);
      }
      setIsLoading(false);
    };

    if (searchParams.get('error')) {
      setErrorMessage('이미 가입된 휴대폰 번호입니다.');
      toast.error('이미 가입된 휴대폰 번호예요', {
        description:
          '같은 번호로 가입된 계정이 있어요. 기존 계정으로 로그인하거나 비밀번호 찾기를 이용해주세요.',
      });
      const provider = searchParams.get('provider') ?? 'unknown';
      const reason = searchParams.get('error') ?? 'unknown';
      emitSocialSigninSpan({ result: 'fail', provider, reason });
      log.socialCallbackError(provider, reason);
      captureAuthError(new Error(`소셜 로그인 콜백 에러: ${reason}`), {
        section: 'social-callback',
        tags: { provider },
        extra: { reason },
      });
      return;
    }

    if (searchParams.get('result')) {
      setIsLoading(true);
      const parsedToken = searchParams.get('result')
        ? JSON.parse(searchParams.get('result') || '{}')
        : null;
      emitSocialSigninSpan({ result: 'success' });
      // Next.js에서는 searchParams를 직접 변경할 수 없으므로 router.replace 사용
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('result');
      newSearchParams.set('isLoading', 'true');
      router.replace(`/login?${newSearchParams.toString()}`);
      handleLoginSuccess(parsedToken);
      return;
    }

    if (searchParams.get('isLoading')) {
      setIsLoading(true);
    }

    if (isLoggedIn) {
      router.push(redirect);
      return;
    }
  }, [searchParams, router, isLoggedIn, redirect, login, toast]);

  return (
    <>
      <main className="mx-auto px-4 sm:max-w-md">
        <header>
          <h1 className="mb-8 mt-12 text-center text-xl font-semibold">
            반갑습니다!
          </h1>
        </header>
        <form className="flex flex-col gap-2" onSubmit={handleLogin}>
          <Input
            type="email"
            label="이메일"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          {errorMessage && (
            <span className="text-center text-sm font-medium text-red-600">
              {errorMessage}
            </span>
          )}
          <Button type="submit" disabled={buttonDisabled}>
            로그인
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
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <LoadingContainer />
        </div>
      )}
    </>
  );
};

const Login = () => {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
