import { twMerge } from '@/lib/twMerge';
import { ProgramType } from '@/types/common';
import { useEffect, useState } from 'react';

interface NavItem {
  title: string;
  to: string;
}

interface ProgramDetailNavigationProps {
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
          if (entry.isIntersecting) {
            console.log(entry.target.id);
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -70% 0px',
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
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={twMerge(
        'sticky top-[3.65rem] z-30 flex w-full items-center justify-center gap-x-1 border-b-2 border-neutral-80 bg-white px-4 md:top-[4.275rem] md:gap-x-[100px] lg:top-[4.65rem]',
        programType === 'challenge' && 'challenge_navigation',
        programType === 'live' && 'live_navigation',
        className,
      )}
    >
      {navItems.map((navItem) => (
        <button
          key={navItem.title}
          className={`border-b-[2.4px] px-1.5 py-4 text-xsmall16 font-semibold ${
            navItem.to === activeSection
              ? isLive
                ? 'border-primary text-primary'
                : 'border-challenge text-challenge'
              : 'border-transparent text-neutral-45'
          }`}
          onClick={() => handleScroll(navItem.to)}
        >
          {navItem.title}
        </button>
      ))}
    </nav>
  );
};

export default ProgramDetailNavigation;
