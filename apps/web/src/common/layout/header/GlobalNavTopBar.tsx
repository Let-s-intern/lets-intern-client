import {
  useGetUserAdmin,
  useIsMentorQuery,
  useUserQuery,
} from '@/api/user/user';
import { buildCrossAppUrl } from '@/common/utils/crossAppUrl';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import { logoutAndRefreshPage } from '@/utils/auth';
import { usePathname, useRouter } from 'next/navigation';
import GlobalNavItem from './GlobalNavItem';
import LoginLink from './LoginLink';
import LogoLink from './LogoLink';
import SignUpLink from './SignUpLink';
import { SubNavItemProps } from './SubNavItem';

interface Props {
  loginRedirect: string;
  toggleMenu: () => void;
  isLoginPage?: boolean;
}

function GlobalNavTopBar({ loginRedirect, toggleMenu, isLoginPage }: Props) {
  const router = useRouter();
  const pathname = usePathname(); // for nextjs pathname change detect

  const { isLoggedIn } = useAuthStore();
  const { data: isAdmin } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });
  const { data: isMentor } = useIsMentorQuery({
    enabled: isLoggedIn,
    retry: 1,
  });
  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });

  // 멘토 마이페이지: env 가 있을 때만 노출. 분리 도메인 운영 전엔 메뉴 자체를 숨김.
  const mentorUrl = process.env.NEXT_PUBLIC_MENTOR_URL;
  const userSubNavList: SubNavItemProps[] = [
    {
      children: '마이페이지',
      href: '/mypage/career/board',
    },
    ...(isMentor && mentorUrl
      ? [
          {
            children: '멘토 마이페이지',
            href: buildCrossAppUrl(mentorUrl, '/mentor'),
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            children: '관리자페이지',
            href: buildCrossAppUrl(process.env.NEXT_PUBLIC_ADMIN_URL, '/admin'),
          },
        ]
      : []),
    {
      children: '로그아웃',
      onClick: logoutAndRefreshPage,
    },
  ];
  return (
    <nav className="mw-1180 flex h-11 items-center justify-between md:h-full md:py-4">
      <div className="flex h-full items-center">
        {/* 로고 */}
        <LogoLink className="mr-8" />
        {/* 네비 메뉴 */}
        <GlobalNavItem
          className={twMerge(
            'mr-6 hidden h-9 items-center border-b-[1.5px] border-transparent md:flex',
            pathname === '/' && 'border-neutral-0',
          )}
          href="/"
        >
          홈
        </GlobalNavItem>
        <GlobalNavItem
          className={twMerge(
            'mr-6 hidden h-9 items-center border-b-[1.5px] border-transparent md:flex',
            pathname === '/about' && 'border-neutral-0',
          )}
          href="/about"
        >
          렛츠커리어 스토리
        </GlobalNavItem>
        <GlobalNavItem
          className={twMerge(
            'b2b_landing_click mr-6 hidden h-9 items-center border-b-[1.5px] border-transparent md:flex',
            pathname.startsWith('/b2b') && 'border-neutral-0',
          )}
          href="/b2b"
        >
          기업/학교 취업 교육 문의
        </GlobalNavItem>
        <GlobalNavItem
          className={twMerge(
            'hidden items-center justify-center gap-1 border-b-[1.5px] border-transparent md:flex',
            pathname.startsWith('/community') && 'border-neutral-0',
          )}
          href="/community"
        >
          커뮤니티
          <span className="text-xxsmall12 flex h-auto items-center font-normal">
            +현직자 멘토 참여중
          </span>
        </GlobalNavItem>
      </div>

      <div className="flex items-center justify-center gap-1">
        {/* 슈퍼인턴 프로모션 영역 */}
        {/* <Promotion /> */}
        {isLoggedIn ? (
          <GlobalNavItem
            className="hidden cursor-pointer items-center md:flex"
            subNavList={userSubNavList}
            showDropdownIcon={false}
            align="right"
          >
            <div className="flex items-center gap-2">
              <span className="text-xsmall16 text-neutral-0 pl-2 font-medium">
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
          <div className="-mr-3 hidden items-center md:flex">
            {/* 로그인 */}
            <LoginLink redirect={loginRedirect} />
            <SignUpLink />
          </div>
        )}
        {isLoginPage ? (
          <i
            className="cursor-pointer md:hidden"
            aria-label="홈으로 이동"
            onClick={() => router.push('/')}
          >
            <img
              className="h-6 w-6"
              src="/icons/Close_SM.svg"
              alt="닫기 아이콘"
            />
          </i>
        ) : (
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
        )}
      </div>
    </nav>
  );
}

export default GlobalNavTopBar;
