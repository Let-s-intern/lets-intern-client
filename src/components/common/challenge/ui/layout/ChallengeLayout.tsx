import clsx from 'clsx';
import { Link, Outlet } from 'react-router-dom';

const ChallengeLayout = () => {
  return (
    <div className="px-6 py-4">
      <div className="mx-auto flex max-w-[1036px]">
        <nav>
          <ul className="w-40">
            <li
              className={clsx('px-3 py-2', {
                'rounded bg-[#E6E4FD] font-medium text-[#3A368A]': true,
                'text-[#4A495C]': false,
              })}
            >
              <Link to="/challenge">대시보드</Link>
            </li>
            <li className="px-3 py-2 text-[#4A495C]">
              <Link to="/challenge/me">나의 기록장</Link>
            </li>
            <li className="px-3 py-2 text-[#4A495C]">
              <Link to="/challenge/others">모두의 기록장</Link>
            </li>
          </ul>
        </nav>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChallengeLayout;
