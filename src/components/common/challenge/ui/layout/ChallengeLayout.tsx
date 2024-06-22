import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import NavBar from './NavBar';
import { useQuery } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';

const ChallengeLayout = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: isValidUserAccessData, isLoading: isValidUserAccessLoading } =
    useQuery({
      queryKey: ['challenge', params.programId, 'access'],
      queryFn: async ({ queryKey }) => {
        const res = await axios.get(
          `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
        );
        return res.data;
      },
    });

  const { data: isValidUserInfoData, isLoading: isValidUserInfoLoading } =
    useQuery({
      queryKey: ['user', 'challenge-info'],
      queryFn: async ({ queryKey }) => {
        const res = await axios.get(`/${queryKey[0]}/${queryKey[1]}`);
        return res.data;
      },
    });

  const isValidUserAccess = isValidUserAccessData?.data?.isAccessible;
  const isValidUserInfo = isValidUserInfoData?.data?.pass;

  const isLoading = isValidUserInfoLoading || isValidUserAccessLoading;

  useEffect(() => {
    if (isLoading) return;
    if (!isValidUserAccess) navigate('/');
    if (!isValidUserInfo) navigate(`/challenge/${params.programId}/user/info`);
  }, [isValidUserAccess, isValidUserInfo]);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center sm:h-[calc(100vh-6rem)] lg:hidden">
        <div className="-mt-24">
          <h1 className=" text-neutral-black text-center text-2xl font-semibold">
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
        <div className="mx-auto flex w-[1024px] ">
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
