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

  return (
    <>
      <nav className="fixed">
        <ul className="flex w-[220px] flex-col gap-1">
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
      <div className="md:w-[220px]"></div>
    </>
  );
};

export default NavBar;
