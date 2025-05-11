import { useUserQuery } from '@/api/user';
import useAuthStore from '@/store/useAuthStore';
import GlobalNavItem from './GlobalNavItem';
import LoginLink from './LoginLink';
import LogoLink from './LogoLink';
import SignUpLink from './SignUpLink';

interface Props {
  isNextRouter: boolean;
  isActiveHome: boolean;
  loginRedirect: string;
  toggleMenu: () => void;
}

function GlobalNavTopBar({
  isNextRouter,
  isActiveHome,
  loginRedirect,
  toggleMenu,
}: Props) {
  const { isLoggedIn } = useAuthStore();

  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });

  return (
    <nav className="mw-1140 flex h-full items-center justify-between py-4">
      <div className="flex h-full items-center gap-4 sm:gap-9">
        {/* 로고 */}
        <LogoLink isNextRouter={isNextRouter} />
        {/* 네비 메뉴 */}
        <GlobalNavItem
          isNextRouter={isNextRouter}
          active={isActiveHome}
          href="/"
        >
          홈
        </GlobalNavItem>
        <GlobalNavItem
          isNextRouter={isNextRouter}
          href="https://letscareer.oopy.io/1df5e77c-bee1-80b3-8199-e7d2cc9d64cd"
          target="_blank"
          rel="noopener noreferrer"
        >
          커뮤니티{' '}
          <span className="text-xxsmall12 font-normal">
            +현직자 멘토 참여중
          </span>
        </GlobalNavItem>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div
            className="hidden cursor-pointer gap-2 md:flex"
            onClick={() => {
              window.location.href = '/mypage/application';
            }}
          >
            <span className="text-xsmall14 font-medium text-neutral-0">
              {user?.name} 님
            </span>
            <img
              src="/icons/user-user-circle-black.svg"
              alt=""
              aria-hidden="true"
              className="h-6 w-6"
            />
          </div>
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
          className="cursor-pointer"
          aria-label="메뉴 열기"
          onClick={toggleMenu}
        >
          <img
            className="h-8 w-8"
            src="/icons/hamburger-md-black.svg"
            alt="네비게이션 아이콘"
          />
        </i>
      </div>
    </nav>
  );
}

export default GlobalNavTopBar;
