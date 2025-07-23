import {
  useGetChallengeGoal,
  useGetChallengeValideUser,
  useGetUserChallengeInfo,
} from '@/api/challenge';
import { useGetChallengeQuery } from '@/api/program';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';

export const GOAL_DATE = dayjs('2025-01-19');

const ChallengeLayout = () => {
  const navigate = useNavigate();

  const params = useParams();
  const programId = params.programId;
  const applicationId = params.applicationId;

  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

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

  useEffect(() => {
    /*  챌린지 대시보드 분기 처리 */
    const LEGACY_DASHBOARD_CUTOFF_PROGRAM_ID =
      process.env.NODE_ENV === 'development' ? 17 : 100;
    const programId = params.programId;

    if (Number(programId) < LEGACY_DASHBOARD_CUTOFF_PROGRAM_ID) {
      const applicationId = params.applicationId;
      navigate(`/challenge/${applicationId}/${programId}`);
    }
    setIsLoadingDashboard(false);
  }, [navigate, params]);

  if (isLoadingDashboard || isLoadingData) {
    return <LoadingContainer className="mt-[10%]" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center sm:h-[calc(100vh-6rem)] lg:hidden">
        <div className="-mt-24">
          <h1 className="text-neutral-black text-center text-2xl font-semibold">
            챌린지 페이지는
            <br />
            데스크탑에서만 이용 가능합니다!
          </h1>
          <p className="mt-2 text-center">
            데스크탑으로 접속해주시거나
            <br />
            화면의 크기를 좌우로 늘려주세요!
          </p>
        </div>
      </div>
      <div className="hidden px-6 py-6 lg:block">
        <div className="mx-auto flex w-[1024px]">
          <NavBar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeLayout;
