import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import {
  useGetChallengeGoal,
  useGetChallengeValideUser,
  useGetUserChallengeInfo,
} from '@/api/challenge';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import useAuthStore from '../../../../../store/useAuthStore';
import NavBar from './NavBar';

const ChallengeLayout = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isLoggedIn } = useAuthStore();
  const programId = params.programId;

  const { data: accessibleData, isLoading: isValidUserAccessLoading } =
    useGetChallengeValideUser(programId);

  const { data: isValidUserInfoData, isLoading: isValidUserInfoLoading } =
    useGetUserChallengeInfo();

  const { data: challengeGoal, isLoading: challengeGoalLoading } =
    useGetChallengeGoal(programId);

  const isValidUserInfo = isValidUserInfoData?.pass;
  const hasChallengeGoal = challengeGoal?.goal;
  const isLoading =
    isValidUserInfoLoading || isValidUserAccessLoading || challengeGoalLoading;

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

    if (!isValidUserInfo || !hasChallengeGoal) {
      navigate(`/challenge/${programId}/user/info`);
      return;
    }
  }, [
    isLoading,
    isLoggedIn,
    isValidUserInfo,
    navigate,
    programId,
    accessibleData,
    hasChallengeGoal,
  ]);

  if (isLoading) {
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
