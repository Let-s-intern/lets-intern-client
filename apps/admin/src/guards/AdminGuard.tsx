import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useIsAdminQuery, useIsMentorQuery } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';

/**
 * 어드민 페이지 접근 제어:
 * 1. 미로그인 → 로그인 폼 직접 표시 (LoginPrompt)
 * 2. 로그인 + 어드민/멘토 모두 아님 → 권한 안내 화면 (NotAdminPrompt)
 * 3. 로그인 + 어드민/멘토 → children 렌더링
 *
 * 독립 서브도메인(admin.*)에서 동작하므로 navigate('/')로 리다이렉트하지 않는다.
 * 루트도 AdminGuard 영향권이라 무한 루프 위험.
 */
export const AdminGuard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isLoggedIn, isInitialized } = useAuthStore();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdminQuery({
    enabled: isLoggedIn,
  });
  const { data: isMentor, isLoading: isMentorLoading } = useIsMentorQuery({
    enabled: isLoggedIn,
  });

  // 스토어 초기화 대기
  if (!isInitialized) return null;

  // 1. 미로그인
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  // 로딩 중
  if (isAdminLoading || isMentorLoading) return null;

  // 2. 로그인했지만 어드민/멘토 아님
  if (!isAdmin && !isMentor) {
    return <NotAdminPrompt />;
  }

  // 3. 어드민/멘토
  return <>{children}</>;
};

/** 미로그인 시 로그인 폼 직접 표시 */
const LoginPrompt = () => {
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const buttonDisabled = !email || !password;

  const fetchLogin = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/user/signin', { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      login(data.data.accessToken, data.data.refreshToken);
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (
        axiosError.response?.status === 400 ||
        axiosError.response?.status === 404
      ) {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buttonDisabled) return;
    setErrorMessage('');
    fetchLogin.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <img
            src="/logo/horizontal-logo.svg"
            alt="렛츠커리어"
            className="mx-auto mb-4 h-6"
          />
          <h1 className="text-lg font-bold text-neutral-900">어드민 로그인</h1>
          <p className="mt-1 text-sm text-neutral-500">
            어드민 페이지에 접속하려면 로그인이 필요합니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-email"
              className="text-xs font-medium text-neutral-600"
            >
              이메일
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="focus:border-primary focus:ring-primary rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:ring-1"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-password"
              className="text-xs font-medium text-neutral-600"
            >
              비밀번호
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="focus:border-primary focus:ring-primary rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:ring-1"
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <p className="text-center text-sm font-medium text-red-500">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={buttonDisabled || fetchLogin.isPending}
            className="bg-primary hover:bg-primary-hover mt-1 rounded-xl py-3 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {fetchLogin.isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

/** 로그인했지만 어드민/멘토 권한 없을 때 */
const NotAdminPrompt = () => {
  const { logout } = useAuthStore();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-2 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-amber-500"
            >
              <path
                d="M12 9v4m0 4h.01"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-neutral-900">
            어드민 전용 페이지입니다
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            이 페이지는 어드민 권한이 있는 계정만 접근할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={logout}
            className="bg-primary hover:bg-primary-hover rounded-xl py-3 text-sm font-medium text-white transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};
