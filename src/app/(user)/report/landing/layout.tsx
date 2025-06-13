'use client';

import useActiveReports from '@/hooks/useActiveReports';
import useScrollDirection from '@/hooks/useScrollDirection';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ReportNavigationTabsProps {
  hasActiveResume: boolean;
  hasActivePersonalStatement: boolean;
  hasActivePortfolio: boolean;
  pathname: string;
}

const ReportNavigationTabs = ({
  hasActiveResume,
  hasActivePersonalStatement,
  hasActivePortfolio,
  pathname,
}: ReportNavigationTabsProps) => {
  const tabs = [
    {
      label: '이력서',
      href: '/report/landing/resume',
      active: hasActiveResume,
    },
    {
      label: '자기소개서',
      href: '/report/landing/personal-statement',
      active: hasActivePersonalStatement,
    },
    {
      label: '포트폴리오',
      href: '/report/landing/portfolio',
      active: hasActivePortfolio,
    },
  ];

  const scrollDirection = useScrollDirection(pathname);
  const activeTabs = tabs.filter((t) => t.active);
  const showTabs = activeTabs.length > 1;

  if (!showTabs) return null;

  return (
    <nav
      className={`fixed top-[44px] z-20 flex w-screen justify-center bg-white ${scrollDirection === 'DOWN' ? '-translate-y-[302%]' : 'translate-y-0'} transition-transform duration-300 md:top-[140px] lg:top-[7.25rem]`}
    >
      <ul className="mw-1180 mx-auto flex gap-4 break-keep">
        {activeTabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              className={
                pathname === tab.href
                  ? 'flex border-b-2 border-neutral-0 py-3 font-semibold text-neutral-0 md:py-4'
                  : 'flex py-3 text-neutral-45 hover:text-gray-700 md:py-4'
              }
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  let { hasActiveResume, hasActivePersonalStatement, hasActivePortfolio } =
    useActiveReports();
  // TODO: 메인 배포 전에 삭제 해야함. 테스트용
  hasActiveResume = true;
  hasActivePersonalStatement = true;
  hasActivePortfolio = true;

  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 탭 네비게이션 */}
      <ReportNavigationTabs
        hasActiveResume={hasActiveResume}
        hasActivePersonalStatement={hasActivePersonalStatement}
        hasActivePortfolio={hasActivePortfolio}
        pathname={pathname}
      />

      {/* 각 landing 페이지 컴포넌트 렌더링 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

// import { useGetUserAdmin } from '@/api/user';
// import useActiveLink from '@/hooks/useActiveLink';
// import useActiveReportNav from '@/hooks/useActiveReportNav';
// import { useControlScroll } from '@/hooks/useControlScroll';
// import useScrollDirection from '@/hooks/useScrollDirection';
// import useAuthStore from '@/store/useAuthStore';
// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import ExternalNavList from './ExternalNavList';
// import GlobalNavItem from './GlobalNavItem';
// import GlobalNavTopBar from './GlobalNavTopBar';
// import NavOverlay from './NavOverlay';
// import SideNavContainer from './SideNavContainer';
// import SideNavItem from './SideNavItem';
// import Spacer from './Spacer';

// const NavBar = () => {
//   const location = useLocation();

//   const [isOpen, setIsOpen] = useState(false);

//   const activeLink = useActiveLink(location.pathname);
//   const reportNavList = useActiveReportNav();
//   const scrollDirection = useScrollDirection(location.pathname);

//   const { isLoggedIn } = useAuthStore();

//   const { data: isAdmin } = useGetUserAdmin({
//     enabled: isLoggedIn,
//     retry: 1,
//   });

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const closeMenu = () => {
//     setIsOpen(false);
//   };

//   // 사이드바 열리면 스크롤 제한
//   useControlScroll(isOpen);

//   return (
//     <header>
//       {/* 상단 네비게이션 바 */}
//       <div
//         className={`fixed top-0 z-30 w-screen border-b border-neutral-80 bg-white ${scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-300`}
//       >
//         {/* 1단 */}
//         <GlobalNavTopBar
//           isNextRouter={false}
//           loginRedirect={encodeURIComponent(location.pathname)}
//           toggleMenu={toggleMenu}
//         />
//         {/* 2단 */}
//         <nav className="mw-1180 hidden items-center justify-between pb-[18px] pt-1 md:flex">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-6">
//               <GlobalNavItem
//                 className="text-xsmall16"
//                 href="/program"
//                 isNextRouter={false}
//                 active={activeLink === 'PROGRAM'}
//               >
//                 전체 프로그램
//               </GlobalNavItem>
//               <GlobalNavItem
//                 className="text-xsmall16"
//                 isNextRouter={false}
//                 active={activeLink === 'REPORT'}
//                 href={reportNavList.length === 0 ? '#' : reportNavList[0].href}
//                 subNavList={reportNavList}
//                 force
//               >
//                 서류 피드백 REPORT
//               </GlobalNavItem>
//               <GlobalNavItem
//                 className="text-xsmall16"
//                 isNew
//                 href="https://letscareer.oopy.io/1ea5e77c-bee1-8098-8e19-ec5038fb1cc8"
//                 isNextRouter={false}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 커피챗
//               </GlobalNavItem>
//             </div>
//             <div className="h-[18px] w-[1px] bg-[#D9D9D9]" aria-hidden="true" />
//             <div className="flex items-center gap-6">
//               <GlobalNavItem
//                 className="text-xsmall16"
//                 href="/review"
//                 isNextRouter={false}
//                 active={activeLink === 'REVIEW'}
//                 force
//               >
//                 수강생 솔직 후기
//               </GlobalNavItem>
//               <GlobalNavItem
//                 className="text-xsmall16"
//                 href="/blog/list"
//                 isNextRouter={false}
//                 active={activeLink === 'BLOG'}
//                 force
//               >
//                 블로그
//               </GlobalNavItem>
//             </div>
//             <div className="h-[18px] w-[1px] bg-[#D9D9D9]" aria-hidden="true" />
//             <GlobalNavItem
//               className="text-xsmall16"
//               href="/about"
//               isNextRouter={false}
//               active={activeLink === 'ABOUT'}
//             >
//               렛츠커리어 스토리
//             </GlobalNavItem>
//           </div>
//           <ExternalNavList isNextRouter={false} />
//         </nav>
//       </div>

//       {/* 투명한 검정색 배경 */}
//       <NavOverlay isOpen={isOpen} onClose={closeMenu} />

//       {/* 사이드 네비게이션 바 */}
//       <SideNavContainer
//         isNextRouter={false}
//         isOpen={isOpen}
//         onClose={closeMenu}
//       >
//         <SideNavItem href="/mypage/application" isNextRouter={false}>
//           마이페이지
//         </SideNavItem>
//         <hr className="h-1 bg-neutral-80" aria-hidden="true" />
//         <SideNavItem href="/about" isNextRouter={false}>
//           렛츠커리어 스토리
//         </SideNavItem>
//         <SideNavItem href="/program" isNextRouter={false}>
//           프로그램
//         </SideNavItem>
//         <SideNavItem href="/review" isNextRouter={false} force>
//           수강생 솔직 후기
//         </SideNavItem>
//         <SideNavItem href="/blog/list" isNextRouter={false} force>
//           블로그
//         </SideNavItem>
//         <SideNavItem
//           href="/report/landing"
//           isNextRouter={false}
//           force
//           subNavList={reportNavList}
//           onClick={(e) => e.stopPropagation()}
//         >
//           서류 피드백 REPORT
//         </SideNavItem>
//         <SideNavItem
//           href="https://letscareer.oopy.io/1ea5e77c-bee1-8098-8e19-ec5038fb1cc8"
//           isNextRouter={false}
//           target="_blank"
//           isNew
//           rel="noopener noreferrer"
//         >
//           커피챗
//         </SideNavItem>
//         <hr className="h-1 bg-neutral-80" aria-hidden="true" />
//         {isLoggedIn && isAdmin && (
//           <SideNavItem href="/admin" isNextRouter={false} force>
//             관리자 페이지
//           </SideNavItem>
//         )}
//         <SideNavItem
//           className="notice_gnb"
//           href="https://letscareer.oopy.io"
//           isNextRouter={false}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           공지사항
//         </SideNavItem>
//         <SideNavItem
//           className="q&a_gnb"
//           href="https://letscareer.oopy.io"
//           isNextRouter={false}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           자주 묻는 질문
//         </SideNavItem>
//       </SideNavContainer>

//       {/* 네비게이션 바 공간 차지 */}
//       <Spacer />
//     </header>
//   );
// };

// export default NavBar;
