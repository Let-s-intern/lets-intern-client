'use client';

import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 결제 단계·결과 페이지의 로그인 가드.
 *
 * 비로그인이면 지금 주소(쿼리 포함)로 돌아오게 로그인으로 보낸다. 결과 페이지는 토스가 붙인
 * paymentKey 가 쿼리에 있어 쿼리까지 넘겨야 로그인 뒤 승인을 이어갈 수 있다.
 * 로그인이 확인됐을 때만 true 다.
 */
export const useLoginRedirect = () => {
  const { isLoggedIn, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized || isLoggedIn) return;

    const redirectUrl = `${window.location.pathname}${window.location.search}`;
    router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }, [isInitialized, isLoggedIn, router]);

  return isInitialized && isLoggedIn;
};
