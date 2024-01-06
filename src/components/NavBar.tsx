import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axios';
import TabBar from './TabBar';
import TabItem from './TabItem';

interface SideNavItemProps {
  to: string;
  onClick?: () => void;
  children: string;
}

const NavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeLink, setActiveLink] = useState<
    'HOME' | 'ABOUT' | 'PROGRAM' | 'ADMIN' | ''
  >('');
  const [showTopTabBar, setShowTopTabBar] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (
      location.pathname.startsWith('/login') ||
      location.pathname.startsWith('/signup') ||
      location.pathname.startsWith('/find-password') ||
      location.pathname.startsWith('/mypage')
    ) {
      setShowTopTabBar(false);
      return;
    } else {
      setShowTopTabBar(true);
    }
    if (location.pathname.startsWith('/about')) {
      setActiveLink('ABOUT');
    } else if (location.pathname.startsWith('/program')) {
      setActiveLink('PROGRAM');
    } else if (location.pathname.startsWith('/admin')) {
      setActiveLink('ADMIN');
    } else if (location.pathname.startsWith('/')) {
      setActiveLink('HOME');
    }
  }, [location]);

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
      fetchAndSetUser();
    }
    if (!accessToken || !refreshToken) {
      return;
    }
    const fetchIsAdmin = async () => {
      try {
        const res = await axios.get('/user/isAdmin');
        if (res.data) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchIsAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAndSetUser = async () => {
    try {
      const res = await axios.get('/user');
      setUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <div className="fixed top-0 z-30 w-full bg-white pe-[1.5rem] ps-[1.125rem]">
        <div className="mx-auto flex h-16 items-center justify-between">
          <Link to="/" className="h-10 w-10">
            <img src="/logo/logo.png" alt="Logo" className="w-full" />
          </Link>
          <div className="hidden sm:block">
            {isLoggedIn ? (
              <MyInfoSpan className="gap-2">
                <div className="flex gap-2">
                  <span>
                    <b>{user?.name}</b>님
                  </span>
                  <button onClick={handleLogout} className="text-[0.75rem]">
                    로그아웃
                  </button>
                </div>
                <Link
                  to="/mypage/application"
                  className="rounded bg-primary px-2 py-1 text-[0.75rem] text-white"
                >
                  마이페이지
                </Link>
              </MyInfoSpan>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded bg-primary px-3 py-1 text-[0.75rem] text-white"
                >
                  로그인
                </Link>
                <Link to="/signup" className="text-[0.75rem] text-primary">
                  회원가입
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            className="block rounded-md text-gray-500 hover:text-gray-600 sm:hidden"
            onClick={toggleMenu}
          >
            <i>
              <img src="/icons/nav-icon.svg" alt="네비게이션 아이콘" />
            </i>
          </button>
        </div>
      </div>
      {/* 상단 메뉴 탭 바 */}
      {showTopTabBar && (
        <div className="hidden h-9 sm:block">
          <TabBar>
            <TabItem to="/" active={activeLink === 'HOME'}>
              홈
            </TabItem>
            <TabItem to="/about" active={activeLink === 'ABOUT'}>
              브랜드 스토리
            </TabItem>
            <TabItem to="/program" active={activeLink === 'PROGRAM'}>
              프로그램
            </TabItem>
            {isAdmin && (
              <TabItem to="/admin" active={activeLink === 'ADMIN'}>
                관리자 페이지
              </TabItem>
            )}
          </TabBar>
        </div>
      )}
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
        className={`fixed right-0 top-0 z-50 h-screen w-full bg-white p-5 shadow-md transition-all sm:w-80 duration-300${
          isOpen ? ' translate-x-0' : ' translate-x-full'
        }`}
      >
        <div className="flex w-full justify-end">
          <i className="cursor-pointer" onClick={closeMenu}>
            <img src="/icons/x.svg" alt="X" />
          </i>
        </div>
        <div className="mt-4 flex justify-between">
          {isLoggedIn ? (
            <MyInfoSpan>
              <span>
                환영합니다, <b>{user?.name}</b>님
              </span>
              <button onClick={handleLogout}>로그아웃</button>
            </MyInfoSpan>
          ) : (
            <LoginLinkGroup>
              <Link to="/login" onClick={closeMenu}>
                로그인
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                회원가입
              </Link>
            </LoginLinkGroup>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <SideNavItem to="/" onClick={closeMenu}>
            홈
          </SideNavItem>
          <SideNavItem to="/about" onClick={closeMenu}>
            브랜드 스토리
          </SideNavItem>
          <SideNavItem to="/program" onClick={closeMenu}>
            프로그램
          </SideNavItem>
          <SideNavItem to="/mypage/application" onClick={closeMenu}>
            마이페이지
          </SideNavItem>
          {isAdmin && (
            <SideNavItem to="/admin" onClick={closeMenu}>
              관리자 페이지
            </SideNavItem>
          )}
        </div>
      </div>
      {/* 네비게이션 바 공간 차지 */}
      <div className="h-[3.75rem]"></div>
    </>
  );
};

export default NavBar;

const SideNavItem = ({ to, onClick, children }: SideNavItemProps) => {
  return (
    <Link
      to={to}
      className="flex w-full cursor-pointer justify-between rounded-md bg-gray-100 px-7 py-5 text-neutral-grey"
      onClick={onClick}
    >
      <span>{children}</span>
      <i>
        <img src="/icons/arrow-right.svg" alt="오른쪽 화살표" />
      </i>
    </Link>
  );
};

const MyInfoSpan = styled.span`
  color: #505050;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0 1rem;

  @media screen and (min-width: 640px) {
    padding: 0;
  }

  span {
    b {
      color: #6963f6;
      font-weight: 400;
    }
  }

  button {
    color: #6963f6;
  }
`;

const LoginLinkGroup = styled.div`
  margin-left: 1rem;
  font-size: 0.875rem;
  display: flex;
  gap: 1.5rem;

  a {
    &:nth-child(1) {
      color: #6963f6;
    }
  }
`;
