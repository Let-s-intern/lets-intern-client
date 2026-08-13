'use client';

import { resolveErrorMessage } from '@/domain/auth/utils/resolveErrorMessage';
import axios from '@/utils/axios';
import { captureAuthError } from '@/utils/captureError';
import { ApiError } from '@letscareer/api/errors';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface SsoAuthenticateResponse {
  data: {
    redirectUrl: string;
  };
}

const SSO_REDIRECT_URI_MISMATCH_CODE = 'SSO_REDIRECT_URI_MISMATCH';

const useSsoLogin = () => {
  const searchParams = useSearchParams();
  // 화이트리스트 검증은 서버(server Push 2)에서만 한다 — 여기서 형식만 봐도 결국
  // 서버가 다시 검증하므로, 프론트가 흉내 내면 두 곳을 유지하게 되어 어긋날 위험만 커진다.
  const redirectUri = searchParams.get('redirect_uri');
  // 화면에 "{서비스명} 로그인"으로만 보이게 하기 위한 표시용 값 — 인증 로직과는 무관하다.
  const serviceName = searchParams.get('service_name');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCredentialError, setHasCredentialError] = useState(false);
  // 화이트리스트 미검증은 다시 시도해도 결과가 같다 — 폼을 막아 재시도를 유도하지 않는다.
  const [isRedirectUriError, setIsRedirectUriError] = useState(false);

  const buttonDisabled = !email || !password || !redirectUri;

  const clearError = () => {
    setErrorMessage('');
    setHasCredentialError(false);
  };

  const fetchSsoLogin = useMutation<SsoAuthenticateResponse>({
    mutationFn: async () => {
      const res = await axios.post('/sso/authenticate', {
        email,
        password,
        redirectUri,
      });
      return res.data;
    },
    onMutate: clearError,
    onSuccess: (data) => {
      // router.push 는 앱 내부 라우팅 전용이라 외부 도메인으로 이동할 수 없다.
      // 서버가 화이트리스트 검증까지 마치고 내려준 URL이라 그대로 이동한다.
      window.location.href = data.data.redirectUrl;
    },
    onError: (error) => {
      let status: number | undefined;
      let serverMessage: string | undefined;
      let errorCode: string | undefined;

      if (error instanceof ApiError) {
        status = error.status;
        serverMessage = error.serverMessage;
        errorCode = error.code;
      } else if (error instanceof AxiosError) {
        status = error.response?.status;
        serverMessage = (error.response?.data as { message?: string })
          ?.message;
        errorCode = error.code;
      }

      if (errorCode === SSO_REDIRECT_URI_MISMATCH_CODE) {
        setIsRedirectUriError(true);
        setErrorMessage(
          '등록되지 않은 서비스입니다. 서비스 운영자에게 문의해주세요.',
        );
        captureAuthError(error, { section: 'sso-signin-redirect-uri' });
        return;
      }

      const { message, isCredentialError } = resolveErrorMessage(
        status,
        serverMessage,
      );
      setErrorMessage(message);
      setHasCredentialError(isCredentialError);
      captureAuthError(error, { section: 'sso-signin' });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisabled || fetchSsoLogin.isPending || isRedirectUriError)
      return;
    fetchSsoLogin.mutate();
  };

  const handleEmailChange = (next: string) => {
    setEmail(next);
    if (errorMessage) clearError();
  };

  const handlePasswordChange = (next: string) => {
    setPassword(next);
    if (errorMessage) clearError();
  };

  return {
    email,
    password,
    errorMessage,
    hasCredentialError,
    isRedirectUriError,
    isMissingRedirectUri: !redirectUri,
    redirectUri,
    serviceName,
    buttonDisabled,
    isPending: fetchSsoLogin.isPending,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};

export default useSsoLogin;
