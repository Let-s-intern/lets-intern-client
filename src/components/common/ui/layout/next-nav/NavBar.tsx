'use client';

import { useGetActiveReports } from '@/api/report';
import { hasActiveReport } from '@/hooks/useActiveReports';
import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import useScrollStore from '@/store/useScrollStore';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import KakaoChannel from '../nav/KakaoChannel';
import NavItem from './NavItem';
import { NavSubItemProps } from './NavSubItem';
import SideNavItem from './SideNavItem';

const reportHoverItem: NavSubItemProps[] = [
  {
    text: '이력서 진단 받기',
    to: '/report/landing/resume',
  },
  {
    text: '자기소개서 진단 받기',
    to: '/report/landing/personal-statement',
  },
  {
    text: '포트폴리오 진단 받기',
    to: '/report/landing/portfolio',
  },
  {
    text: 'MY 진단서 보기',
    to: '/report/management',
    force: true,
  },
];

const interviewHoverItem: NavSubItemProps[] = [
  {
    text: '대기업 모의 면접',
    to: 'https://letscareerinterview.imweb.me',
  },
  {
    text: '스타트업 모의면접',
    to: 'https://letscareerinterview.imweb.me/Startupinterview',
  },
];

const scrollEventPage = [
  '/report/landing',
  '/program/challenge',
  '/program/live',
];

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const lastScrollY = useRef(0);

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportItems, setReportItems] = useState<NavSubItemProps[]>([]);
  const [activeLink, setActiveLink] = useState<
    'HOME' | 'ABOUT' | 'PROGRAM' | 'ADMIN' | 'BLOG' | 'REPORT' | 'REVIEW' | ''
  >('');

  const { isLoggedIn, logout } = useAuthStore();
  const { setScrollDirection, scrollDirection } = useScrollStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const { data: userData } = useQuery({
    queryKey: ['mainUser'],
    queryFn: async () => {
      const res = await axios.get('/user');
      return res.data.data;
    },
    enabled: isLoggedIn,
    retry: 1,
  });

  const { data: isAdminData } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const res = await axios.get('/user/isAdmin');
      return res.data.data;
    },
    enabled: isLoggedIn,
    retry: 1,
  });

  const { data, isLoading } = useGetActiveReports();

  useEffect(() => {
    if (data) {
      const navItems: NavSubItemProps[] = [];

      const resumeInfoList = data?.resumeInfoList;
      const personalStatementInfoList = data?.personalStatementInfoList;
      const portfolioInfoList = data?.portfolioInfoList;

      if (hasActiveReport(resumeInfoList)) {
        navItems.push(reportHoverItem[0]);
      }
      if (hasActiveReport(personalStatementInfoList)) {
        navItems.push(reportHoverItem[1]);
      }
      if (hasActiveReport(portfolioInfoList)) {
        navItems.push(reportHoverItem[2]);
      }

      navItems.push(reportHoverItem[3]);

      setReportItems(navItems);
    } else {
      setReportItems([reportHoverItem[3]]);
    }
  }, [data]);

  // 사이드바 열리면 스크롤 제한
  useControlScroll(isOpen);

  useEffect(() => {
    if (pathname.startsWith('/about')) {
      setActiveLink('ABOUT');
    } else if (pathname.startsWith('/program')) {
      setActiveLink('PROGRAM');
    } else if (pathname.startsWith('/admin')) {
      setActiveLink('ADMIN');
    } else if (pathname.startsWith('/blog')) {
      setActiveLink('BLOG');
    } else if (pathname.startsWith('/report')) {
      setActiveLink('REPORT');
    } else if (pathname.startsWith('/review')) {
      setActiveLink('REVIEW');
    } else if (pathname.startsWith('/')) {
      setActiveLink('HOME');
    }
  }, [pathname]);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }

    if (isAdminData) {
      setIsAdmin(isAdminData);
    }
  }, [userData, isAdminData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setScrollDirection('UP');

    const handleScroll = () => {
      // 현재 경로가 scrollEventPage 중 하나로 시작되지 않을 때는 스크롤 이벤트를 무시
      if (!scrollEventPage.some((page) => location.pathname.startsWith(page))) {
        return;
      }

      const currentScrollY = Math.max(0, window.scrollY);

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('DOWN');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('UP');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, setScrollDirection]);

  return (
    <header>
      {/* 상단 네비게이션 바 */}
      <section
        className={`lg:p-30 fixed top-0 z-30 h-[3.75rem] w-screen border-b border-neutral-80 bg-static-100 px-5 sm:px-20 md:h-[4.375rem] lg:h-[4.75rem] lg:px-28 ${scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-300`}
      >
        <div className="flex h-full items-center justify-between">
          <div className="flex h-full items-center gap-4 sm:gap-9">
            <Link href={'/'} className="h-[1.75rem] md:h-[2.2rem]">
              <img
                src="/logo/logo-gradient-text.svg"
                alt="렛츠커리어 로고"
                className="h-full w-auto"
              />
              <h1 className="sr-only">렛츠커리어</h1>
            </Link>
            {/* 메뉴 아이템 */}
            <NavItem to="/about" active={activeLink === 'ABOUT'}>
              렛츠커리어 스토리
            </NavItem>
            <NavItem to="/program" active={activeLink === 'PROGRAM'}>
              프로그램
            </NavItem>
            <NavItem to="/review" active={activeLink === 'REVIEW'}>
              100% 솔직 후기
            </NavItem>
            <NavItem to="/blog/list" active={activeLink === 'BLOG'}>
              블로그
            </NavItem>
            <NavItem
              as="div"
              to={reportHoverItem[0].to}
              active={activeLink === 'REPORT'}
              hoverItem={reportItems}
              isItemLoaded={!isLoading && !!data}
            >
              🔥 서류 진단받고 합격하기
            </NavItem>
            {/* <NavItem
              as="div"
              hoverItem={interviewHoverItem}
              target="_blank"
              rel="noopenner noreferrer"
            >
              🔎 모의 면접하고 합격하기
            </NavItem> */}
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div
                className="hidden cursor-pointer gap-2 sm:flex"
                onClick={() => {
                  window.location.href = '/mypage/application';
                }}
              >
                <span className="text-1.125-medium block">{user?.name} 님</span>
                <img
                  src="/icons/user-user-circle-black.svg"
                  alt="User icon"
                  className="w-1.75"
                />
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href={{
                    pathname: '/login',
                    query: { redirect: pathname },
                  }}
                  className="text-0.75 rounded-xxs bg-primary px-3 py-1 text-static-100"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
                  }}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="text-0.75 text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/signup';
                  }}
                >
                  회원가입
                </Link>
              </div>
            )}
            <button type="button" onClick={toggleMenu}>
              <img
                src="/icons/hamburger-md-black.svg"
                alt="네비게이션 아이콘"
              />
            </button>
          </div>
        </div>
      </section>

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
      <aside
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
            <SideNavItem
              to="/report/landing"
              onClick={closeMenu}
              hoverItem={reportItems}
            >
              🔥 서류 진단받고 합격하기
            </SideNavItem>
            {/* <SideNavItem
              to="#"
              onClick={closeMenu}
              hoverItem={interviewHoverItem}
              target="_blank"
              rel="noopenner noreferrer"
            >
              🔎 모의 면접하고 합격하기
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
      </aside>

      {/* 네비게이션 바 공간 차지 */}
      <div className="h-[3.75rem] md:h-[4.375rem] lg:h-[4.75rem]" />
    </header>
  );
};

export default NavBar;
