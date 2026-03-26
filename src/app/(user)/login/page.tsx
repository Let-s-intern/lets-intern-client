'use client';

import Button from '@/common/button/Button';
import Input from '@/common/input/v1/Input';
import LoadingContainer from '@/common/loading/LoadingContainer';
import SocialLogin from '@/domain/auth/ui/SocialLogin';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
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

const LoginContent = () => {
  const { isLoggedIn, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const redirect: string = searchParams.get('redirect') || '/';

  const fetchLogin = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/user/signin', {
        email,
        password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      login(data.data.accessToken, data.data.refreshToken);
      router.push(redirect);
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (
        axiosError.response?.status === 400 ||
        axiosError.response?.status === 404
      ) {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
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
      return;
    }

    if (searchParams.get('result')) {
      setIsLoading(true);
      const parsedToken = searchParams.get('result')
        ? JSON.parse(searchParams.get('result') || '{}')
        : null;
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
  }, [searchParams, router, isLoggedIn, redirect, login]);

  return (
    <>
      <main className="mx-auto min-h-screen px-4 sm:max-w-md">
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
