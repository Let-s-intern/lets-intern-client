import {
  useGetChallengeValideUser,
  useGetUserChallengeInfo,
} from '@/api/challenge';
import { useGetChallengeQuery } from '@/api/program';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';

export const GOAL_DATE = dayjs('2025-01-19');

const ChallengeLayout = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn } = useAuthStore();

  const programId = params.programId;
  const applicationId = params.applicationId;

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
  const isLoading =
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

    if (isLoading) return;

    if (!accessibleData) {
      alert('접근 권한이 없습니다.');
      navigate('/');
      return;
    }

    if (isStartAfterGoal && !isValidUserInfo) {
      navigate(`/challenge/${applicationId}/${programId}/user/info`);
      return;
    }
  }, [
    isLoading,
    isLoggedIn,
    isValidUserInfo,
    navigate,
    programId,
    applicationId,
    accessibleData,
    isStartAfterGoal,
  ]);

  if (isLoading) {
    return <LoadingContainer />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="mx-auto flex flex-col md:w-[1120px] md:flex-row md:px-5 md:pt-12">
        <NavBar />
        <div className="min-w-0 flex-1 py-8 md:px-5 md:py-8">
          <Outlet />
        </div>
      </div>
      {/* <RecommendedProgramSection /> */}
    </div>
  );
};

export default ChallengeLayout;
