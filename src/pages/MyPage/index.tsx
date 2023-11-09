import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import BadgeButton from '../../components/BadgeButton';
import TabBar from '../../components/TabBar';
import TabItem from '../../components/TabItem';

const MyPage = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto w-full p-5">
      <div className="mb-5">
        <TabBar>
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
      <Outlet />
    </div>
  );
};

export default MyPage;
