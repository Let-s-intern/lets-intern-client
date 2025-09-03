import {
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
const CHALLENGE_DASHBOARD_ID_THRESHOLD =
  process.env.NODE_ENV === 'development' ? 60 : 60; // todo: 운영 배포 전 ID 수정 116

const ChallengeLayout = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn } = useAuthStore();

  const [redirecting, setRedirecting] = useState(true);

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

    if (Number(programId) <= CHALLENGE_DASHBOARD_ID_THRESHOLD) {
      navigate(`/old/challenge/${applicationId}/${programId}`);
      return;
    } else {
      setRedirecting(false);
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

  if (isLoading || redirecting) {
    return <LoadingContainer />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="mx-auto flex flex-col md:w-[1120px] md:flex-row md:pt-12">
        <NavBar />
        <div className="min-w-0 flex-1 py-8 md:py-0">
          <Outlet />
        </div>
      </div>
      {/* <RecommendedProgramSection /> */}
    </div>
  );
};

export default ChallengeLayout;
