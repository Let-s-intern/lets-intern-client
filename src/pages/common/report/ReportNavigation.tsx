import { NavItem } from '@components/ProgramDetailNavigation';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

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
}

const ReportNavigation = ({
  className,
  isDark,
  color,
}: ReportNavigationProps) => {
  const [activeSection, setActiveSection] = useState<string>(
    reportNavigateItems[0].to,
  );
  const navItems = reportNavigateItems;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 얼마나 보여지는지 콘솔
            // console.log(entry.target.id);
            // console.log(entry.intersectionRatio);
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // 뷰포트 상단 10%부터 시작해서 뷰포트 하단 10%까지 보여지면 콜백
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.05,
      },
    );

    setTimeout(() => {
      navItems.forEach((navItem) => {
        const target = document.getElementById(navItem.to);
        if (target) {
          observer.observe(target);
        }
      });
    }, 1000);

    return () => {
      navItems.forEach((navItem) => {
        const target = document.getElementById(navItem.to);
        if (target) {
          observer.unobserve(target);
        }
      });
    };
  }, [navItems]);

  const handleScroll = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition - 70;
      window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={twMerge(
        'report-navigation sticky top-[3.65rem] z-20 flex w-full justify-center gap-x-1 px-6 md:top-[4.275rem] md:gap-x-[100px] lg:top-[4.65rem]',
        isDark ? 'bg-black/90' : 'border-b-2 border-neutral-80 bg-white',
        className,
      )}
    >
      <div className="flex w-full max-w-[1000px] items-center justify-between">
        {navItems.map((navItem) => (
          <button
            key={navItem.title}
            className={`border-b-[2.4px] px-1.5 py-4 text-[10px] font-semibold xs:text-xsmall16 md:min-w-[100px]`}
            style={{
              borderBottomColor:
                navItem.to === activeSection && !isDark
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
