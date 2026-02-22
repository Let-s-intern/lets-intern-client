'use client';

import useProgramScrollDirectionStyle from '@/hooks/useProgramScrollDirectionStyle';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ProgramType } from '@/types/common';
import { useEffect, useMemo, useState } from 'react';
import { challengeColors } from './challenge/ChallengeView';

const { CAREER_START, PORTFOLIO, EXPERIENCE_SUMMARY, ETC } =
  challengeTypeSchema.enum;

export interface NavItem {
  title: string;
  to: string;
}

interface ProgramDetailNavigationProps {
  programType: ProgramType;
  className?: string;
  isReady?: boolean;
  challengeType?: ChallengeType;
}

// TODO: GA에 맞게 수정해야 함.

export const PROGRAM_INTRO_ID = 'challenge-program-intro';
export const PROGRAM_CURRICULUM_ID = 'challenge-curriculum';
export const CHALLENGE_DIFFERENT_ID = 'challenge-different';
export const PROGRAM_REVIEW_ID = 'challenge-review';
export const PROGRAM_FAQ_ID = 'challenge-faq';

export const LIVE_MENTOR_INTRO_ID = 'live-mentor-intro';
export const LIVE_PROGRAM_INTRO_ID = 'live-program-intro';
export const LIVE_CURRICULUM_ID = 'live-curriculum';
export const LIVE_REVIEW_ID = 'live-review';
export const LIVE_FAQ_ID = 'live-faq';

export const GUIDEBOOK_INTRO_ID = 'guidebook-intro';
export const GUIDEBOOK_CURRICULUM_ID = 'guidebook-curriculum';
export const GUIDEBOOK_DIFFERENT_ID = 'guidebook-different';
export const GUIDEBOOK_REVIEW_ID = 'guidebook-review';
export const GUIDEBOOK_FAQ_ID = 'guidebook-faq';

export const challengeNavigateItems: NavItem[] = [
  { title: '프로그램 소개', to: PROGRAM_INTRO_ID },
  { title: '커리큘럼', to: PROGRAM_CURRICULUM_ID },
  { title: '차별점', to: CHALLENGE_DIFFERENT_ID },
  { title: '후기', to: PROGRAM_REVIEW_ID },
  { title: 'FAQ', to: PROGRAM_FAQ_ID },
];

export const liveNavigateItems: NavItem[] = [
  { title: '멘토 소개', to: LIVE_MENTOR_INTRO_ID },
  { title: '클래스 소개', to: LIVE_PROGRAM_INTRO_ID },
  { title: '커리큘럼', to: LIVE_CURRICULUM_ID },
  { title: '후기', to: LIVE_REVIEW_ID },
  { title: 'FAQ', to: LIVE_FAQ_ID },
];

export const guidebookNavigateItems: NavItem[] = [
  { title: '가이드북 소개', to: GUIDEBOOK_INTRO_ID },
  { title: '커리큘럼', to: GUIDEBOOK_CURRICULUM_ID },
  { title: '차별점', to: GUIDEBOOK_DIFFERENT_ID },
  { title: '후기', to: GUIDEBOOK_REVIEW_ID },
  { title: 'FAQ', to: GUIDEBOOK_FAQ_ID },
];
const ProgramDetailNavigation = ({
  programType,
  className,
  isReady,
  challengeType,
}: ProgramDetailNavigationProps) => {
  const isLive = programType === 'live';
  const isGuidebook = programType === 'guidebook';
  const navItems = isLive
    ? liveNavigateItems
    : isGuidebook
      ? guidebookNavigateItems
      : challengeNavigateItems;

  const [activeSection, setActiveSection] = useState<string>(
    isLive
      ? liveNavigateItems[0].to
      : isGuidebook
        ? guidebookNavigateItems[0].to
        : challengeNavigateItems[0].to,
  );

  const scrollStyleClassName = useProgramScrollDirectionStyle();

  const primaryColor = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return challengeColors._4D55F5;
      case PORTFOLIO:
        return challengeColors._4A76FF;
      case EXPERIENCE_SUMMARY:
        return challengeColors.F26646;
      case ETC:
        return challengeColors.F26646;
      default:
        return challengeColors._14BCFF;
    }
  }, [challengeType]);

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
        threshold: 0,
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
        'sticky z-20 flex w-full justify-center gap-x-1 border-b-2 border-neutral-80 bg-white px-6 transition-all md:gap-x-[100px]',
        programType === 'challenge' && 'challenge_navigation',
        programType === 'live' && 'live_navigation',
        programType === 'guidebook' && 'guidebook_navigation',
        scrollStyleClassName,
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
                  ? isLive || isGuidebook
                    ? '#4d55f5'
                    : primaryColor
                  : 'transparent',
              color:
                navItem.to === activeSection
                  ? isLive || isGuidebook
                    ? '#4d55f5'
                    : primaryColor
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
