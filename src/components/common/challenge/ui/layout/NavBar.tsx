import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';

const NavBar = () => {
  const params = useParams<{ programId: string; applicationId: string }>();
  const pathname = usePathname();
  const applicationId = params.applicationId;

  const activeStatus = pathname.endsWith('me')
    ? 'MY_DASHBOARD'
    : pathname.endsWith('guide')
      ? 'GUIDE'
      : 'DASHBOARD';

  return (
    <>
      <nav className="w-full md:w-[220px]">
        <ul className="flex flex-row gap-4 px-5 py-2 scrollbar-hide md:sticky md:top-[165px] md:flex-col md:gap-0 md:overflow-x-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0">
          <li>
            <Link
              href={`/challenge/${applicationId}/${params.programId}`}
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
              href={`/challenge/${applicationId}/${params.programId}/me`}
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
