import { twMerge } from '@/lib/twMerge';
import { ProgramType } from '@/types/common';
import { useEffect, useState } from 'react';
import { ChallengeColor } from './ChallengeView';

interface NavItem {
  title: string;
  to: string;
}

interface ProgramDetailNavigationProps {
  color?: ChallengeColor;
  programType: ProgramType;
  className?: string;
}

// TODO: GA에 맞게 수정해야 함.

export const PROGRAM_INTRO_ID = 'program-intro';
export const PROGRAM_CURRICULUM_ID = 'curriculum';
export const CHALLENGE_DIFFERENT_ID = 'different';
export const PROGRAM_REVIEW_ID = 'review';
export const PROGRAM_FAQ_ID = 'faq';
export const LIVE_MENTOR_INTRO_ID = 'mentor-intro';

export const challengeNavigateItems: NavItem[] = [
  { title: '프로그램 소개', to: PROGRAM_INTRO_ID },
  { title: '커리큘럼', to: PROGRAM_CURRICULUM_ID },
  { title: '차별점', to: CHALLENGE_DIFFERENT_ID },
  { title: '후기', to: PROGRAM_REVIEW_ID },
  { title: 'FAQ', to: PROGRAM_FAQ_ID },
];

export const liveNavigateItems: NavItem[] = [
  { title: '멘토 소개', to: LIVE_MENTOR_INTRO_ID },
  { title: '클래스 소개', to: PROGRAM_INTRO_ID },
  { title: '커리큘럼', to: PROGRAM_CURRICULUM_ID },
  { title: '후기', to: PROGRAM_REVIEW_ID },
  { title: 'FAQ', to: PROGRAM_FAQ_ID },
];

const ProgramDetailNavigation = ({
  color,
  programType,
  className,
}: ProgramDetailNavigationProps) => {
  const isLive = programType === 'live';
  const [activeSection, setActiveSection] = useState<string>(
    isLive ? liveNavigateItems[0].to : challengeNavigateItems[0].to,
  );
  const navItems = isLive ? liveNavigateItems : challengeNavigateItems;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // if (entry.target.id === PROGRAM_INTRO_ID) {
          //   console.log(
          //     'Intersection ratio for program-intro:',
          //     entry.intersectionRatio,
          //   );
          // }
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
        rootMargin: '-10% 0px 0px 0px',
        threshold: 0.05,
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
        'sticky top-[3.65rem] z-30 flex w-full justify-center gap-x-1 border-b-2 border-neutral-80 bg-white px-6 md:top-[4.275rem] md:gap-x-[100px] lg:top-[4.65rem]',
        programType === 'challenge' && 'challenge_navigation',
        programType === 'live' && 'live_navigation',
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
                navItem.to === activeSection
                  ? isLive
                    ? '#4d55f5'
                    : color?.primary
                  : 'transparent',
              color:
                navItem.to === activeSection
                  ? isLive
                    ? '#4d55f5'
                    : color?.primary
                  : '#989ba2',
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

export default ProgramDetailNavigation;
