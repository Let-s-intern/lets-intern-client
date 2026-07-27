'use client';

import { useGetUserAdmin, useIsMentorQuery } from '@/api/user/user';
import useActiveLink from '@/hooks/useActiveLink';
// [레거시 · 삭제 예정] 서류 피드백 REPORT 메뉴 전용 훅.
// 1:1 라이브 멘토링 상품이 이 흐름을 대체하므로 삭제 대상.
// 지금은 메뉴 노출만 차단(주석 처리)한 상태이며, 복원이 아니라 '삭제 대기'다.
// TODO(1:1 라이브 멘토링): 아래 서류 피드백 REPORT 메뉴 블록들과 함께 이 import도 제거할 것.
// import useActiveReportNav from '@/hooks/useActiveReportNav';
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
import MembershipNavLabel from './MembershipNavLabel';
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
  /**
   * true일 경우 fixed 헤더와 관련 translate UI 적용을 비활성화하고
   * 페이지 콘텐츠와 함께 흐르는(static) 헤더로 렌더링한다.
   * 큐레이션 페이지처럼 자체 sticky nav가 viewport 상단을 차지해야 할 때 사용.
   * 참고: useScrollDirection 훅 자체는 계속 호출되며, translate 클래스 적용만 차단된다.
   */
  disableFixed?: boolean;
}

const NavBar = ({ isLoginPage, disableFixed, ...props }: NavBarProps) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const activeLink = useActiveLink(pathname);
  // [레거시 · 삭제 예정] 서류 피드백 REPORT 메뉴용 목록.
  // 1:1 라이브 멘토링 상품이 이 흐름을 대체하므로 삭제 대상.
  // TODO(1:1 라이브 멘토링): 아래 서류 피드백 REPORT 메뉴 블록들과 함께 제거할 것.
  // const reportNavList = useActiveReportNav();
  const scrollDirection = useScrollDirection(pathname);
  const isMobile = useMediaQuery('(max-width:768px)');

  const { isLoggedIn } = useAuthStore();

  const { data: isAdmin } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });

  const { data: isMentor } = useIsMentorQuery({
    enabled: isLoggedIn,
    retry: 1,
  });

  // 멘토 마이페이지 메뉴: env(분리 도메인) 가 설정된 경우에만 노출.
  const mentorUrl = process.env.NEXT_PUBLIC_MENTOR_URL;

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
          'w-screen bg-white',
          disableFixed
            ? 'relative'
            : 'fixed top-0 z-30 transition-transform duration-300',
          !(isMobile && pathname.startsWith('/challenge')) &&
            'border-neutral-80 border-b',
          !disableFixed &&
            (scrollDirection === 'DOWN'
              ? '-translate-y-full'
              : 'translate-y-0'),
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
            'mw-1180 text-xsmall14 md:text-xsmall16 items-center justify-between pb-[14px] pt-1.5 md:flex md:pb-[18px] md:pt-1',
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
                  isNew
                  href="/seminar"
                  active={activeLink === 'SEMINAR'}
                >
                  무료 세미나
                </GlobalNavItem>
              </SwiperSlide>
              {/*
                [레거시 · 삭제 예정] 서류 피드백 REPORT 메뉴 (모바일 Swiper)
                - 1:1 라이브 멘토링 상품이 이 흐름을 대체하므로 삭제 대상.
                - 지금은 노출만 차단(주석 처리). 복원이 아니라 '삭제 대기' 상태.
                - TODO(1:1 라이브 멘토링): 이 블록 + reportNavList/useActiveReportNav 함께 제거.
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
              */}
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
                isNew
                href="/seminar"
                active={activeLink === 'SEMINAR'}
              >
                무료 세미나
              </GlobalNavItem>
              {/*
                [레거시 · 삭제 예정] 서류 피드백 REPORT 메뉴 (데스크톱 GNB)
                - 1:1 라이브 멘토링 상품이 이 흐름을 대체하므로 삭제 대상.
                - 지금은 노출만 차단(주석 처리). 복원이 아니라 '삭제 대기' 상태.
                - TODO(1:1 라이브 멘토링): 이 블록 + reportNavList/useActiveReportNav 함께 제거.
                <GlobalNavItem
                  className="text-xsmall16"
                  active={activeLink === 'REPORT'}
                  href={reportNavList.length === 0 ? '#' : reportNavList[0].href}
                  subNavList={reportNavList}
                >
                  서류 피드백 REPORT
                </GlobalNavItem>
              */}
              <GlobalNavItem
                className="text-xsmall16"
                isNew
                href="/library/list"
                active={activeLink === 'LIBRARY'}
                rel="noopener noreferrer"
              >
                무료 자료집
              </GlobalNavItem>
              <GlobalNavItem className="text-xsmall16" href="/program?type=VOD">
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
        <SideNavItem href="/membership" isNew>
          <MembershipNavLabel />
        </SideNavItem>
        <SideNavItem href="/mypage/career/board">마이페이지</SideNavItem>
        <SideNavItem href="/community">
          커뮤니티
          <span className="text-xxsmall12 flex items-center font-normal">
            +현직자 멘토 참여중
          </span>
        </SideNavItem>
        <SideNavItem className="b2b_landing_click" href="/b2b">
          기업/학교 취업 교육 문의
        </SideNavItem>
        <hr className="bg-neutral-80 h-0.5" aria-hidden="true" />
        <SideNavItem href="/program">전체 프로그램</SideNavItem>
        <SideNavItem href="/seminar" isNew>
          무료 세미나
        </SideNavItem>
        {/*
          [레거시 · 삭제 예정] 서류 피드백 REPORT 메뉴 (사이드 네비)
          - 1:1 라이브 멘토링 상품이 이 흐름을 대체하므로 삭제 대상.
          - 지금은 노출만 차단(주석 처리). 복원이 아니라 '삭제 대기' 상태.
          - TODO(1:1 라이브 멘토링): 이 블록 + reportNavList/useActiveReportNav 함께 제거.
          <SideNavItem href="/review" subNavList={reportNavList}>
            서류 피드백 REPORT
          </SideNavItem>
        */}
        <SideNavItem href="/library/list" isNew>
          무료 자료집
        </SideNavItem>
        <SideNavItem href="/program?type=VOD">취준위키 VOD</SideNavItem>
        <hr className="bg-neutral-80 h-0.5" aria-hidden="true" />
        <SideNavItem href="/review">수강생 솔직 후기</SideNavItem>
        <SideNavItem href="/blog/list">블로그</SideNavItem>
        <hr className="bg-neutral-80 h-0.5" aria-hidden="true" />
        {isLoggedIn && isMentor && mentorUrl && (
          <SideNavItem href={buildCrossAppUrl(mentorUrl, '/mentor')}>
            멘토 마이페이지
          </SideNavItem>
        )}
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

      {/* 네비게이션 바 공간 차지 (fixed일 때만 필요) */}
      {!disableFixed && (
        <Spacer
          hideMobileBottomNavBar={hideMobileBottomNavBar(pathname)}
          backgroundColor={
            pathname.startsWith('/report') ? 'bg-black' : 'bg-white'
          }
        />
      )}
    </header>
  );
};

export default NavBar;
