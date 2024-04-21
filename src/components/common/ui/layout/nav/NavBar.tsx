import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../../../../../utils/axios';
import NavItem from './NavItem';
import SideNavItem from './SideNavItem';

const NavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeLink, setActiveLink] = useState<
    'HOME' | 'ABOUT' | 'PROGRAM' | 'ADMIN' | 'BLOG' | ''
  >('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (location.pathname.startsWith('/about')) {
      setActiveLink('ABOUT');
    } else if (location.pathname.startsWith('/program')) {
      setActiveLink('PROGRAM');
    } else if (location.pathname.startsWith('/admin')) {
      setActiveLink('ADMIN');
      // [논의] 블로그 주소 확인 필요
    } else if (location.pathname.startsWith('/blog')) {
      setActiveLink('BLOG');
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
      <div className="fixed top-0 z-30 w-screen bg-static-100 px-5 sm:px-20 lg:px-28">
        <div className="mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-9">
            <Link to="/" className="w-12 sm:w-24">
              <img
                src="/logo/letscareer-logo-simple.png"
                alt="Logo"
                className="w-full sm:hidden"
              />
              <img
                src="/logo/letscareer-logo.png"
                alt="Logo"
                className="hidden w-full sm:block"
              />
            </Link>
            {/* 메뉴 아이템 */}
            <NavItem to="/" active={activeLink === 'HOME'}>
              홈
            </NavItem>
            <NavItem to="/program" active={activeLink === 'PROGRAM'}>
              프로그램
            </NavItem>
            <NavItem to="/blog" active={activeLink === 'BLOG'}>
              블로그
            </NavItem>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="hidden  gap-2 sm:flex ">
                <span className="block text-[1.125rem] font-medium">
                  {user?.name} 님
                </span>
                <img
                  src="/icons/user-circle.svg"
                  alt="User icon"
                  className="w-1.75"
                />
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="rounded-xxs bg-primary px-3 py-1 text-[0.75rem] text-white"
                >
                  로그인
                </Link>
                <Link to="/signup" className="text-[0.75rem] text-primary">
                  회원가입
                </Link>
              </div>
            )}
            <button
              type="button"
              className="block rounded-md text-gray-500 hover:text-gray-600"
              onClick={toggleMenu}
            >
              <img src="/icons/nav-icon.svg" alt="네비게이션 아이콘" />
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
            <span className="flex w-full items-center justify-between gap-4 px-4 text-neutral-0 sm:p-0">
              <span>
                환영합니다, <span className="text-primary">{user?.name}</span>님
              </span>
              <button className="text-primary" onClick={handleLogout}>
                로그아웃
              </button>
            </span>
          ) : (
            <div className="flex gap-6 text-[0.875rem]">
              <Link className="text-primary" to="/login" onClick={closeMenu}>
                로그인
              </Link>
              <Link to="/signup" onClick={closeMenu}>
                회원가입
              </Link>
            </div>
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
