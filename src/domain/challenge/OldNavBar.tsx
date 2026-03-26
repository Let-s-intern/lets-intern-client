import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const OldNavBar = () => {
  const params = useParams<{ programId: string; applicationId: string }>();
  const pathname = usePathname();
  const applicationId = params.applicationId;
  const activeStatus = /^\/old\/challenge\/(\d+)\/others/.test(pathname)
    ? 'OTHERS_DASHBOARD'
    : /^\/old\/challenge\/(\d+)\/me/.test(location.pathname)
      ? 'MY_DASHBOARD'
      : /^\/old\/challenge\/(\d+)$/.test(location.pathname) && 'DASHBOARD';

  return (
    <>
      <nav className="fixed">
        <ul className="flex w-40 flex-col gap-1">
          <li>
            <Link
              href={`/old/challenge/${applicationId}/${params.programId}`}
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
              href={`/old/challenge/${applicationId}/${params.programId}/me`}
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

export default OldNavBar;
