'use client';

import {
  emitSocialSigninSpan,
  runPasswordSigninSpan,
} from '@/domain/auth/utils/authSpan';
import { hashEmailPrefix } from '@/domain/auth/utils/hashEmail';
import { sanitizeRedirect } from '@/domain/auth/utils/sanitizeRedirect';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import { captureAuthError } from '@/utils/captureError';
import * as log from '@/utils/log';
import { ApiError } from '@letscareer/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

interface Token {
  accessToken: string;
  refreshToken: string;
  isNew: boolean;
}

interface SigninResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

function resolveErrorMessage(
  status: number | undefined,
  serverMessage: string | undefined,
): { message: string; isCredentialError: boolean } {
  if (status === 400 || status === 404) {
    // 자격증명 불일치 — 서버가 이메일/비밀번호 중 무엇이 틀렸는지 구분해주지 않으므로 중립 문구.
    return {
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
      isCredentialError: true,
    };
  }
  if (status === 401) {
    return {
      message: '인증에 실패했어요. 다시 시도하거나 비밀번호 찾기를 이용해주세요.',
      isCredentialError: false,
    };
  }
  if (status === 429) {
    return {
      message: '로그인 시도가 너무 많아요. 잠시 뒤에 다시 시도해주세요.',
      isCredentialError: false,
    };
  }
  if (status && status >= 500) {
    return {
      message: '서버에 일시적인 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
      isCredentialError: false,
    };
  }
  return {
    message: serverMessage ?? '로그인에 실패했어요. 네트워크 상태를 확인하고 다시 시도해주세요.',
    isCredentialError: false,
  };
}

const useLogin = () => {
  const { isLoggedIn, login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCredentialError, setHasCredentialError] = useState(false);
  const [isSocialCallbackPending, setIsSocialCallbackPending] = useState(false);

  const redirect = sanitizeRedirect(searchParams.get('redirect'));

  const buttonDisabled = !email || !password;

  const clearError = () => {
    setErrorMessage('');
    setHasCredentialError(false);
  };

  const fetchLogin = useMutation<SigninResponse>({
    mutationFn: async () =>
      runPasswordSigninSpan(async () => {
        const res = await axios.post('/user/signin', { email, password });
        return res.data;
      }),
    // 재시도 시 직전 에러 잔존 방지 — "다시 시도 중" 느낌을 준다.
    onMutate: clearError,
    onSuccess: async (data) => {
      const userIdHash = await hashEmailPrefix(email);
      log.signinSuccess('password', userIdHash);
      login(data.data.accessToken, data.data.refreshToken);
      router.push(redirect);
    },
    onError: async (error) => {
      // axios 인터셉터가 응답 에러를 ApiError로 래핑한다([packages/api/src/createAuthorizedAxios.ts]).
      // 네트워크 실패는 래핑되지 않고 raw AxiosError로 도착하므로 두 타입 모두 처리한다.
      let status: number | undefined;
      let serverMessage: string | undefined;
      let errorCode: string | undefined;

      if (error instanceof ApiError) {
        status = error.status;
        serverMessage = error.serverMessage;
        errorCode = error.code;
      } else if (error instanceof AxiosError) {
        status = error.response?.status;
        serverMessage = (error.response?.data as { message?: string })?.message;
        errorCode = error.code;
      }

      const { message, isCredentialError } = resolveErrorMessage(
        status,
        serverMessage,
      );
      setErrorMessage(message);
      setHasCredentialError(isCredentialError);

      const reason =
        status === 400 || status === 404
          ? 'invalid_credentials'
          : (errorCode ?? 'unknown');
      log.signinReject('password', reason, status);
      const emailHash = await hashEmailPrefix(email);
      captureAuthError(error, {
        section: 'signin',
        extra: { emailHash },
      });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled || fetchLogin.isPending) return;
    fetchLogin.mutate();
  };

  const handleEmailChange = (next: string) => {
    setEmail(next);
    if (errorMessage) clearError();
  };

  const handlePasswordChange = (next: string) => {
    setPassword(next);
    if (errorMessage) clearError();
  };

  // 소셜 로그인 콜백 처리 + 이미 로그인 상태일 때 리다이렉트.
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
      setIsSocialCallbackPending(false);
    };

    if (searchParams.get('error')) {
      setErrorMessage(
        '이미 가입된 휴대폰 번호예요. 기존 계정으로 로그인하거나 비밀번호 찾기를 이용해주세요.',
      );
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
      setIsSocialCallbackPending(true);
      const parsedToken = JSON.parse(searchParams.get('result') || '{}');
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
      setIsSocialCallbackPending(true);
    }

    // 소셜 콜백 처리(result/error)가 이미 redirect를 수행하므로 중복 push 방지.
    if (isLoggedIn && !searchParams.get('result') && !searchParams.get('error')) {
      router.push(redirect);
    }
  }, [searchParams, router, isLoggedIn, redirect, login]);

  return {
    email,
    password,
    errorMessage,
    hasCredentialError,
    buttonDisabled,
    isPending: fetchLogin.isPending,
    isSocialCallbackPending,
    redirect,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};

export default useLogin;
