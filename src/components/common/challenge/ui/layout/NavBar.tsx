import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const NavBar = () => {
  const location = useLocation();

  return (
    <nav>
      <ul className="flex w-40 flex-col gap-1">
        <li>
          <Link
            to="/challenge"
            className={clsx('block px-3 py-2', {
              'rounded bg-[#E6E4FD] font-semibold text-[#3A368A]':
                location.pathname === '/challenge',
              'text-[#4A495C]': location.pathname !== '/challenge',
            })}
          >
            대시보드
          </Link>
        </li>
        <li>
          <Link
            to="/challenge/me"
            className={clsx('block px-3 py-2', {
              'rounded bg-[#E6E4FD] font-medium text-[#3A368A]':
                location.pathname === '/challenge/me',
              'text-[#4A495C]': location.pathname !== '/challenge/me',
            })}
          >
            나의 기록장
          </Link>
        </li>
        <li>
          <Link
            to="/challenge/others"
            className={clsx('block px-3 py-2', {
              'rounded bg-[#E6E4FD] font-medium text-[#3A368A]':
                location.pathname === '/challenge/others',
              'text-[#4A495C]': location.pathname !== '/challenge/others',
            })}
          >
            모두의 기록장
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
