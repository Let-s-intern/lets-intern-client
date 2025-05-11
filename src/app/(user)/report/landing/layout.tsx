'use client';

import useActiveReports from '@/hooks/useActiveReports';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ReportNavigationTabsProps {
  hasActiveResume: boolean;
  hasActivePersonalStatement: boolean;
  hasActivePortfolio: boolean;
  pathname: string;
  headerHeight: number;
}

const ReportNavigationTabs = ({
  hasActiveResume,
  hasActivePersonalStatement,
  hasActivePortfolio,
  pathname,
  headerHeight,
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

  const activeTabs = tabs.filter((t) => t.active);
  const showTabs = activeTabs.length > 1;

  if (!showTabs) return null;

  return (
    <nav
      style={{ top: headerHeight }}
      className={`sticky z-20 flex justify-center bg-white transition-all duration-300`}
    >
      <ul className="flex w-[1100px] gap-4 break-keep px-5">
        {activeTabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              className={
                pathname === tab.href
                  ? 'flex border-b-2 border-neutral-0 py-3 font-semibold text-neutral-0 md:py-4'
                  : 'flex py-4 pb-0 text-neutral-45 hover:text-gray-700'
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
  hasActiveResume = true;
  hasActivePersonalStatement = true;
  hasActivePortfolio = true;

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calcHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().height);
      }
    };

    calcHeaderHeight(); // 동적으로 높이요소 계산
    window.addEventListener('resize', calcHeaderHeight);
    return () => window.removeEventListener('resize', calcHeaderHeight);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 탭 네비게이션 */}
      <ReportNavigationTabs
        hasActiveResume={hasActiveResume}
        hasActivePersonalStatement={hasActivePersonalStatement}
        hasActivePortfolio={hasActivePortfolio}
        pathname={pathname}
        headerHeight={headerHeight}
      />

      {/* 각 landing 페이지 컴포넌트 렌더링 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
