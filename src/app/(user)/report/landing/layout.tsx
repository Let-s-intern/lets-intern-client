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
      className={`fixed top-[44px] z-20 flex w-screen justify-center bg-white ${scrollDirection === 'DOWN' ? '-translate-y-[302%]' : 'translate-y-0'} transition-transform duration-300 md:top-[104px] lg:top-[104px]`}
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
  hasActiveResume = true;
  hasActivePersonalStatement = true;
  hasActivePortfolio = true;

  return (
    <>
      <div className="fixed top-0 -z-10 h-[1000px] w-screen bg-black" />
      <div className="z-1 flex min-h-screen flex-col">
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
    </>
  );
}
