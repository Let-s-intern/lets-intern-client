import { useGetUserAdmin } from '@/api/user';
import useActiveLink from '@/hooks/useActiveLink';
import useActiveReportNav from '@/hooks/useActiveReportNav';
import { useControlScroll } from '@/hooks/useControlScroll';
import useProgramCategoryNav from '@/hooks/useProgramCategoryNav';
import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ExternalNavList from './ExternalNavList';
import GlobalNavItem from './GlobalNavItem';
import GlobalNavTopBar from './GlobalNavTopBar';
import NavOverlay from './NavOverlay';
import {
  getBottomNavBarClassNameByPath,
  hideMobileBottomNavBar,
} from './NextNavBar';
import SideNavContainer from './SideNavContainer';
import SideNavItem from './SideNavItem';
import Spacer from './Spacer';

const NavBar = () => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const activeLink = useActiveLink(location.pathname);
  const reportNavList = useActiveReportNav();
  const scrollDirection = useScrollDirection(location.pathname);
  const isMobile = useMediaQuery('(max-width:768px)');

  const { isLoggedIn } = useAuthStore();

  const { data: isAdmin } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const programCategoryLists = useProgramCategoryNav(false);
  // href가 있는 프로그램만 필터링
  const programCategoryWithHref = programCategoryLists.filter(
    (item) => !!item.href,
  );

  // 사이드바 열리면 스크롤 제한
  useControlScroll(isOpen);

  return (
    <header>
      {/* 상단 네비게이션 바 */}
      <div
        className={twMerge(
          'fixed top-0 z-30 w-screen border-b border-neutral-80 bg-white transition-transform duration-300',
          scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        {/* 1단 */}
        <GlobalNavTopBar
          isNextRouter={false}
          loginRedirect={encodeURIComponent(location.pathname)}
          toggleMenu={toggleMenu}
        />
        {/* 2단 */}
        <nav
          className={twMerge(
            'mw-1180 items-center justify-between pb-[14px] pt-1.5 text-xsmall14 md:flex md:pb-[18px] md:pt-1 md:text-xsmall16',
            getBottomNavBarClassNameByPath(location.pathname),
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <GlobalNavItem
                className="text-xsmall14 md:text-xsmall16"
                href="/program"
                isNextRouter={false}
                active={activeLink === 'PROGRAM'}
                // 모바일은 드롭다운 X
                {...(!isMobile && {
                  subNavList: programCategoryWithHref,
                  showDropdownIcon: true,
                })}
              >
                프로그램
                <span className="hidden md:inline">&nbsp;카테고리</span>
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall14 md:text-xsmall16"
                isNextRouter={false}
                active={activeLink === 'REPORT'}
                href={reportNavList.length === 0 ? '#' : reportNavList[0].href}
                // 모바일은 드롭다운 X
                {...(!isMobile && {
                  subNavList: reportNavList,
                })}
                force
              >
                서류 피드백 REPORT
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall14 md:text-xsmall16"
                isNew
                href="https://letscareer.oopy.io/1ea5e77c-bee1-8098-8e19-ec5038fb1cc8"
                isNextRouter={false}
                target="_blank"
                rel="noopener noreferrer"
              >
                커피챗
              </GlobalNavItem>
            </div>
            <div
              className="hidden h-[18px] w-[1px] bg-[#D9D9D9] md:block"
              aria-hidden="true"
            />
            <div className="hidden items-center gap-6 md:flex">
              <GlobalNavItem
                className="text-xsmall16"
                href="/review"
                isNextRouter={false}
                active={activeLink === 'REVIEW'}
                force
              >
                수강생 솔직 후기
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                href="/blog/list"
                isNextRouter={false}
                active={activeLink === 'BLOG'}
                force
              >
                블로그
              </GlobalNavItem>
            </div>
            <div
              className="hidden h-[18px] w-[1px] bg-[#D9D9D9] md:block"
              aria-hidden="true"
            />
            <GlobalNavItem
              className="hidden text-xsmall16 md:inline"
              href="/about"
              isNextRouter={false}
              active={activeLink === 'ABOUT'}
            >
              렛츠커리어 스토리
            </GlobalNavItem>
          </div>

          <ExternalNavList
            isNextRouter={false}
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
          />
        </nav>
      </div>

      {/* 투명한 검정색 배경 */}
      <NavOverlay isOpen={isOpen} onClose={closeMenu} />

      {/* 사이드 네비게이션 바 */}
      <SideNavContainer
        isNextRouter={false}
        isOpen={isOpen}
        onClose={closeMenu}
      >
        <SideNavItem href="/mypage/application" isNextRouter={false}>
          마이페이지
        </SideNavItem>
        <SideNavItem
          href="https://letscareer.oopy.io/1df5e77c-bee1-80b3-8199-e7d2cc9d64cd"
          isNextRouter={false}
          force
          target="_blank"
          rel="noopener noreferrer"
        >
          커뮤니티
          <span className="flex items-center text-xxsmall12 font-normal">
            +현직자 멘토 참여중
          </span>
        </SideNavItem>
        <SideNavItem
          href="https://recruit.superpasshr.com/?utm_source=letscareer&utm_medium=letscareer_homepage&utm_campaign=letscareer_homepage"
          isNextRouter
          force
          target="_blank"
          rel="noopener noreferrer"
          className="!h-auto !max-h-none !flex-col !items-start py-3"
        >
          <div className="flex items-center gap-1.5">
            슈퍼인턴 채용관
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-system-error text-[8px] font-bold leading-none text-white">
              N
            </div>
          </div>
          <span className="flex items-center text-xxsmall12 font-normal">
            기업에게 먼저 면접 제안 받자!
          </span>
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        <SideNavItem href="/program" isNextRouter={false}>
          전체 프로그램
        </SideNavItem>
        <SideNavItem
          href="/review"
          isNextRouter={false}
          force
          subNavList={reportNavList}
        >
          서류 피드백 REPORT
        </SideNavItem>
        <SideNavItem
          href="https://letscareer.oopy.io/1ea5e77c-bee1-8098-8e19-ec5038fb1cc8"
          isNextRouter={false}
          target="_blank"
          isNew
          rel="noopener noreferrer"
        >
          커피챗
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        <SideNavItem href="/review" isNextRouter={false} force>
          수강생 솔직 후기
        </SideNavItem>
        <SideNavItem href="/blog/list" isNextRouter={false} force>
          블로그
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        {isLoggedIn && isAdmin && (
          <SideNavItem href="/admin" isNextRouter={false} force>
            관리자 페이지
          </SideNavItem>
        )}
        <SideNavItem className="notice_gnb" href="/about" isNextRouter>
          렛츠커리어 스토리
        </SideNavItem>
        <SideNavItem
          className="notice_gnb"
          href="https://letscareer.oopy.io"
          isNextRouter={false}
          target="_blank"
          rel="noopener noreferrer"
        >
          공지사항
        </SideNavItem>
        <SideNavItem
          className="q&a_gnb"
          href="https://letscareer.oopy.io"
          isNextRouter={false}
          target="_blank"
          rel="noopener noreferrer"
        >
          자주 묻는 질문
        </SideNavItem>
      </SideNavContainer>

      {/* 네비게이션 바 공간 차지 */}
      <Spacer
        hideMobileBottomNavBar={hideMobileBottomNavBar(location.pathname)}
        backgroundColor={
          location.pathname.startsWith('/report') ? 'bg-black' : 'bg-white'
        }
      />
    </header>
  );
};

export default NavBar;
