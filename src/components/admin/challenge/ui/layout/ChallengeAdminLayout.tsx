import { Outlet, useLocation, useParams } from 'react-router-dom';

import TabItem from '../tab/TabItem';
import TopDropdown from '../dropdown/home/TopDropdown';

const ChallengeAdminLayout = () => {
  const params = useParams();
  const location = useLocation();

  const activeStatus = /^\/admin\/challenge\/(\d+)\/notice/.test(
    location.pathname,
  )
    ? 'NOTICE'
    : /^\/admin\/challenge\/(\d+)\/mission/.test(location.pathname)
    ? 'MISSION'
    : /^\/admin\/challenge\/(\d+)\/submit-check/.test(location.pathname)
    ? 'SUBMIT_CHECK'
    : /^\/admin\/challenge\/(\d+)\/user/.test(location.pathname)
    ? 'USER'
    : /^\/admin\/challenge\/(\d+)/.test(location.pathname) && 'HOME';

  return (
    <div className="text-zinc-600">
      <div className="fixed top-0 z-50 w-full bg-white pt-6">
        <div className="flex items-center gap-4 px-12">
          <TopDropdown />
          <h1 className="text-lg font-semibold">챌린지 대시보드</h1>
        </div>
        <nav className="mt-1">
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
              미션관리
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
        </nav>
      </div>
      <>
        <div className="h-[7rem]" />
        <Outlet />
      </>
    </div>
  );
};

export default ChallengeAdminLayout;
