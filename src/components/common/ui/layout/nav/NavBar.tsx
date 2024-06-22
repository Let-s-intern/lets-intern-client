import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../../../utils/axios';
import NavItem from './NavItem';
import SideNavItem from './SideNavItem';
import useAuthStore from '../../../../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="lg:p-30 fixed top-0 z-30 w-screen border-b border-neutral-80 bg-static-100 px-5 sm:px-20 lg:px-28">
        <div className="flex h-[3.75rem] items-center justify-between md:h-[4.375rem] lg:h-[4.75rem]">
          <div className="flex items-center gap-6 sm:gap-9">
            <Link to="/" className="h-[34px] w-auto md:h-[2.2rem]">
              <img
                src="/logo/logo-simple.svg"
                alt="렛츠커리어 로고"
                className="w-full md:hidden"
              />
              <img
                src="/logo/logo.svg"
                alt="렛츠커리어 로고"
                className="hidden w-full md:block"
              />
            </Link>
            {/* 메뉴 아이템 */}
            <NavItem to="/" active={activeLink === 'HOME'}>
              홈
            </NavItem>
            <NavItem to="/program" active={activeLink === 'PROGRAM'}>
              프로그램
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
                  src="/icons/user-circle.svg"
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
              <button className="text-primary" onClick={logout}>
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
        <div className="mt-5 flex flex-col gap-2">
          <SideNavItem to="/" onClick={closeMenu}>
            홈
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
          <SideNavItem
            to="https://letscareer.oopy.io"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            자주 묻는 질문
          </SideNavItem>
          <SideNavItem
            to="https://letscareer.oopy.io"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            공지사항
          </SideNavItem>
        </div>
      </div>
      {/* 네비게이션 바 공간 차지 */}
      <div className="h-[3.75rem] md:h-[4.375rem] lg:h-[4.75rem]"></div>
    </>
  );
};

export default NavBar;
