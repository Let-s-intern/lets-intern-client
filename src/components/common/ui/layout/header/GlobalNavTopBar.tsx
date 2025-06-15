import { useGetUserAdmin, useUserQuery } from '@/api/user';
import useAuthStore from '@/store/useAuthStore';
import GlobalNavItem from './GlobalNavItem';
import LoginLink from './LoginLink';
import LogoLink from './LogoLink';
import SignUpLink from './SignUpLink';
import { SubNavItemProps } from './SubNavItem';

interface Props {
  isNextRouter: boolean;
  loginRedirect: string;
  toggleMenu: () => void;
}

function GlobalNavTopBar({ isNextRouter, loginRedirect, toggleMenu }: Props) {
  const { isLoggedIn, logout } = useAuthStore();
  const { data: isAdmin } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });
  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const userSubNavList: SubNavItemProps[] = [
    {
      children: '마이페이지',
      href: '/mypage/application',
      isNextRouter: true,
    },
    ...(isAdmin
      ? [
          {
            children: '관리자페이지',
            href: '/admin',
            isNextRouter: true,
          },
        ]
      : []),
    {
      children: '로그아웃',
      onClick: () => {
        logout();
        window.location.href = '/';
      },
      isNextRouter: true,
    },
  ];
  return (
    <nav className="mw-1180 flex h-11 items-center justify-between md:h-full md:py-4">
      <div className="flex h-full items-center">
        {/* 로고 */}
        <LogoLink className="mr-8" isNextRouter={isNextRouter} />
        {/* 네비 메뉴 */}
        <GlobalNavItem
          className="mr-6 hidden h-[38px] items-center border-b-[1.5px] border-neutral-0 md:flex"
          isNextRouter={isNextRouter}
          href="/"
        >
          홈
        </GlobalNavItem>
        <GlobalNavItem
          className="hidden items-center justify-center gap-1 md:flex"
          isNextRouter={isNextRouter}
          href="https://letscareer.oopy.io/1df5e77c-bee1-80b3-8199-e7d2cc9d64cd"
          target="_blank"
          rel="noopener noreferrer"
        >
          커뮤니티
          <span className="flex h-auto items-center text-xxsmall12 font-normal">
            +현직자 멘토 참여중
          </span>
        </GlobalNavItem>
      </div>

      <div className="flex items-center justify-center gap-4">
        {isLoggedIn ? (
          <GlobalNavItem
            className="hidden cursor-pointer items-center md:flex"
            isNextRouter={isNextRouter}
            subNavList={userSubNavList}
            showDropdownIcon={false}
            align="right"
          >
            <div className="flex items-center gap-2">
              <span className="text-xsmall16 font-medium text-neutral-0">
                {user?.name} 님
              </span>
              <img
                src="/icons/user-user-circle-black.svg"
                alt=""
                aria-hidden="true"
                className="h-6 w-6"
              />
            </div>
          </GlobalNavItem>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            {/* 로그인 */}
            <LoginLink
              redirect={loginRedirect}
              isNextRouter={isNextRouter}
              force={isNextRouter}
            />
            <SignUpLink isNextRouter={isNextRouter} force={isNextRouter} />
          </div>
        )}
        <i
          className="cursor-pointer md:hidden"
          aria-label="메뉴 열기"
          onClick={toggleMenu}
        >
          <img
            className="h-6 w-6"
            src="/icons/hamburger-md-black.svg"
            alt="네비게이션 아이콘"
          />
        </i>
      </div>
    </nav>
  );
}

export default GlobalNavTopBar;
