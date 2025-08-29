import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';

const NavBar = () => {
  const params = useParams();
  const location = useLocation();
  const applicationId = params.applicationId;

  const activeStatus = location.pathname.endsWith('me')
    ? 'MY_DASHBOARD'
    : location.pathname.endsWith('guide')
      ? 'GUIDE'
      : 'DASHBOARD';
  const isChallengeUserInfoPage = location.pathname.endsWith('/user/info');

  if (isChallengeUserInfoPage) return null;

  return (
    <>
      <nav className="w-full md:w-[220px]">
        <ul className="flex flex-row gap-4 px-5 py-2 scrollbar-hide md:sticky md:top-[165px] md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
          <li>
            <Link
              to={`/challenge/${applicationId}/${params.programId}`}
              className={clsx('block px-3 py-[10px]', {
                'rounded-xxs bg-primary-5 font-semibold text-primary':
                  activeStatus === 'DASHBOARD',
                'text-neutral-40': activeStatus !== 'DASHBOARD',
              })}
            >
              대시보드
            </Link>
          </li>
          <li>
            <Link
              to={`/challenge/${applicationId}/${params.programId}/me`}
              className={clsx('block px-3 py-[10px]', {
                'rounded-xxs bg-primary-5 font-semibold text-primary':
                  activeStatus === 'MY_DASHBOARD',
                'text-neutral-40': activeStatus !== 'MY_DASHBOARD',
              })}
            >
              나의 미션
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
