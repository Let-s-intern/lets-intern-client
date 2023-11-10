import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SmallLinkProps {
  to: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

interface SideNavItemProps {
  to: string;
  onClick?: () => void;
  children: string;
}

const SmallLink = ({ to, active, onClick, children }: SmallLinkProps) => {
  return (
    <Link
      to={to}
      className={`px-4 text-sm${
        active ? ' text-primary' : ' text-neutral-grey'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

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

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 네비게이션 바 */}
      <div className="relative">
        {/* 상단 네비게이션 바 */}
        <div className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between bg-white px-5">
          <Link to="/" className="h-10 w-10">
            <img src="/logo/logo.png" alt="Logo" className="w-full" />
          </Link>
          <button
            type="button"
            className="rounded-md text-gray-500 hover:text-gray-600"
            onClick={toggleMenu}
          >
            <i>
              <img src="/icons/nav-icon.svg" alt="네비게이션 아이콘" />
            </i>
          </button>
        </div>
        {/* 투명한 검정색 배경 */}
        <div
          className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ${
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
            <div>
              <SmallLink to="/login" onClick={closeMenu}>
                로그인
              </SmallLink>
              <SmallLink to="/signup" onClick={closeMenu} active>
                회원가입
              </SmallLink>
            </div>
            <Link to="/mypage/privacy" onClick={closeMenu}>
              <i>
                <img src="/icons/user.svg" alt="마이 페이지 아이콘" />
              </i>
            </Link>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <SideNavItem to="/" onClick={closeMenu}>
              프로그램
            </SideNavItem>
            <SideNavItem to="/mypage/application" onClick={closeMenu}>
              마이페이지
            </SideNavItem>
          </div>
        </div>
      </div>
      {/* 네비게이션 바 공간 차지 */}
      <div className="h-16"></div>
    </>
  );
};

export default NavBar;
