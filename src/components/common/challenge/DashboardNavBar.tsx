import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';

const DashboardNavBar = () => {
  const params = useParams();
  const location = useLocation();
  const applicationId = params.applicationId;
  const activeStatus = location.pathname.endsWith('missions')
    ? 'MY_DASHBOARD'
    : 'DASHBOARD';

  return (
    <>
      <nav className="fixed hidden md:block">
        <ul className="flex w-[220px] flex-col gap-1">
          <li>
            <Link
              to={`/challenge/${params.programId}/dashboard/${applicationId}`}
              className={clsx('block px-3 py-2 text-sm md:text-xsmall16', {
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
              to={`/challenge/${params.programId}/dashboard/${applicationId}/missions`}
              className={clsx('block px-3 py-2 text-sm md:text-xsmall16', {
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
      <div className="md:w-[220px]" />
    </>
  );
};

export default DashboardNavBar;
