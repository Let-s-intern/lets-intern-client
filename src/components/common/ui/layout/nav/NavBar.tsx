import { useGetActiveReports } from '@/api/report';
import { useGetUserAdmin, User, useUserQuery } from '@/api/user';
import { hasActiveReport } from '@/hooks/useActiveReports';
import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import useScrollStore from '@/store/useScrollStore';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import GlobalNavTopBar from '../header/GlobalNavTopBar';
import KakaoChannel from './KakaoChannel';
import NavItem from './NavItem';
import { NavSubItemProps } from './NavSubItem';
import SideNavItem from './SideNavItem';

const reportHoverItem: NavSubItemProps[] = [
  {
    text: '이력서 진단 받기',
    to: 'report/landing/resume',
  },
  {
    text: '자기소개서 진단 받기',
    to: 'report/landing/personal-statement',
  },
  {
    text: '포트폴리오 진단 받기',
    to: 'report/landing/portfolio',
  },
  {
    text: 'MY 진단서 보기',
    to: 'report/management',
  },
];

const scrollEventPage = [
  '/report/landing',
  '/program/challenge',
  '/program/live',
];

type ActiveLinks =
  | 'HOME'
  | 'ABOUT'
  | 'PROGRAM'
  | 'ADMIN'
  | 'BLOG'
  | 'REPORT'
  | 'REVIEW'
  | '';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef(0);

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reportItems, setReportItems] = useState<NavSubItemProps[]>([]);
  const [activeLink, setActiveLink] = useState<ActiveLinks>('');

  const { isLoggedIn, logout } = useAuthStore();
  const { setScrollDirection, scrollDirection } = useScrollStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const { data: userData } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const { data: isAdminData } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });

  const { data, isLoading } = useGetActiveReports();
  useEffect(() => {
    // 활성화된 레포트 있는지 확인
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
    // 네비 메뉴 활성화
    if (location.pathname.startsWith('/about')) {
      setActiveLink('ABOUT');
    } else if (location.pathname.startsWith('/program')) {
      setActiveLink('PROGRAM');
    } else if (location.pathname.startsWith('/admin')) {
      setActiveLink('ADMIN');
    } else if (location.pathname.startsWith('/blog')) {
      setActiveLink('BLOG');
    } else if (location.pathname.startsWith('/report')) {
      setActiveLink('REPORT');
    } else if (location.pathname.startsWith('/review')) {
      setActiveLink('REVIEW');
    } else if (location.pathname === '/') {
      setActiveLink('HOME');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }

    if (isAdminData) {
      setIsAdmin(isAdminData);
    }
  }, [userData, isAdminData]);

  useEffect(() => {
    /** 네비바 숨김/표시 로직 */
    if (typeof window === 'undefined') return;

    setScrollDirection('UP');

    const handleScroll = () => {
      // 현재 경로가 scrollEventPage 중 하나로 시작되지 않을 때는 스크롤 이벤트를 무시
      if (!scrollEventPage.some((page) => location.pathname.startsWith(page)))
        return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 500) {
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
  }, [location.pathname, setScrollDirection]);

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <div
        className={`lg:p-30 fixed top-0 z-30 h-[3.75rem] w-screen border-b border-neutral-80 bg-white px-5 sm:px-20 md:h-[4.375rem] lg:h-[4.75rem] lg:px-28 ${scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-300`}
      >
        {/* 1단 */}
        <GlobalNavTopBar
          isActiveHome={activeLink === 'HOME'}
          username={user?.name ?? undefined}
          loginRedirect={encodeURIComponent(location.pathname)}
          toggleMenu={toggleMenu}
        />
        {/* 2단 */}
        <div>
          {/* 메뉴 아이템 */}
          <NavItem to="/about" active={activeLink === 'ABOUT'}>
            렛츠커리어 스토리
          </NavItem>
          <NavItem to="/program" active={activeLink === 'PROGRAM'}>
            프로그램
          </NavItem>
          <NavItem to="/review" active={activeLink === 'REVIEW'} reloadDocument>
            100% 솔직 후기
          </NavItem>
          <NavItem
            to="/blog/list"
            active={activeLink === 'BLOG'}
            reloadDocument
          >
            블로그
          </NavItem>
          <NavItem
            as="div"
            to={reportHoverItem[0].to}
            active={activeLink === 'REPORT'}
            hoverItem={reportItems}
            isItemLoaded={!isLoading && !!data}
            reloadDocument
          >
            🔥 서류 진단받고 합격하기
          </NavItem>
        </div>
      </div>

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
          'fixed right-0 top-0 z-50 h-screen w-[18.25rem] flex-col bg-white shadow-md transition-all duration-300 sm:w-[22rem]',
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
                    navigate('/');
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
                  to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                  onClick={closeMenu}
                >
                  로그인
                </Link>
                <Link to="/signup" onClick={closeMenu}>
                  회원가입
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <SideNavItem to="/mypage/application" onClick={closeMenu}>
              마이페이지
            </SideNavItem>
            <hr className="h-1 bg-neutral-80" />
            <SideNavItem to="/about" onClick={closeMenu}>
              렛츠커리어 스토리
            </SideNavItem>
            <SideNavItem to="/program" onClick={closeMenu}>
              프로그램
            </SideNavItem>
            <SideNavItem to="/review" onClick={closeMenu} reloadDocument>
              100% 솔직 후기
            </SideNavItem>
            <SideNavItem to="/blog/list" onClick={closeMenu} reloadDocument>
              블로그
            </SideNavItem>
            <SideNavItem
              to="/report/landing"
              onClick={closeMenu}
              hoverItem={reportItems}
              reloadDocument
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
              className="q&a_gnb mb-36"
            >
              자주 묻는 질문
            </SideNavItem>
          </div>
        </div>
      </div>
      {/* 네비게이션 바 공간 차지 */}
      <div className="h-[3.75rem] md:h-[4.375rem] lg:h-[4.75rem]" />
    </>
  );
};

export default NavBar;
