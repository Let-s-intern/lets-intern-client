import {
  useGetChallengeValideUser,
  useGetUserChallengeInfo,
} from '@/api/challenge';
import { useGetChallengeQuery } from '@/api/program';
import useLegacyDashboardRedirect from '@/hooks/useLegacyDashboardRedirect';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import DashboardNavBar from './DashboardNavBar';
import RecommendedProgramSection from './RecommendedProgramSection';

export const GOAL_DATE = dayjs('2025-01-19');

const DashboardLayout = () => {
  const navigate = useNavigate();

  const params = useParams();
  const programId = params.programId;
  const applicationId = params.applicationId;

  const isLoadingDashboard = useLegacyDashboardRedirect(true);

  const { isLoggedIn } = useAuthStore();

  const { data: challenge, isLoading: challengeIsLoading } =
    useGetChallengeQuery({
      challengeId: Number(programId),
      enabled: !!programId && !isNaN(Number(programId)),
    });

  const { data: accessibleData, isLoading: isValidUserAccessLoading } =
    useGetChallengeValideUser(programId);

  const { data: isValidUserInfoData, isLoading: isValidUserInfoLoading } =
    useGetUserChallengeInfo();

  const isValidUserInfo = isValidUserInfoData?.pass;
  const isLoadingData =
    isValidUserInfoLoading || isValidUserAccessLoading || challengeIsLoading;
  const isStartAfterGoal =
    challenge?.startDate && GOAL_DATE.isBefore(challenge.startDate);

  useEffect(() => {
    if (!isLoggedIn) {
      const newUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', `${newUrl.pathname}?${newUrl.search}`);
      navigate(`/login?${searchParams.toString()}`);
      return;
    }

    if (isLoadingData) return;

    if (!accessibleData) {
      alert('접근 권한이 없습니다.');
      navigate('/');
      return;
    }
    if (!isValidUserInfo) {
      navigate(`/challenge/${programId}/dashboard/${applicationId}/user-info`);
      return;
    }
  }, [
    isLoadingData,
    isLoggedIn,
    isValidUserInfo,
    navigate,
    programId,
    applicationId,
    accessibleData,
    isStartAfterGoal,
  ]);

  if (isLoadingData || isLoadingDashboard) {
    return <LoadingContainer className="mt-[10%]" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="mx-auto flex flex-col pb-16 md:mt-16 md:w-[1120px] md:flex-row md:gap-12">
        {isValidUserInfo && <DashboardNavBar />}
        <div className="mt-8 min-w-0 flex-1 px-5 md:mt-0 md:px-0">
          <Outlet />
        </div>
      </div>

      {/* 프로그램 추천 */}
      <RecommendedProgramSection />
    </div>
  );
};

export default DashboardLayout;
