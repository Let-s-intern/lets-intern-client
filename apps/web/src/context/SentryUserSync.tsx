'use client';

import { useUserQuery } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

const ANON_COOKIE_KEY = 'sentry_anon_id';
const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1년

/**
 * Sentry 이벤트에 user identifier를 박아 unique user count가 산출되게 한다.
 * - 로그인: 백엔드 user PK 사용 (PII 비공개)
 * - 비로그인: 쿠키 기반 익명 UUID 사용
 */
const SentryUserSync = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const { data: user } = useUserQuery({ enabled: isInitialized && isLoggedIn });

  useEffect(() => {
    if (!isInitialized) return;

    if (isLoggedIn) {
      if (user?.userId != null) {
        Sentry.setUser({ id: String(user.userId) });
      }
      return;
    }

    Sentry.setUser({ id: `anon:${ensureAnonId()}` });
  }, [isInitialized, isLoggedIn, user?.userId]);

  return null;
};

function ensureAnonId(): string {
  if (typeof document === 'undefined') return 'ssr';

  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${ANON_COOKIE_KEY}=([^;]+)`),
  );
  if (cookieMatch) {
    return decodeURIComponent(cookieMatch[1]);
  }

  const newId = crypto.randomUUID();
  document.cookie = `${ANON_COOKIE_KEY}=${encodeURIComponent(newId)}; max-age=${ANON_COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
  return newId;
}

export default SentryUserSync;
