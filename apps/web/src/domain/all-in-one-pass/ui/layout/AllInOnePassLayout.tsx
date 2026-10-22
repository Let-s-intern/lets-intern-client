'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import useAuthStore from '@/store/useAuthStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetMyMembershipApplication } from '../../api/dashboard';
import AllInOnePassNavBar from './AllInOnePassNavBar';

/**
 * 올인원패스 대시보드 공통 셸 + 접근 가드(로그인 + 본인 신청 소유: 403/404면 홈으로).
 * GET /membership-application/{id} 로 본인 소유 검증 + URL [id]와 membershipId 일치 확인.
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
  const { data, isError, isLoading } =
    useGetMyMembershipApplication(applicationId);
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

    // 소유했지만 URL의 [id](membershipId)와 짝이 안 맞으면 차단
    if (data && data.membershipId !== membershipId) {
      router.replace('/');
      return;
    }

    setRedirecting(false);
  }, [
    isInitialized,
    isLoggedIn,
    isValidRoute,
    isLoading,
    isError,
    data,
    membershipId,
    router,
  ]);

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
