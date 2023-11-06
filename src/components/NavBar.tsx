import { useState } from 'react';
import { HiOutlineX, HiOutlineMenu, HiOutlineChatAlt2 } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SideNavBar = styled.div`
  height: calc(100vh - 4rem);
`;

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
      <div className="relative">
        <div className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-5 shadow-md sm:px-6 lg:px-8">
          <Link to="/">
            <img src="/logo/logo.svg" alt="Logo" />
          </Link>
          <button
            type="button"
            className="rounded-md text-gray-500 hover:text-gray-600"
            onClick={toggleMenu}
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>
        </div>
        <SideNavBar
          className={`fixed right-0 top-16 z-40 flex w-64 flex-col justify-between bg-white px-8 py-8 shadow-md transition-all duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="w-full text-right">
              <button
                type="button"
                className="rounded-md text-gray-500 hover:text-gray-600"
                onClick={toggleMenu}
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-5">
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className="block text-xl font-medium text-gray-900 hover:text-gray-600"
                    onClick={closeMenu}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/program"
                    className="block text-xl font-medium text-gray-900 hover:text-gray-600"
                    onClick={closeMenu}
                  >
                    프로그램
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mypage"
                    className="block text-xl font-medium text-gray-900 hover:text-gray-600"
                    onClick={closeMenu}
                  >
                    마이페이지
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="mt-16 flex justify-between">
              <Link
                to="/login"
                className="w-24 rounded-full border border-gray-300 px-4 py-1 text-center text-black hover:text-gray-600"
                onClick={closeMenu}
              >
                로그인
              </Link>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="rounded-md text-gray-500 hover:text-gray-600"
                >
                  <HiOutlineChatAlt2 className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="rounded-md text-gray-500 hover:text-gray-600"
                >
                  <FaUserCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </SideNavBar>
        <div
          className={`fixed inset-0 z-30 bg-black transition-opacity duration-300 ${
            isOpen
              ? 'opacity-50 ease-out'
              : 'pointer-events-none opacity-0 ease-in'
          }`}
          onClick={toggleMenu}
        ></div>
      </div>
      <div className="spacer h-16"></div>
    </>
  );
};

export default NavBar;
