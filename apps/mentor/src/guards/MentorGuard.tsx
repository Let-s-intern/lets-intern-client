import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useIsMentorQuery } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';

/**
 * 멘토 페이지 접근 제어:
 * 1. 미로그인 → 로그인 폼 직접 표시
 * 2. 로그인 + 멘토 아님 → 권한 안내 화면
 * 3. 로그인 + 멘토 → children 렌더링
 */
export const MentorGuard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn, isInitialized } = useAuthStore();

  const { data: isMentor, isLoading } = useIsMentorQuery({
    enabled: isLoggedIn,
  });

  // 스토어 초기화 대기
  if (!isInitialized) return null;

  // 1. 미로그인
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  // 로딩 중
  if (isLoading) return null;

  // 2. 로그인했지만 멘토 아님
  if (!isMentor) {
    return <NotMentorPrompt onGoBack={() => navigate(-1)} />;
  }

  // 3. 멘토
  return <>{children}</>;
};

/** 미로그인 시 로그인 폼 직접 표시 */
const LoginPrompt = () => {
  const navigate = useNavigate();
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
          <h1 className="text-lg font-bold text-neutral-900">멘토 로그인</h1>
          <p className="mt-1 text-sm text-neutral-500">
            멘토 마이페이지에 접속하려면 로그인이 필요합니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="mentor-email"
              className="text-xs font-medium text-neutral-600"
            >
              이메일
            </label>
            <input
              id="mentor-email"
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
              htmlFor="mentor-password"
              className="text-xs font-medium text-neutral-600"
            >
              비밀번호
            </label>
            <input
              id="mentor-password"
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

        {/* 소셜 로그인 */}
        <MentorSocialLogin />

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-3 w-full rounded-xl border border-neutral-200 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

/** 로그인했지만 멘토 권한 없을 때 */
const NotMentorPrompt = ({ onGoBack }: { onGoBack: () => void }) => {
  const navigate = useNavigate();

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
            멘토 전용 페이지입니다
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            이 페이지는 멘토 권한이 있는 계정만 접근할 수 있습니다. 멘토 활동을
            원하시면 렛츠커리어에 멘토 권한을 요청해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onGoBack}
            className="bg-primary hover:bg-primary-hover rounded-xl py-3 text-sm font-medium text-white transition-colors"
          >
            나가기
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-xl border border-neutral-200 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

/** 멘토 로그인 전용 소셜 로그인 버튼 */
const MentorSocialLogin = () => {
  const getSocialLink = (socialType: 'KAKAO' | 'NAVER') => {
    const basePath = import.meta.env.VITE_API_BASE_PATH;
    if (!basePath) return '#';

    const redirect =
      typeof window !== 'undefined' ? window.location.pathname : '/';
    const redirectPath = `${typeof window !== 'undefined' ? window.location.origin : ''}/login?redirect=${encodeURIComponent(redirect)}`;

    return `${basePath}/oauth2/authorize/${
      socialType === 'KAKAO' ? 'kakao' : 'naver'
    }?redirect_uri=${encodeURIComponent(redirectPath)}`;
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-neutral-200" />
        <span className="text-xs text-neutral-400">SNS 간편 로그인</span>
        <div className="flex-1 border-t border-neutral-200" />
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <a
          href={getSocialLink('KAKAO')}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FEE500] transition-opacity hover:opacity-80"
        >
          <img
            src="/icons/kakao-icon.svg"
            alt="카카오 로그인"
            className="w-5"
          />
        </a>
        <a
          href={getSocialLink('NAVER')}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2db400] transition-opacity hover:opacity-80"
        >
          <img
            src="/icons/naver-icon.svg"
            alt="네이버 로그인"
            className="h-4 w-4"
          />
        </a>
      </div>
    </div>
  );
};
