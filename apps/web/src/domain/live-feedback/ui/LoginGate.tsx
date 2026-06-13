'use client';

import { useState } from 'react';

import { useAuthStore } from '@letscareer/store';

import axios from '@/utils/axios';
import { getUniversalBaseUrl } from '@/utils/url';

import type { LiveRole } from '../hooks/liveRole';

interface Props {
  feedbackId: number;
  /** 이 세션 역할 — 소셜 로그인 후 동일 역할 경로로 복귀. */
  role: LiveRole;
}

interface SigninResponse {
  data: { accessToken: string; refreshToken: string };
}

/**
 * 비로그인 입장 게이트 — 페이지 이동 없이 현재 화면에서 바로 로그인한다.
 *
 * 이메일/비밀번호: `/user/signin` 호출 후 토큰을 스토어에 넣으면(login) 컨테이너가
 * 재렌더되어 입장 UI 가 노출된다(리다이렉트 없음).
 * 소셜: OAuth 특성상 콜백(`/login`)을 거치지만 동일 입장 경로로 복귀하도록 redirect 를 건다.
 */
const LoginGate = ({ feedbackId, role }: Props) => {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleSeg = role === 'MENTOR' ? 'mentor' : 'mentee';
  const currentPath = `/live-feedback/${roleSeg}/${feedbackId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post<SigninResponse>('/user/signin', {
        email,
        password,
      });
      // 리다이렉트 없이 현재 페이지에서 로그인 완료 → 컨테이너 재렌더 → 입장 UI 노출.
      login(res.data.data.accessToken, res.data.data.refreshToken);
    } catch {
      setError('이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const getSocialLink = (socialType: 'kakao' | 'naver') => {
    const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH;
    if (!basePath) return '#';
    const redirectPath = `${getUniversalBaseUrl()}/login?redirect=${encodeURIComponent(currentPath)}`;
    return `${basePath}/oauth2/authorize/${socialType}?redirect_uri=${encodeURIComponent(redirectPath)}`;
  };

  return (
    <section className="border-neutral-80 rounded-xxl flex flex-col gap-5 border bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <img
          src="/logo/horizontal-logo.svg"
          alt="렛츠커리어"
          className="h-6 w-auto"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-small18 text-neutral-0 font-bold">
            멘토와 1:1 라이브 피드백
          </h1>
          <p className="text-xsmall14 text-neutral-40">
            로그인하면 예약하신 세션에 바로 입장할 수 있어요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="border-neutral-80 text-xsmall14 focus:border-primary rounded-md border px-4 py-3 outline-none"
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="border-neutral-80 text-xsmall14 focus:border-primary rounded-md border px-4 py-3 outline-none"
        />
        {error && <p className="text-xsmall14 text-rose-500">{error}</p>}
        <button
          type="submit"
          disabled={!email || !password || loading}
          className="text-xsmall16 bg-primary flex min-h-[52px] w-full items-center justify-center rounded-md px-4 py-3 font-semibold text-white disabled:opacity-40"
        >
          {loading ? '로그인 중…' : '로그인하고 입장'}
        </button>
      </form>

      <div className="flex flex-col items-center gap-4">
        <span className="text-xsmall14 text-neutral-45">또는 SNS 로그인</span>
        <div className="flex gap-4">
          <a
            href={getSocialLink('kakao')}
            aria-label="카카오로 로그인"
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#FEE500] transition-opacity hover:opacity-80"
          >
            <img src="/icons/kakao-icon.svg" alt="" className="w-5" />
          </a>
          <a
            href={getSocialLink('naver')}
            aria-label="네이버로 로그인"
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#2db400] transition-opacity hover:opacity-80"
          >
            <img src="/icons/naver-icon.svg" alt="" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default LoginGate;
