import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useAuthStore from '@/store/useAuthStore';

/**
 * OAuth 소셜 로그인 콜백 페이지.
 *
 * 백엔드가 `/login?result=<json>&redirect=<path>` 형태로 리다이렉트해주면
 * `result` JSON 에서 accessToken/refreshToken 을 꺼내 스토어에 저장하고
 * `redirect` 로 이동한다.
 *
 * 에러 시에는 에러 메시지를 노출하고 `/` 로 이동한다.
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoggedIn } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const redirect = searchParams.get('redirect') || '/';
    const errorParam = searchParams.get('error');
    const resultParam = searchParams.get('result');

    if (errorParam) {
      setErrorMessage('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    if (resultParam) {
      try {
        const parsed = JSON.parse(resultParam) as {
          accessToken?: string;
          refreshToken?: string;
          isNew?: boolean;
        };
        if (parsed.accessToken && parsed.refreshToken) {
          login(parsed.accessToken, parsed.refreshToken);
          navigate(redirect, { replace: true });
          return;
        }
        setErrorMessage('토큰 정보가 올바르지 않습니다.');
      } catch {
        setErrorMessage('토큰 파싱에 실패했습니다.');
      }
      return;
    }

    if (isLoggedIn) {
      navigate(redirect, { replace: true });
    }
  }, [searchParams, login, navigate, isLoggedIn]);

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-sm text-red-500">{errorMessage}</p>
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="bg-primary hover:bg-primary-hover mt-6 w-full rounded-xl py-3 text-sm font-medium text-white transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-neutral-40 text-sm">로그인 처리 중...</div>
    </div>
  );
}
