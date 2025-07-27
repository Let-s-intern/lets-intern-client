import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';

const DashboardNavBar = () => {
  const params = useParams();
  const location = useLocation();
  const applicationId = params.applicationId;
  const activeStatus = location.pathname.endsWith('missions')
    ? 'MY_MISSION'
    : location.pathname.endsWith('guide')
      ? 'GUIDE'
      : 'DASHBOARD';

  return (
    <>
      <nav className="fixed w-56">
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              to={`/challenge/${params.programId}/dashboard/${applicationId}`}
              className={clsx('block px-3 py-2', {
                'rounded-xxs bg-primary-5 font-semibold text-primary':
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
              className={clsx('block px-3 py-2', {
                'rounded-xxs bg-primary-5 font-semibold text-primary':
                  activeStatus === 'MY_MISSION',
                'text-[#4A495C]': activeStatus === 'MY_MISSION',
              })}
            >
              나의 미션
            </Link>
          </li>
          <li>
            <Link
              to={`/challenge/${params.programId}/dashboard/${applicationId}/guide`}
              className={clsx('block px-3 py-2', {
                'rounded-xxs bg-primary-5 font-semibold text-primary':
                  activeStatus === 'GUIDE',
                'text-[#4A495C]': activeStatus === 'GUIDE',
              })}
            >
              공지사항 / 챌린지 가이드
            </Link>
          </li>
        </ul>
      </nav>
      <div className="w-56" />
    </>
  );
};

export default DashboardNavBar;
