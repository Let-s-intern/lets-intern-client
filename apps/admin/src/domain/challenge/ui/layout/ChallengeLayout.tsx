import {
  useGetChallengeGoal,
  useGetChallengeValideUser,
  useGetUserChallengeInfo,
} from '@/api/challenge/challenge';
import { useGetChallengeQuery } from '@/api/program';
import LoadingContainer from '@/common/loading/LoadingContainer';
import dayjs from '@/lib/dayjs';
import useAuthStore from '@/store/useAuthStore';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecommendedProgramSection from '../../my-challenge/section/RecommendedProgramSection';
import NavBar from './NavBar';

export const GOAL_DATE = dayjs('2025-01-19');
const CHALLENGE_DASHBOARD_ID_THRESHOLD =
  import.meta.env.VITE_PROFILE === 'development' ? 60 : 116;

const ChallengeLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const params = useParams<{ programId: string; applicationId: string }>();
  const { isLoggedIn, isInitialized } = useAuthStore();

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

  const { data: challengeGoal, isLoading: challengeGoalLoading } =
    useGetChallengeGoal(programId);

  const isValidUserInfo = isValidUserInfoData?.pass;
  const isLoading =
    isValidUserInfoLoading ||
    isValidUserAccessLoading ||
    challengeIsLoading ||
    challengeGoalLoading;
  const isStartAfterGoal =
    challenge?.startDate && GOAL_DATE.isBefore(challenge.startDate);
  const hasChallengeGoal = challengeGoal?.goal != null;

  useEffect(() => {
    if (!isInitialized) return;

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

    if (!isValidUserInfo || !hasChallengeGoal) {
      navigate(`/challenge/${applicationId}/${programId}/user/info`);
      return;
    }
  }, [
    isInitialized,
    isLoading,
    isLoggedIn,
    isValidUserInfo,
    navigate,
    pathname,
    programId,
    applicationId,
    accessibleData,
    isStartAfterGoal,
    hasChallengeGoal,
  ]);

  if (isLoading || redirecting) {
    return <LoadingContainer />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="mx-auto flex flex-col md:w-[1120px] md:flex-row md:pt-12">
        <NavBar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <RecommendedProgramSection />
    </div>
  );
};

export default ChallengeLayout;
