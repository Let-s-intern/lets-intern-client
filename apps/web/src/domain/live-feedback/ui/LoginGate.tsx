'use client';

import { useRouter } from 'next/navigation';

import { sanitizeRedirect } from '@/domain/auth/utils/sanitizeRedirect';

import type { LiveRole } from '../hooks/liveRole';

interface Props {
  feedbackId: number;
  /** 이 세션 역할 — 로그인 후 동일 역할 경로로 복귀. */
  role: LiveRole;
}

/**
 * 비로그인 입장 게이트.
 *
 * 알림톡 링크로 들어온 미로그인 사용자에게 로그인 CTA 를 노출한다.
 * 로그인 후 동일 입장 경로(/live-feedback/[role]/[id])로 복귀하도록 redirect 를 전달한다.
 */
const LoginGate = ({ feedbackId, role }: Props) => {
  const router = useRouter();

  const handleLogin = () => {
    const roleSeg = role === 'MENTOR' ? 'mentor' : 'mentee';
    const redirect = sanitizeRedirect(
      `/live-feedback/${roleSeg}/${feedbackId}`,
    );
    router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <section className="border-neutral-80 flex flex-col gap-4 rounded-xxl border p-5">
      <h1 className="text-small18 text-neutral-0 font-semibold">
        라이브 피드백 입장
      </h1>
      <p className="text-xsmall14 text-neutral-30">
        로그인 후 라이브 피드백에 입장할 수 있습니다.
      </p>
      <button
        type="button"
        onClick={handleLogin}
        className="text-small16 bg-primary flex min-h-[52px] w-full items-center justify-center rounded-md px-4 py-3 font-semibold text-white"
      >
        로그인하고 입장
      </button>
    </section>
  );
};

export default LoginGate;
