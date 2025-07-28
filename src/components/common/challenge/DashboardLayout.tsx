import {
  useGetChallengeGoal,
  useGetChallengeValideUser,
  useGetUserChallengeInfo,
} from '@/api/challenge';
import { useGetChallengeQuery } from '@/api/program';
import useLegacyDashboardRedirect from '@/hooks/useLegacyDashboardRedirect';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { lazy, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import DashboardNavBar from './DashboardNavBar';
import RecommendedProgramSection from './RecommendedProgramSection';

const RecommendedProgramSwiper = lazy(
  () => import('./RecommendedProgramSwiper'),
);

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

  const { data: challengeGoal, isLoading: challengeGoalLoading } =
    useGetChallengeGoal(programId);

  const isValidUserInfo = isValidUserInfoData?.pass;
  const hasChallengeGoal = challengeGoal?.goal;
  const isLoadingData =
    isValidUserInfoLoading ||
    isValidUserAccessLoading ||
    challengeGoalLoading ||
    challengeIsLoading;
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

    if (!isValidUserInfo || (isStartAfterGoal && !hasChallengeGoal)) {
      navigate(`/challenge/${applicationId}/${programId}/user/info`);
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
    hasChallengeGoal,
    isStartAfterGoal,
  ]);

  if (isLoadingDashboard || isLoadingData) {
    return <LoadingContainer className="mt-[10%]" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="mx-auto mt-8 flex px-5 md:mt-16 md:w-[1120px] md:gap-12 md:px-0">
        <DashboardNavBar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>

      {/* 프로그램 추천 */}
      <RecommendedProgramSection />
    </div>
  );
};

export default DashboardLayout;
