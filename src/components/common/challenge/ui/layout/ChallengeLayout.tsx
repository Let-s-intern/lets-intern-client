import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import NavBar from './NavBar';

const ChallengeLayout = () => {
  const params = useParams();
  const navigate = useNavigate();

  // TODO: 검증 로직 필요함.
  const [isValidUser, setIsValidUser] = useState<boolean>(true);

  // useQuery({
  //   enabled: Boolean(params.programId),
  //   queryKey: ['application', params.programId],
  //   queryFn: async () => {
  //     const res = await axios.get(`/challenge/${params.programId}/application`);
  //     const data = getChallengeIdApplication.parse(res.data.data);

  //     const data = res.data;
  //     setIsValidUser(data.valid);
  //     return data;
  //   },
  // });

  const isLoading = isValidUser === undefined;

  useEffect(() => {
    if (isLoading) return;
    if (!isValidUser) navigate('/');
  }, [isValidUser]);

  if (isLoading || !isValidUser) {
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
