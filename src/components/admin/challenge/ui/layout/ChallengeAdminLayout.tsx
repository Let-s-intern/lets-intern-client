import { Outlet } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';

import TabItem from '../tab/TabItem';

const ChallengeAdminLayout = () => {
  return (
    <div className="text-zinc-600">
      <div className="fixed top-0 z-50 w-full bg-white pt-4">
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
            <TabItem active>홈</TabItem>
            <TabItem>미션관리</TabItem>
            <TabItem>제출확인</TabItem>
            <TabItem>참여자</TabItem>
          </ul>
        </nav>
      </div>
      <div className="mt-[6.5rem]">
        <Outlet />
      </div>
    </div>
  );
};

export default ChallengeAdminLayout;
