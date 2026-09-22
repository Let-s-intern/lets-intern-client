'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AllInOnePassNavBar from './AllInOnePassNavBar';

/**
 * 올인원패스 대시보드 공통 셸. 챌린지 ChallengeLayout 의 큰 골격(사이드바 + 본문)을 따른다.
 *
 * 접근 가드: 로그인 게이트만 실제로 걸고, 본인(구매자) 소유 검증은 API 대기.
 * // TODO(BE): 소유 검증 API 나오면 챌린지 useGetChallengeValideUser 자리처럼 훅을 끼워
 * 비구매자는 리다이렉트한다.
 */
const AllInOnePassLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isLoggedIn, isInitialized } = useAuthStore();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isLoggedIn) {
      const newUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', `${newUrl.pathname}?${newUrl.search}`);
      router.push(`/login?${searchParams.toString()}`);
      return;
    }

    setRedirecting(false);
  }, [isInitialized, isLoggedIn, router]);

  if (redirecting) {
    return <LoadingContainer />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="mx-auto flex flex-col md:w-[1120px] md:flex-row md:pt-12">
        <AllInOnePassNavBar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AllInOnePassLayout;
