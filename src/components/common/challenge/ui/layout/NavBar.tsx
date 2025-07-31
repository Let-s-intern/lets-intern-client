import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';

const NavBar = () => {
  const params = useParams();
  const location = useLocation();
  const applicationId = params.applicationId;
  const activeStatus = /^\/challenge\/(\d+)\/others/.test(location.pathname)
    ? 'OTHERS_DASHBOARD'
    : /^\/challenge\/(\d+)\/me/.test(location.pathname)
      ? 'MY_DASHBOARD'
      : /^\/challenge\/(\d+)$/.test(location.pathname) && 'DASHBOARD';

  return (
    <>
      <nav className="fixed">
        <ul className="flex w-40 flex-col gap-1">
          <li>
            <Link
              to={`/challenge/${applicationId}/${params.programId}`}
              className={clsx('block px-3 py-2', {
                'rounded bg-[#E6E4FD] font-semibold text-primary':
                  activeStatus === 'DASHBOARD',
                'text-[#4A495C]': activeStatus === 'DASHBOARD',
              })}
            >
              대시보드
            </Link>
          </li>
          <li>
            <Link
              to={`/challenge/${applicationId}/${params.programId}/me`}
              className={clsx('block px-3 py-2', {
                'rounded bg-[#E6E4FD] font-medium text-primary':
                  activeStatus === 'MY_DASHBOARD',
                'text-[#4A495C]': activeStatus === 'MY_DASHBOARD',
              })}
            >
              나의 기록장
            </Link>
          </li>
        </ul>
      </nav>
      <div className="w-[10rem]"></div>
    </>
  );
};

export default NavBar;
