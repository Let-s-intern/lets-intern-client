import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';

const DashboardNavBar = () => {
  const params = useParams();
  const location = useLocation();
  const applicationId = params.applicationId;
  const activeStatus = location.pathname.endsWith('me')
    ? 'MY_MISSION'
    : location.pathname.endsWith('guide')
      ? 'GUIDE'
      : 'DASHBOARD';

  return (
    <>
      {/* 모바일: 상단 수평 탭, 데스크톱: 사이드 네비게이션 */}
      <nav className="w-full md:w-[220px]">
        <ul className="flex h-[40px] flex-row gap-4 overflow-x-auto border-b bg-white px-5 py-2 scrollbar-hide md:sticky md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
          <li className="flex-shrink-0 md:flex-shrink">
            <Link
              to={`/challenge/${applicationId}/${params.programId}`}
              className={clsx(
                'flex flex-row items-center whitespace-nowrap rounded-xxs text-xsmall14 font-semibold transition-colors md:h-[44px] md:px-3 md:text-xsmall16 md:font-medium',
                {
                  'font-semibold text-primary md:bg-primary-5':
                    activeStatus === 'DASHBOARD',
                  'font-medium text-[#4A495C]': activeStatus !== 'DASHBOARD',
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
                'flex flex-row items-center whitespace-nowrap rounded-xxs text-xsmall14 font-semibold transition-colors md:h-[44px] md:px-3 md:text-xsmall16 md:font-medium',
                {
                  'font-semibold text-primary md:bg-primary-5':
                    activeStatus === 'MY_MISSION',
                  'font-medium text-[#4A495C]': activeStatus !== 'MY_MISSION',
                },
              )}
            >
              나의 미션
            </Link>
          </li>
          {/* <li className="flex-shrink-0 md:flex-shrink">
            <Link
              to={`/challenge/${params.programId}/dashboard/${applicationId}/guide`}
              className={clsx(
                'flex flex-row items-center whitespace-nowrap rounded-xxs text-xsmall14 font-semibold transition-colors md:h-[44px] md:px-3 md:text-xsmall16',
                {
                  'text-primary md:bg-primary-5': activeStatus === 'GUIDE',
                  'text-[#4A495C]': activeStatus !== 'GUIDE',
                },
              )}
            >
              공지사항 / 챌린지 가이드
            </Link>
          </li> */}
        </ul>
      </nav>
    </>
  );
};

export default DashboardNavBar;
