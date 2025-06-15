'use client';

import { useGetUserAdmin } from '@/api/user';
import useActiveLink from '@/hooks/useActiveLink';
import useActiveReportNav from '@/hooks/useActiveReportNav';
import { useControlScroll } from '@/hooks/useControlScroll';
import useProgramCategoryNav from '@/hooks/useProgramCategoryNav';
import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import { useMediaQuery } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ExternalNavList from './ExternalNavList';
import GlobalNavItem from './GlobalNavItem';
import GlobalNavTopBar from './GlobalNavTopBar';
import NavOverlay from './NavOverlay';
import SideNavContainer from './SideNavContainer';
import SideNavItem from './SideNavItem';
import Spacer from './Spacer';

export const NAVBAR_HEIGHT_OFFSET = 'top-[84px] md:top-[117px]';
export const TOP_NAVBAR_HEIGHT_OFFSET = 'top-[43px] md:top-[117px]';

export const hideMobileBottomNavBar = (pathname: string) =>
  pathname.startsWith('/program/') ||
  pathname === '/about' ||
  pathname.startsWith('/review') ||
  pathname.startsWith('/blog') ||
  pathname.startsWith('/mypage') ||
  pathname === '/login' ||
  pathname === '/signup';

export const getBottomNavBarClassNameByPath = (pathname: string) => {
  return hideMobileBottomNavBar(pathname) && 'hidden md:flex';
};

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
  const isMobile = useMediaQuery('(max-width:768px)');

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
        className={twMerge(
          'fixed top-0 z-30 w-screen border-b border-neutral-80 bg-white transition-transform duration-300',
          scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        {/* 1단 */}
        <GlobalNavTopBar
          isNextRouter
          loginRedirect={encodeURIComponent(pathname)}
          toggleMenu={toggleMenu}
        />
        {/* 2단 */}
        <nav
          className={twMerge(
            'mw-1180 items-center justify-between pb-[14px] pt-1.5 text-xsmall14 md:flex md:pb-[18px] md:pt-1 md:text-xsmall16',
            getBottomNavBarClassNameByPath(pathname),
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <GlobalNavItem
                className="text-xsmall14 md:text-xsmall16"
                href="/program"
                isNextRouter
                active={activeLink === 'PROGRAM'}
                force
                // 모바일은 드롭다운 X
                {...(!isMobile && {
                  subNavList: programCategoryLists,
                  showDropdownIcon: true,
                })}
              >
                프로그램 &nbsp;
                <span className="hidden md:inline">카테고리</span>
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall14 md:text-xsmall16"
                isNextRouter
                active={activeLink === 'REPORT'}
                href={reportNavList.length === 0 ? '#' : reportNavList[0].href}
                // 모바일은 드롭다운 X
                {...(!isMobile && {
                  subNavList: reportNavList,
                })}
              >
                서류 피드백 REPORT
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall14 md:text-xsmall16"
                isNew
                href="https://letscareer.oopy.io/1ea5e77c-bee1-8098-8e19-ec5038fb1cc8"
                isNextRouter
                target="_blank"
                rel="noopener noreferrer"
              >
                커피챗
              </GlobalNavItem>
            </div>
            <div
              className="hidden h-[18px] w-[1px] bg-[#D9D9D9] md:block"
              aria-hidden="true"
            />
            <div className="hidden items-center gap-6 md:flex">
              <GlobalNavItem
                className="text-xsmall16"
                href="/review"
                force
                isNextRouter
                active={activeLink === 'REVIEW'}
              >
                수강생 솔직 후기
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                href="/blog/list"
                force
                isNextRouter
                active={activeLink === 'BLOG'}
              >
                블로그
              </GlobalNavItem>
            </div>
            <div
              className="hidden h-[18px] w-[1px] bg-[#D9D9D9] md:block"
              aria-hidden="true"
            />
            <GlobalNavItem
              className="hidden text-xsmall16 md:inline"
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
        <SideNavItem className="notice_gnb" href="/review" force isNextRouter>
          수강생 솔직 후기
        </SideNavItem>
        <SideNavItem
          className="notice_gnb"
          href="/blog/list"
          force
          isNextRouter
        >
          블로그
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        {isLoggedIn && isAdmin && (
          <SideNavItem href="/admin" isNextRouter force>
            관리자 페이지
          </SideNavItem>
        )}
        <SideNavItem className="notice_gnb" href="/about" force isNextRouter>
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
      <Spacer hideMobileBottomNavBar={hideMobileBottomNavBar(pathname)} />
    </header>
  );
};

export default NextNavBar;
