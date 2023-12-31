import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import TabBar from '../TabBar';
import TabItem from '../TabItem';
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
  }, []);

  return (
    <div className="container mx-auto w-full px-5 pb-5">
      <div className="h-9">
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
      </div>
      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPage;
