import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useAuthStore from '../../../../../store/useAuthStore';
import axios from '../../../../../utils/axios';
import KakaoChannel from './KakaoChannel';
import NavItem from './NavItem';
import SideNavItem from './SideNavItem';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeLink, setActiveLink] = useState<
    'HOME' | 'ABOUT' | 'PROGRAM' | 'ADMIN' | 'BLOG' | 'REPORT' | ''
  >('');

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

  useEffect(() => {
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
    } else if (location.pathname.startsWith('/')) {
      setActiveLink('HOME');
    }
  }, [location]);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }

    if (isAdminData) {
      setIsAdmin(isAdminData);
    }
  }, [userData, isAdminData]);

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <div className="lg:p-30 fixed top-0 z-30 h-[3.75rem] md:h-[4.375rem] lg:h-[4.75rem] w-screen border-b border-neutral-80 bg-static-100 px-5 sm:px-20 lg:px-28">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-9">
            <Link to="/" className="h-[1.75rem] md:h-[2.2rem]">
              <img
                src="/logo/logo-gradient-text.svg"
                alt="렛츠커리어 로고"
                className="h-full w-auto"
              />
            </Link>
            {/* 메뉴 아이템 */}
            <NavItem to="/about" active={activeLink === 'ABOUT'}>
              렛츠커리어 스토리
            </NavItem>
            <NavItem to="/program" active={activeLink === 'PROGRAM'}>
              프로그램
            </NavItem>
            <NavItem to="/blog/list" active={activeLink === 'BLOG'}>
              블로그
            </NavItem>
            <NavItem to="/report/landing" active={activeLink === 'REPORT'}>
              🔥 서류 진단받고 합격하기
            </NavItem>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div
                className="hidden cursor-pointer gap-2 sm:flex"
                onClick={() => navigate('/mypage/application')}
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
                  to="/login"
                  className="text-0.75 rounded-xxs bg-primary px-3 py-1 text-static-100"
                >
                  로그인
                </Link>
                <Link to="/signup" className="text-0.75 text-primary">
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
      </div>

      {/* 투명한 검정색 배경 */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isOpen
            ? 'opacity-50 ease-out'
            : 'pointer-events-none opacity-0 ease-in'
        }`}
        onClick={toggleMenu}
      ></div>
      {/* 사이드 네비게이션 바 */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full bg-white shadow-md transition-all duration-300 sm:w-[22rem] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex w-full items-center justify-between p-5">
          <div className="h-[1.75rem]">
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
        <div className="flex flex-col gap-5 py-10">
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
                <Link className="text-primary" to="/login" onClick={closeMenu}>
                  로그인
                </Link>
                <Link to="/signup" onClick={closeMenu}>
                  회원가입
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
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
            <SideNavItem to="/blog/list" onClick={closeMenu}>
              블로그
            </SideNavItem>
            <SideNavItem to="/report/landing" onClick={closeMenu}>
              🔥 서류 진단받고 합격하기
            </SideNavItem>
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
      <div className="h-[3.75rem] md:h-[4.375rem] lg:h-[4.75rem]"></div>
    </>
  );
};

export default NavBar;
