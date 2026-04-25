'use client';

import { useGetUserAdmin } from '@/api/user/user';
import useActiveLink from '@/hooks/useActiveLink';
import useActiveReportNav from '@/hooks/useActiveReportNav';
import { useControlScroll } from '@/hooks/useControlScroll';
import useProgramCategoryNav from '@/hooks/useProgramCategoryNav';
import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import { buildCrossAppUrl } from '@/common/utils/crossAppUrl';
import { useMediaQuery } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ExternalNavList from './ExternalNavList';
import GlobalNavItem from './GlobalNavItem';
import GlobalNavTopBar from './GlobalNavTopBar';
import NavOverlay from './NavOverlay';
import SideNavContainer from './SideNavContainer';
import SideNavItem from './SideNavItem';
import Spacer from './Spacer';

export const FULL_NAVBAR_HEIGHT_OFFSET = 'top-[84px] md:top-[115px]';
export const SINGLE_ROW_NAVBAR_HEIGHT_OFFSET = 'top-[43px] md:top-[115px]';

export const hideMobileBottomNavBar = (pathname: string) =>
  pathname.startsWith('/program/') ||
  pathname === '/about' ||
  pathname.startsWith('/review') ||
  pathname.startsWith('/blog') ||
  pathname.startsWith('/mypage') ||
  pathname === '/login' ||
  pathname === '/signup' ||
  pathname.startsWith('/challenge');

export const getBottomNavBarClassNameByPath = (pathname: string) => {
  return hideMobileBottomNavBar(pathname) && 'hidden md:flex';
};

interface NavBarProps extends React.ComponentProps<'header'> {
  isLoginPage?: boolean;
}

