import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const NavBar = () => {
  const params = useParams<{ programId: string; applicationId: string }>();
  const pathname = usePathname();
  const applicationId = params.applicationId;

  if (location.pathname.endsWith('user/info')) return null;

  const activeStatus = pathname.endsWith('me')
    ? 'MY_MISSION'
    : pathname.endsWith('guides')
      ? 'GUIDE'
      : 'DASHBOARD';

  return (
    <>
      {/* 모바일: 상단 수평 탭, 데스크톱: 사이드 네비게이션 */}
      <nav className="w-full md:w-[220px]">
        <ul className="flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 scrollbar-hide md:sticky md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
          <li className="flex-shrink-0 md:flex-shrink">
            <Link
              href={`/challenge/${applicationId}/${params.programId}`}
              className={clsx(
                'flex flex-row items-center whitespace-nowrap rounded-xxs text-xsmall14 font-semibold transition-colors md:h-[44px] md:px-3 md:text-xsmall16 md:font-medium',
                {
                  'font-semibold text-primary md:bg-primary-5':
                    activeStatus === 'DASHBOARD',
                  'font-medium text-neutral-30': activeStatus !== 'DASHBOARD',
                },
              )}
            >
              대시보드
            </Link>
          </li>
          <li className="flex-shrink-0 md:flex-shrink">
            <Link
              href={`/challenge/${applicationId}/${params.programId}/me`}
              className={clsx(
                'flex flex-row items-center whitespace-nowrap rounded-xxs text-xsmall14 font-semibold transition-colors md:h-[44px] md:px-3 md:text-xsmall16 md:font-medium',
                {
                  'font-semibold text-primary md:bg-primary-5':
                    activeStatus === 'MY_MISSION',
                  'font-medium text-neutral-30': activeStatus !== 'MY_MISSION',
                },
              )}
            >
              나의 미션
            </Link>
          </li>
          <li className="flex-shrink-0 md:flex-shrink">
            <Link
              href={`/challenge/${applicationId}/${params.programId}/guides`}
              className={clsx(
                'flex flex-row items-center whitespace-nowrap rounded-xxs text-xsmall14 font-semibold transition-colors md:h-[44px] md:px-3 md:text-xsmall16 md:font-medium',
                {
                  'font-semibold text-primary md:bg-primary-5':
                    activeStatus === 'GUIDE',
                  'font-medium text-neutral-30': activeStatus !== 'GUIDE',
                },
              )}
            >
              공지사항 / 챌린지 가이드
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
