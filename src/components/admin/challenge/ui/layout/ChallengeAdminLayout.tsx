import { Outlet, useLocation } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';

import TabItem from '../tab/TabItem';

const ChallengeAdminLayout = () => {
  const location = useLocation();

  return (
    <div className="text-zinc-600">
      <div className="fixed top-0 z-50 w-full bg-white pt-6">
        <div className="flex items-center gap-4 px-12">
          <div className="flex cursor-pointer items-center gap-4 rounded border border-neutral-400 py-2 pl-4 pr-2">
            <span className="font-medium">15기</span>
            <i className="text-xl">
              <IoMdArrowDropdown />
            </i>
          </div>
          <h1 className="text-lg font-semibold">챌린지 대시보드</h1>
        </div>
        <nav className="mt-1">
          <ul className="flex gap-8 px-12 shadow-[0_4px_4px_-4px_rgba(0,0,0,0.3)]">
            <TabItem
              to="/admin/challenge"
              active={location.pathname === '/admin/challenge'}
            >
              홈
            </TabItem>
            <TabItem
              to="/admin/challenge/notice"
              active={location.pathname.startsWith('/admin/challenge/notice')}
            >
              공지사항
            </TabItem>
            <TabItem
              to="/admin/challenge/mission"
              active={location.pathname.startsWith('/admin/challenge/mission')}
            >
              미션관리
            </TabItem>
            <TabItem
              to="/admin/challenge/submit-check"
              active={location.pathname.startsWith(
                '/admin/challenge/submit-check',
              )}
            >
              제출확인
            </TabItem>
            <TabItem
              to="/admin/challenge/user"
              active={location.pathname.startsWith('/admin/challenge/user')}
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
