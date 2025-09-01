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

  useEffect(() => {
    if (Number(programId) <= 56) {
      navigate(`/old/challenge/${applicationId}/${programId}`);
    } else {
      setRedirecting(false);
    }
  }, [programId, applicationId, navigate]);

  if (isLoading || redirecting) {
    return <LoadingContainer />;
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
      <div className="hidden px-6 pt-12 lg:block">
        <div className="mx-auto flex w-[1120px]">
          <NavBar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
      {/* <RecommendedProgramSection /> */}
    </div>
  );
};

export default ChallengeLayout;
