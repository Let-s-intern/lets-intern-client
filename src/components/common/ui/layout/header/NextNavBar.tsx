'use client';

import { useGetUserAdmin } from '@/api/user';
import useActiveLink from '@/hooks/useActiveLink';
import useActiveReportNav from '@/hooks/useActiveReportNav';
import { useControlScroll } from '@/hooks/useControlScroll';
import useProgramCategoryNav from '@/hooks/useProgramCategoryNav';
import useScrollDirection from '@/hooks/useScrollDirection';
import useAuthStore from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ExternalNavList from './ExternalNavList';
import GlobalNavItem from './GlobalNavItem';
import GlobalNavTopBar from './GlobalNavTopBar';
import NavOverlay from './NavOverlay';
import SideNavContainer from './SideNavContainer';
import SideNavItem from './SideNavItem';
import Spacer from './Spacer';
const NextNavBar = () => {
  const pathname = usePathname() ?? '';

  const [isOpen, setIsOpen] = useState(false);

  const { isLoggedIn } = useAuthStore();

  const { data: isAdmin } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });

  const activeLink = useActiveLink(pathname);
  const reportNavList = useActiveReportNav();
  const scrollDirection = useScrollDirection(pathname);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  const programCategoryLists = useProgramCategoryNav(true);

  // 사이드바 열리면 스크롤 제한
  useControlScroll(isOpen);

  return (
    <header>
      {/* 상단 네비게이션 바 */}
      <div
        className={`fixed top-0 z-30 w-screen border-b border-neutral-80 bg-white ${scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-300`}
      >
        {/* 1단 */}
        <GlobalNavTopBar
          isNextRouter
          loginRedirect={encodeURIComponent(pathname)}
          toggleMenu={toggleMenu}
        />
        {/* 2단 */}
        <nav className="mw-1180 hidden items-center justify-between pb-[18px] pt-1 md:flex">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <GlobalNavItem
                className="text-xsmall16"
                href="/program"
                isNextRouter
                subNavList={programCategoryLists}
                active={activeLink === 'PROGRAM'}
                force
                showDropdownIcon
              >
                프로그램 카테고리
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                isNextRouter
                active={activeLink === 'REPORT'}
                href={reportNavList.length === 0 ? '#' : reportNavList[0].href}
                subNavList={reportNavList}
              >
                서류 피드백 REPORT
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                isNew
                href="https://letscareer.oopy.io/1ea5e77c-bee1-8098-8e19-ec5038fb1cc8"
                isNextRouter
                target="_blank"
                rel="noopener noreferrer"
              >
                커피챗
              </GlobalNavItem>
            </div>
            <div className="h-[18px] w-[1px] bg-[#D9D9D9]" aria-hidden="true" />
            <div className="flex items-center gap-6">
              <GlobalNavItem
                className="text-xsmall16"
                href="/review"
                isNextRouter
                active={activeLink === 'REVIEW'}
              >
                수강생 솔직 후기
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                href="/blog/list"
                isNextRouter
                active={activeLink === 'BLOG'}
              >
                블로그
              </GlobalNavItem>
            </div>
            <div className="h-[18px] w-[1px] bg-[#D9D9D9]" aria-hidden="true" />
            <GlobalNavItem
              className="text-xsmall16"
              href="/about"
              isNextRouter
              force
              active={activeLink === 'ABOUT'}
            >
              렛츠커리어 스토리
            </GlobalNavItem>
          </div>
          <ExternalNavList
            isNextRouter
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
          />
        </nav>
      </div>

      {/* 사이드 네비게이션 Overlay */}
      <NavOverlay isOpen={isOpen} onClose={closeMenu} />
      {/* 사이드 네비게이션 바 */}
      <SideNavContainer isNextRouter isOpen={isOpen} onClose={closeMenu}>
        <SideNavItem href="/mypage/application" isNextRouter force>
          마이페이지
        </SideNavItem>
        <SideNavItem
          href="https://letscareer.oopy.io/1df5e77c-bee1-80b3-8199-e7d2cc9d64cd"
          isNextRouter
          force
          target="_blank"
          rel="noopener noreferrer"
        >
          커뮤니티
          <span className="flex items-center text-xxsmall12 font-normal">
            +현직자 멘토 참여중
          </span>
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        <SideNavItem href="/program" isNextRouter>
          전체 프로그램
        </SideNavItem>

        <SideNavItem href="/review" subNavList={reportNavList} isNextRouter>
          서류 피드백 REPORT
        </SideNavItem>
        <SideNavItem
          href="https://letscareer.oopy.io/1ea5e77c-bee1-8098-8e19-ec5038fb1cc8"
          isNextRouter
          isNew
          target="_blank"
          rel="noopener noreferrer"
        >
          커피챗
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        <SideNavItem className="notice_gnb" href="/review" isNextRouter>
          수강생 솔직 후기
        </SideNavItem>
        <SideNavItem className="notice_gnb" href="/blog/list" isNextRouter>
          블로그
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        {isLoggedIn && isAdmin && (
          <SideNavItem href="/admin" isNextRouter force>
            관리자 페이지
          </SideNavItem>
        )}
        <SideNavItem className="notice_gnb" href="/about" isNextRouter>
          렛츠커리어 스토리
        </SideNavItem>
        <SideNavItem
          className="notice_gnb"
          href="https://letscareer.oopy.io"
          isNextRouter
          target="_blank"
          rel="noopener noreferrer"
        >
          공지사항
        </SideNavItem>
        <SideNavItem
          className="q&a_gnb"
          href="https://letscareer.oopy.io"
          isNextRouter
          target="_blank"
          rel="noopener noreferrer"
        >
          자주 묻는 질문
        </SideNavItem>
      </SideNavContainer>

      {/* 네비게이션 바 공간 차지 */}
      <Spacer />
    </header>
  );
};

export default NextNavBar;
