import useSectionObserver from '@/hooks/useSectionObserver';
import { twMerge } from '@/lib/twMerge';
import useScrollStore from '@/store/useScrollStore';
import { NavItem } from '@components/ProgramDetailNavigation';
import { useEffect, useState } from 'react';

export const REPORT_INTRO_ID = 'report-intro';
export const REPORT_EXAMPLE_ID = 'report-example';
export const REPORT_REVIEW_ID = 'report-review';
export const REPORT_PLAN_ID = 'report-plan';
export const REPORT_GUIDE_ID = 'report-guide';

export const reportNavigateItems: NavItem[] = [
  { title: '서비스 소개', to: REPORT_INTRO_ID },
  { title: '리포트 예시', to: REPORT_EXAMPLE_ID },
  { title: '후기', to: REPORT_REVIEW_ID },
  { title: '가격 및 플랜', to: REPORT_PLAN_ID },
  { title: '이용 방법', to: REPORT_GUIDE_ID },
];

interface ReportNavigationProps {
  className?: string;
  isDark?: boolean;
  color?: string;
  isReady: boolean;
}

const ReportNavigation = ({
  className,
  isDark,
  color,
  isReady,
}: ReportNavigationProps) => {
  const { scrollDirection } = useScrollStore();
  const [activeSection, setActiveSection] = useState<string>(
    reportNavigateItems[0].to,
  );

  const navItems = reportNavigateItems;

  useSectionObserver(); // GA 스크롤 데이터 전송

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0, // 1픽셀이라도 걸치면 true
      },
    );

    navItems.forEach((navItem) => {
      const target = document.getElementById(navItem.to);
      if (target) {
        observer.observe(target);
      }
    });

    return () => {
      navItems.forEach((navItem) => {
        const target = document.getElementById(navItem.to);
        if (target) {
          observer.unobserve(target);
        }
      });
    };
  }, [navItems, isReady]);

  const handleScroll = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition;
      window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={twMerge(
        'report_navigation sticky top-[93px] z-20 flex w-full transform justify-center gap-x-1 px-6 transition-all duration-300 md:top-[4.275rem] md:gap-x-[100px] lg:top-[7.25rem]',
        isDark ? 'bg-black/90' : 'border-b-2 border-neutral-80 bg-white',
        scrollDirection === 'DOWN' && 'top-0 md:top-0 lg:top-0',
        className,
      )}
    >
      <div className="flex w-full max-w-[1000px] items-center justify-between">
        {navItems.map((navItem) => (
          <button
            key={navItem.title}
            className={`break-keep border-b-[2.4px] px-1.5 py-4 text-[8px] font-semibold xs:text-xxsmall12 md:min-w-[100px] md:text-xsmall16`}
            style={{
              borderBottomColor:
                navItem.to === activeSection
                  ? (color ?? '#4d55f5')
                  : 'transparent',
              color:
                navItem.to === activeSection ? (color ?? '#4d55f5') : '#989ba2',
            }}
            onClick={() => handleScroll(navItem.to)}
          >
            {navItem.title}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ReportNavigation;
