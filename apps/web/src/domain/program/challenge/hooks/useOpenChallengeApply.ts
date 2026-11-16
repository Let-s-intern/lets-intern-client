'use client';

import { ChallengePricePlan } from '@/schema';
import useAuthStore from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChallengeApplySheetStore } from '../store/useChallengeApplySheetStore';

/** 비로그인이면 로그인으로 보내고, 로그인 상태면 결제 플랜 바텀시트를 연다 */
export const useOpenChallengeApply = () => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const open = useChallengeApplySheetStore((state) => state.open);

  return (plan?: ChallengePricePlan | null) => {
    if (!isLoggedIn) {
      // 현재 URL의 전체 경로와 쿼리 파라미터를 포함하여 로그인 후 리다이렉트 URL 생성
      // window.location.pathname을 사용해야 title이 포함된 전체 경로를 가져올 수 있음
      const currentPath = window.location.pathname;
      const currentSearch = searchParams.toString();
      const redirectUrl = currentSearch
        ? `${currentPath}?${currentSearch}`
        : currentPath;

      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    open(plan);
  };
};
