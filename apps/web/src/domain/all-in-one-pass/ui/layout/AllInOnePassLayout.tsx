'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import useAuthStore from '@/store/useAuthStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetMembershipApplication } from '../../api/dashboard';
import AllInOnePassNavBar from './AllInOnePassNavBar';

/**
 * 올인원패스 대시보드 공통 셸. 챌린지 ChallengeLayout 의 큰 골격(사이드바 + 본문)을 따른다.
 *
 * 접근 가드: 로그인 게이트 + 본인 신청 소유 검증. 소유 검증은 내 신청 상세 조회로 하며,
 * 403/404(본인 신청 아님)면 홈으로 리다이렉트한다(챌린지 useGetChallengeValideUser 패턴).
 * // TODO(BE): useGetMembershipApplication 의 queryFn 을 실제 GET 으로 교체하면 즉시 동작.
 */
const AllInOnePassLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const params = useParams<{ id: string; applicationId: string }>();
  const membershipId = Number(params.id);
  const applicationId = Number(params.applicationId);
  const isValidRoute =
    Number.isInteger(membershipId) &&
    membershipId > 0 &&
    Number.isInteger(applicationId) &&
    applicationId > 0;
  const { isLoggedIn, isInitialized } = useAuthStore();
  const { isError, isLoading } = useGetMembershipApplication(applicationId);
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

    if (!isValidRoute) {
      router.replace('/');
      return;
    }

    if (isLoading) return;

    if (isError) {
      alert('접근 권한이 없습니다.');
      router.push('/');
      return;
    }

    // TODO(BE): 실 API 연동 시 한 줄 추가 — 소유했지만 URL의 [id](membershipId)와
    // 짝이 안 맞는 경우도 차단한다. 훅에서 data 를 꺼내 아래처럼:
    //   if (data && data.membershipId !== membershipId) { router.replace('/'); return; }

    setRedirecting(false);
  }, [isInitialized, isLoggedIn, isValidRoute, isLoading, isError, router]);

  if (redirecting || isLoading) {
    return <LoadingContainer />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="mx-auto flex flex-col md:mb-16 md:w-[1120px] md:flex-row md:pb-16 md:pt-12">
        <AllInOnePassNavBar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AllInOnePassLayout;
