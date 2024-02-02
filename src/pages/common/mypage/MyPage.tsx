import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import TabBar from '../../TabBar';
import TabItem from '../../TabItem';
import { useEffect } from 'react';

const MyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');

    if (!accessToken || !refreshToken) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="mypage">
      <nav>
        <TabBar itemCount={3}>
          <TabItem
            to="/mypage/application"
            {...(location.pathname === '/mypage/application' && {
              active: true,
            })}
          >
            신청현황
          </TabItem>
          <TabItem
            to="/mypage/review"
            {...(location.pathname === '/mypage/review' && {
              active: true,
            })}
          >
            후기작성
          </TabItem>
          <TabItem
            to="/mypage/privacy"
            {...(location.pathname === '/mypage/privacy' && {
              active: true,
            })}
          >
            개인정보
          </TabItem>
        </TabBar>
      </nav>
      <div className="block h-8 w-full sm:hidden"></div>
      <div className="mx-auto mt-5 max-w-5xl">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPage;
