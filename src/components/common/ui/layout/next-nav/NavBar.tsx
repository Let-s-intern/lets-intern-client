'use client';

import { useGetUserAdmin, useUserQuery } from '@/api/user';
import useActiveLink from '@/hooks/useActiveLink';
import useActiveReportNav from '@/hooks/useActiveReportNav';
import { useControlScroll } from '@/hooks/useControlScroll';
import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import GlobalNavItem from '../header/GlobalNavItem';
import GlobalNavTopBar from '../header/GlobalNavTopBar';
import KakaoChannel from '../nav/KakaoChannel';
import SideNavItem from './SideNavItem';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname() ?? '';

  const [isOpen, setIsOpen] = useState(false);

  const activeLink = useActiveLink(pathname);
  const reportNavList = useActiveReportNav();
  const scrollDirection = useScrollDirection(pathname);

  const { isLoggedIn, logout } = useAuthStore();

  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const { data: isAdmin } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  // 사이드바 열리면 스크롤 제한
  useControlScroll(isOpen);

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <header
        className={`fixed top-0 z-30 w-screen border-b border-neutral-80 bg-white px-5 ${scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-300`}
      >
        {/* 1단 */}
        <GlobalNavTopBar
          isNextRouter
          isActiveHome={activeLink === 'HOME'}
          username={user?.name ?? undefined}
          loginRedirect={pathname}
          toggleMenu={toggleMenu}
        />
        {/* 2단 */}
        <nav className="mw-1140 hidden items-center gap-3 pb-[18px] pt-1 md:flex">
          <div className="flex items-center gap-5">
            <GlobalNavItem
              className="text-xsmall16"
              href="/program"
              force
              isNextRouter
              active={activeLink === 'PROGRAM'}
            >
              전체 프로그램
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
            {/* <NavItem to="/program" active={activeLink === 'PROGRAM'}>
              커피챗
            </NavItem> */}
          </div>
          <div className="h-[18px] w-[1px] bg-[#D9D9D9]" aria-hidden="true" />
          <div className="flex items-center gap-5">
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
        </nav>
      </header>

      {/* 투명한 검정색 배경 */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isOpen
            ? 'opacity-50 ease-out'
            : 'pointer-events-none opacity-0 ease-in'
        }`}
        onClick={toggleMenu}
      />

      {/* 사이드 네비게이션 바 */}
      <div
        className={twMerge(
          'fixed right-0 top-0 z-50 flex h-screen w-[18.25rem] flex-col bg-white shadow-md transition-all duration-300 sm:w-[22rem]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex w-full items-center justify-between p-5">
          <div className="h-7">
            <img
              className="h-full w-auto"
              src="/logo/logo-gradient-text.svg"
              alt="렛츠커리어 로고"
            />
          </div>
          <i className="h-6 w-6 cursor-pointer" onClick={closeMenu}>
            <img
              className="h-auto w-full"
              src="/icons/x-close.svg"
              alt="닫기 아이콘"
            />
          </i>
        </div>
        <hr />
        <KakaoChannel />
        <div className="flex h-full flex-col gap-5 overflow-y-auto pb-36 pt-10">
          <div className="mx-5 flex justify-between">
            {isLoggedIn ? (
              <span className="flex w-full items-center justify-between gap-4 text-neutral-0 sm:p-0">
                <span>
                  환영합니다, <span className="text-primary">{user?.name}</span>
                  님
                </span>
                <button
                  className="text-primary"
                  onClick={() => {
                    logout();
                    router.push('/');
                    closeMenu();
                  }}
                >
                  로그아웃
                </button>
              </span>
            ) : (
              <div className="text-0.875 flex gap-6">
                <Link
                  className="text-primary"
                  href={{
                    pathname: '/login',
                    query: { redirect: pathname },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
                    closeMenu();
                  }}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/signup';
                    closeMenu();
                  }}
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <SideNavItem to="/mypage/application" onClick={closeMenu} force>
              마이페이지
            </SideNavItem>
            <hr className="h-1 bg-neutral-80" />
            <SideNavItem to="/about" onClick={closeMenu} force>
              렛츠커리어 스토리
            </SideNavItem>
            <SideNavItem to="/program" onClick={closeMenu} force>
              프로그램
            </SideNavItem>
            <SideNavItem to="/review" onClick={closeMenu}>
              100% 솔직 후기
            </SideNavItem>
            <SideNavItem to="/blog/list" onClick={closeMenu}>
              블로그
            </SideNavItem>
            {/* <SideNavItem
              to="/report/landing"
              onClick={closeMenu}
              hoverItem={reportItems}
            >
              🔥 서류 진단받고 합격하기
            </SideNavItem> */}

            <hr className="h-1 bg-neutral-80" />
            {isAdmin && (
              <SideNavItem to="/admin" onClick={closeMenu}>
                관리자 페이지
              </SideNavItem>
            )}
            <SideNavItem
              to="https://letscareer.oopy.io"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="notice_gnb"
            >
              공지사항
            </SideNavItem>
            <SideNavItem
              to="https://letscareer.oopy.io"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="q&a_gnb"
            >
              자주 묻는 질문
            </SideNavItem>
          </div>
        </div>
      </div>
      {/* 네비게이션 바 공간 차지 */}
      <div className="h-[3.75rem] md:h-[111px]" />
    </>
  );
};

export default NavBar;
