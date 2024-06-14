import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import axios from '../../../../utils/axios';
import TopDropdown from './dropdown/home/TopDropdown';

const ChallengeAdminLayout = () => {
  const params = useParams();
  // const location = useLocation();
  // const navigate = useNavigate();

  // const [challengeList, setChallengeList] = useState<any>();
  // const [currentChallenge, setCurrentChallenge] = useState<any>();

  // const getChallengeList = useQuery({
  //   queryKey: [
  //     'program',
  //     'admin',
  //     { type: 'CHALLENGE' },
  //     'challenge_admin_layout',
  //   ],
  //   queryFn: async () => {
  //     const res = await axios.get('/program/admin', {
  //       params: { type: 'CHALLENGE' },
  //     });
  //     const data = res.data;
  //     const challengeId = Number(params.programId);
  //     const newChallengeList = data.programList
  //       .filter((challenge: any) => challenge.th !== 0)
  //       .sort((a: any, b: any) => b.th - a.th);
  //     newChallengeList.forEach((challenge: any) => {
  //       if (challenge.id === Number(params.programId)) {
  //         setCurrentChallenge(challenge);
  //         return;
  //       }
  //     });
  //     setChallengeList(newChallengeList);
  //     const selectedChallenge = res.data.programList
  //       .filter((challenge: any) => challenge.th !== 0)
  //       .find((challenge: any) => challenge.id === challengeId);
  //     if (selectedChallenge) {
  //       localStorage.setItem('admin-challenge-id', selectedChallenge.id);
  //     } else {
  //       navigate(`/admin/challenge`);
  //     }
  //     return data;
  //   },
  // });

  // const activeStatus = /^\/admin\/challenge\/(\d+)\/notice/.test(
  //   location.pathname,
  // )
  //   ? 'NOTICE'
  //   : /^\/admin\/challenge\/(\d+)\/mission/.test(location.pathname)
  //   ? 'MISSION'
  //   : /^\/admin\/challenge\/(\d+)\/submit-check/.test(location.pathname)
  //   ? 'SUBMIT_CHECK'
  //   : /^\/admin\/challenge\/(\d+)\/user/.test(location.pathname)
  //   ? 'USER'
  //   : /^\/admin\/challenge\/(\d+)/.test(location.pathname) && 'HOME';

  // const isLoading = getChallengeList.isLoading || !currentChallenge;

  // if (isLoading) return <></>;

  return (
    <div className="text-zinc-600">
      <div className="fixed top-0 z-50 w-full bg-white pt-6">
        <div className="flex items-center gap-4 px-12">
          {/* <TopDropdown
            currentChallenge={currentChallenge}
            setCurrentChallenge={setCurrentChallenge}
            challengeList={challengeList}
          /> */}
          {/* <h1 className="text-lg font-semibold">{currentChallenge.title}</h1> */}
        </div>
        <nav id="sidebar">
          <NavLink
            to={`/admin/challenge/operation/${params.programId}/home`}
            // TODO: 테스트
            className={({ isActive, isPending, isTransitioning }) =>
              [
                isPending ? 'pending' : '',
                isActive ? 'active' : '',
                isTransitioning ? 'transitioning' : '',
              ].join(' ')
            }
          >
            홈
          </NavLink>
          <NavLink to={`/admin/challenge/operation/${params.programId}/register`}>
            미션등록
          </NavLink>
          <NavLink to={`/admin/challenge/operation/${params.programId}/submission`}>
            제출확인
          </NavLink>
          <NavLink to={`/admin/challenge/operation/${params.programId}/participant`}>
            참여자
          </NavLink>
          <NavLink to={`/admin/challenge/operation/${params.programId}/payback`}>
            페이백
          </NavLink>
        </nav>
        {/* <nav className="mt-1">
          <ul className="flex gap-8 px-12 shadow-[0_4px_4px_-4px_rgba(0,0,0,0.3)]">
            <TabItem
              to={`/admin/challenge/${params.programId}`}
              active={activeStatus === 'HOME'}
            >
              홈
            </TabItem>
            <TabItem
              to={`/admin/challenge/${params.programId}/notice`}
              active={activeStatus === 'NOTICE'}
            >
              공지사항
            </TabItem>
            <TabItem
              to={`/admin/challenge/${params.programId}/mission`}
              active={activeStatus === 'MISSION'}
            >
              미션등록
            </TabItem>
            <TabItem
              to={`/admin/challenge/${params.programId}/submit-check`}
              active={activeStatus === 'SUBMIT_CHECK'}
            >
              제출확인
            </TabItem>
            <TabItem
              to={`/admin/challenge/${params.programId}/user`}
              active={activeStatus === 'USER'}
            >
              참여자
            </TabItem>
          </ul>
        </nav> */}
      </div>
      <>
        <div className="h-[7rem]" />
        <Outlet />
      </>
    </div>
  );
};

export default ChallengeAdminLayout;
