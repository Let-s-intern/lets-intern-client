import { Outlet, useLocation } from 'react-router-dom';

import BadgeMenuItem from '../badge/BadgeMenuItem';

const ChallengeMissionLayout = () => {
  const location = useLocation();

  return (
    <div className="px-12 pt-5">
      <div className="flex gap-4">
        <BadgeMenuItem
          to="/admin/challenge/mission"
          active={location.pathname === '/admin/challenge/mission'}
        >
          미션
        </BadgeMenuItem>
        <BadgeMenuItem
          to="/admin/challenge/mission/contents"
          active={location.pathname.startsWith(
            '/admin/challenge/mission/contents',
          )}
        >
          콘텐츠
        </BadgeMenuItem>
      </div>
      <Outlet />
    </div>
  );
};

export default ChallengeMissionLayout;
