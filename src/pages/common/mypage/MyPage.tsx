import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { ReactComponent as User } from '../../../../public/icons/user-user-circle.svg';
import NavItem from '../../../components/common/mypage/ui/nav/NavItem';

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
    <div className="flex w-full flex-col items-center justify-start lg:px-[7.5rem]">
      <div className="flex w-full flex-col items-start justify-center gap-x-20 px-5 md:flex-row md:p-10 lg:px-5 lg:py-[3.75rem]">
        <nav className="flex w-full items-center justify-center md:w-auto">
          <div className="flex w-full items-center justify-center py-1 md:w-[12.5rem] md:p-0">
            <div className="flex w-full flex-row items-center gap-x-2 gap-y-[0.0625rem] rounded-lg bg-neutral-0/5 md:flex-col md:p-2">
              <NavItem
                to="/mypage/application"
                active={location.pathname === '/mypage/application'}
              >
                <img
                  src={`/icons/edit-list-unordered${
                    location.pathname === '/mypage/application'
                      ? '-primary'
                      : ''
                  }.svg`}
                  alt="user"
                  className="h-[1.625rem] w-[1.625rem]"
                />
                신청현황
              </NavItem>
              <NavItem
                to="/mypage/review"
                active={location.pathname === '/mypage/review'}
              >
                <img
                  src={`/icons/commu-chat-remove${
                    location.pathname === '/mypage/review' ? '-primary' : ''
                  }.svg`}
                  alt="list"
                  className="h-[1.625rem] w-[1.625rem]"
                />
                후기작성
              </NavItem>
              <NavItem
                to="/mypage/privacy"
                active={location.pathname === '/mypage/privacy'}
              >
                <img
                  src={`/icons/user-user-circle${
                    location.pathname === '/mypage/privacy' ? '-primary' : ''
                  }.svg`}
                  alt="user"
                  className="h-[1.625rem] w-[1.625rem]"
                />
                개인정보
              </NavItem>
            </div>
          </div>
        </nav>
        <div className="flex w-full grow flex-col items-start justify-center py-8 md:w-auto">
          <div className="flex w-full flex-col items-start justify-center lg:mx-auto lg:max-w-[37.5rem]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