const NavBar = ({ isLoginPage, ...props }: NavBarProps) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const activeLink = useActiveLink(pathname);
  const reportNavList = useActiveReportNav();
  const scrollDirection = useScrollDirection(pathname);
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

  const programCategoryLists = useProgramCategoryNav();
  // href가 있는 프로그램만 필터링
  const programCategoryWithHref = programCategoryLists.filter(
    (item) => !!item.href,
  );

  // 사이드바 열리면 스크롤 제한
  useControlScroll(isOpen);

  return (
    <header className={props.className}>
      {/* 상단 네비게이션 바 */}
      <div
        className={twMerge(
          'fixed top-0 z-30 w-screen bg-white transition-transform duration-300',
          !(isMobile && location.pathname.startsWith('/challenge')) &&
            'border-b border-neutral-80',
          scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        {/* 1단 */}
        <GlobalNavTopBar
          loginRedirect={encodeURIComponent(pathname)}
          toggleMenu={toggleMenu}
          isLoginPage={isLoginPage}
        />
        {/* 2단 */}
        <nav
          className={twMerge(
            'mw-1180 items-center justify-between pb-[14px] pt-1.5 text-xsmall14 md:flex md:pb-[18px] md:pt-1 md:text-xsmall16',
            getBottomNavBarClassNameByPath(pathname),
          )}
        >
          {/* 모바일: Swiper */}
          {isMobile && (
            <Swiper
              modules={[FreeMode]}
              slidesPerView="auto"
              spaceBetween={16}
              freeMode={true}
              grabCursor={true}
              touchRatio={1}
              threshold={10}
              className="!overflow-visible"
            >
              <SwiperSlide className="!w-auto">
                <GlobalNavItem
                  className="text-xsmall14"
                  href="/program"
                  active={activeLink === 'PROGRAM'}
                >
                  프로그램
                </GlobalNavItem>
              </SwiperSlide>
              <SwiperSlide className="!w-auto">
                <GlobalNavItem
                  className="text-xsmall14"
                  active={activeLink === 'REPORT'}
                  href={
                    reportNavList.length === 0 ? '#' : reportNavList[0].href
                  }
                >
                  서류 피드백 REPORT
                </GlobalNavItem>
              </SwiperSlide>
              <SwiperSlide className="!w-auto">
                <GlobalNavItem
                  className="text-xsmall14"
                  isNew
                  href="/library/list"
                  active={activeLink === 'LIBRARY'}
                  rel="noopener noreferrer"
                >
                  무료 자료집
                </GlobalNavItem>
              </SwiperSlide>
              <SwiperSlide className="!w-auto">
                <GlobalNavItem
                  className="text-xsmall14"
                  isNew
                  href="/program?type=VOD"
                >
                  취준위키 VOD
                </GlobalNavItem>
              </SwiperSlide>
            </Swiper>
          )}
          {/* 데스크톱: 기존 flex 레이아웃 */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-6">
              <GlobalNavItem
                className="text-xsmall16"
                href="/program"
                active={activeLink === 'PROGRAM'}
                subNavList={programCategoryWithHref}
                showDropdownIcon={true}
              >
                프로그램
                <span>&nbsp;카테고리</span>
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                active={activeLink === 'REPORT'}
                href={reportNavList.length === 0 ? '#' : reportNavList[0].href}
                subNavList={reportNavList}
              >
                서류 피드백 REPORT
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                isNew
                href="/library/list"
                active={activeLink === 'LIBRARY'}
                rel="noopener noreferrer"
              >
                무료 자료집
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                isNew
                href="/program?type=VOD"
              >
                취준위키 VOD
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
                active={activeLink === 'REVIEW'}
              >
                수강생 솔직 후기
              </GlobalNavItem>
              <GlobalNavItem
                className="text-xsmall16"
                href="/blog/list"
                active={activeLink === 'BLOG'}
              >
                블로그
              </GlobalNavItem>
            </div>
          </div>

          <ExternalNavList isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        </nav>
      </div>

      {/* 투명한 검정색 배경 */}
      <NavOverlay isOpen={isOpen} onClose={closeMenu} />

      {/* 사이드 네비게이션 바 */}
      <SideNavContainer isOpen={isOpen} onClose={closeMenu}>
        <SideNavItem href="/mypage/career/board">마이페이지</SideNavItem>
        <SideNavItem href="/community">
          커뮤니티
          <span className="flex items-center text-xxsmall12 font-normal">
            +현직자 멘토 참여중
          </span>
        </SideNavItem>
        <SideNavItem className="b2b_landing_click" href="/b2b">
          기업/학교 취업 교육 문의
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        <SideNavItem href="/program">전체 프로그램</SideNavItem>
        <SideNavItem href="/review" subNavList={reportNavList}>
          서류 피드백 REPORT
        </SideNavItem>
        <SideNavItem href="/library/list" isNew>
          무료 자료집
        </SideNavItem>
        <SideNavItem href="/program?type=VOD" isNew>
          취준위키 VOD
        </SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        <SideNavItem href="/review">수강생 솔직 후기</SideNavItem>
        <SideNavItem href="/blog/list">블로그</SideNavItem>
        <hr className="h-0.5 bg-neutral-80" aria-hidden="true" />
        {isLoggedIn && isAdmin && (
          <SideNavItem
            href={buildCrossAppUrl(process.env.NEXT_PUBLIC_ADMIN_URL, '/admin')}
          >
            관리자 페이지
          </SideNavItem>
        )}
        <SideNavItem className="notice_gnb" href="/about">
          렛츠커리어 스토리
        </SideNavItem>
        <SideNavItem
          className="notice_gnb"
          href="https://letscareer.oopy.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          공지사항
        </SideNavItem>
        <SideNavItem
          className="q&a_gnb"
          href="https://letscareer.oopy.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          자주 묻는 질문
        </SideNavItem>
      </SideNavContainer>

      {/* 네비게이션 바 공간 차지 */}
      <Spacer
        hideMobileBottomNavBar={hideMobileBottomNavBar(pathname)}
        backgroundColor={
          pathname.startsWith('/report') ? 'bg-black' : 'bg-white'
        }
      />
    </header>
  );
};

export default NavBar;
