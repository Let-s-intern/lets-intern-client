import clsx from 'clsx';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useIsMentorQuery } from '@/api/user';
import NavItem from '@/components/common/mypage/ui/nav/NavItem';
import useAuthStore from '@/store/useAuthStore';

const MyPage = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: isMentor } = useIsMentorQuery();
  const isReviewCreatePage = location.pathname.startsWith('/mypage/review/new');
  const isReviewPage =
    location.pathname.startsWith('/mypage/review/challenge') ||
    location.pathname.startsWith('/mypage/review/live') ||
    location.pathname.startsWith('/mypage/review/report') ||
    location.pathname.startsWith('/mypage/review/challenge');

  useEffect(() => {
    // login 페이지로 넘어간 이후 이 useEffect가 한번 더 실행되는 케이스가 있어서 방어로직 추가
    if (!isLoggedIn && window.location.pathname.startsWith('/mypage')) {
      const newUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', `${newUrl.pathname}?${newUrl.search}`);
      navigate(`/login?${searchParams.toString()}`);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex w-full flex-col items-center justify-start lg:px-[7.5rem]">
      <div className="flex w-full flex-col items-start justify-center gap-x-20 md:flex-row md:p-10 lg:px-5 lg:py-[3.75rem]">
        <nav
          className={clsx(
            'flex w-full items-center justify-center md:w-auto',
            // 후기 작성 화면에서는 네비 바 숨김
            { hidden: isReviewCreatePage || isReviewPage },
          )}
        >
          <div className="flex w-full items-center justify-center py-8 md:w-[12.5rem] md:p-0">
            <div className="flex w-full flex-row items-center gap-x-2 gap-y-[0.0625rem] md:flex-col md:p-2">
              <NavItem
                to="/mypage/application"
                active={location.pathname === '/mypage/application'}
              >
                <img
                  src={`/icons/edit-list-unordered${
                    location.pathname === '/mypage/application' ? '-black' : ''
                  }.svg`}
                  alt="user"
                  className="hidden h-[1.625rem] w-[1.625rem] md:block"
                />
                신청현황
              </NavItem>
              <NavItem
                to="/mypage/review"
                active={location.pathname === '/mypage/review'}
              >
                <img
                  src={`/icons/commu-chat-remove${
                    location.pathname === '/mypage/review' ? '-black' : ''
                  }.svg`}
                  alt="list"
                  className="hidden h-[1.625rem] w-[1.625rem] md:block"
                />
                후기작성
              </NavItem>
              <NavItem
                to="/mypage/credit"
                active={location.pathname.startsWith('/mypage/credit')}
              >
                <img
                  src={`/icons/credit-list${
                    location.pathname.startsWith('/mypage/credit')
                      ? '-black'
                      : ''
                  }.svg`}
                  alt="list"
                  className="hidden h-[1.625rem] w-[1.625rem] md:block"
                />
                결제내역
              </NavItem>
              <NavItem
                to="/mypage/privacy"
                active={location.pathname === '/mypage/privacy'}
              >
                <img
                  src={`/icons/user-user-circle${
                    location.pathname === '/mypage/privacy' ? '-black' : ''
                  }.svg`}
                  alt="user"
                  className="hidden h-[1.625rem] w-[1.625rem] md:block"
                />
                개인정보
              </NavItem>
              {isMentor && (
                <NavItem
                  to="/mypage/feedback"
                  active={location.pathname === '/mypage/feedback'}
                >
                  <img
                    src={`/icons/user-challenge-feedback${
                      location.pathname === '/mypage/feedback' ? '-black' : ''
                    }.svg`}
                    alt="user"
                    className="hidden h-[1.625rem] w-[1.625rem] md:block"
                  />
                  챌린지 피드백
                </NavItem>
              )}
            </div>
          </div>
        </nav>
        <div className="flex w-full grow flex-col items-start justify-center pb-8 md:w-auto">
          <div className="flex w-full flex-col items-start justify-center gap-y-8 lg:mx-auto lg:max-w-[37.5rem]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
