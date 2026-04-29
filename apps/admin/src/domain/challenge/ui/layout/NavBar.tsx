import clsx from 'clsx';
import { Link, useParams, useLocation } from 'react-router-dom';
const NavBar = () => {
  const params = useParams<{ programId: string; applicationId: string }>();
  const pathname = useLocation().pathname;
  const applicationId = params.applicationId;

  if (pathname.endsWith('user/info')) return null;

  const activeStatus = pathname.endsWith('me')
    ? 'MY_MISSION'
    : pathname.endsWith('guides')
      ? 'GUIDE'
      : 'DASHBOARD';

  return (
    <>
      {/* 모바일: 상단 수평 탭, 데스크톱: 사이드 네비게이션 */}
      <nav className="w-full md:w-[220px]">
        <ul className="scrollbar-hide flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 md:sticky md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
          <li className="flex-shrink-0 md:flex-shrink">
            <Link
              to={`/challenge/${applicationId}/${params.programId}`}
              className={clsx(
                'rounded-xxs text-xsmall14 md:text-xsmall16 flex flex-row items-center whitespace-nowrap font-semibold transition-colors md:h-[44px] md:px-3 md:font-medium',
                {
                  'text-primary md:bg-primary-5 font-semibold':
                    activeStatus === 'DASHBOARD',
                  'text-neutral-30 font-medium': activeStatus !== 'DASHBOARD',
                },
              )}
            >
              대시보드
            </Link>
          </li>
          <li className="flex-shrink-0 md:flex-shrink">
            <Link
              to={`/challenge/${applicationId}/${params.programId}/me`}
              className={clsx(
                'rounded-xxs text-xsmall14 md:text-xsmall16 flex flex-row items-center whitespace-nowrap font-semibold transition-colors md:h-[44px] md:px-3 md:font-medium',
                {
                  'text-primary md:bg-primary-5 font-semibold':
                    activeStatus === 'MY_MISSION',
                  'text-neutral-30 font-medium': activeStatus !== 'MY_MISSION',
                },
              )}
            >
              나의 미션
            </Link>
          </li>
          <li className="flex-shrink-0 md:flex-shrink">
            <Link
              to={`/challenge/${applicationId}/${params.programId}/guides`}
              className={clsx(
                'rounded-xxs text-xsmall14 md:text-xsmall16 flex flex-row items-center whitespace-nowrap font-semibold transition-colors md:h-[44px] md:px-3 md:font-medium',
                {
                  'text-primary md:bg-primary-5 font-semibold':
                    activeStatus === 'GUIDE',
                  'text-neutral-30 font-medium': activeStatus !== 'GUIDE',
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
