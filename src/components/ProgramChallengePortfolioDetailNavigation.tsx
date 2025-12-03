'use client';

import useProgramScrollDirectionStyle from '@/hooks/useProgramScrollDirectionStyle';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ProgramType } from '@/types/common';
import { useEffect, useMemo, useState } from 'react';
import { challengeColors } from './ChallengeView';
import {
  NavItem,
  PROGRAM_CURRICULUM_ID,
  PROGRAM_FAQ_ID,
  PROGRAM_INTRO_ID,
  PROGRAM_REVIEW_ID,
} from './ProgramDetailNavigation';

const { CAREER_START, PORTFOLIO, EXPERIENCE_SUMMARY, ETC } =
  challengeTypeSchema.enum;

interface ProgramChallengePortfolioNavigationProps {
  programType: ProgramType;
  className?: string;
  isReady?: boolean;
  challengeType?: ChallengeType;
}

export const CHALLENGE_PRICE_ID = 'challenge-price';

export const challengeNavigateItems: NavItem[] = [
  { title: '프로그램 소개', to: PROGRAM_INTRO_ID },
  { title: '커리큘럼', to: PROGRAM_CURRICULUM_ID },
  { title: '가격 플랜', to: CHALLENGE_PRICE_ID },
  { title: '후기', to: PROGRAM_REVIEW_ID },
  { title: 'FAQ', to: PROGRAM_FAQ_ID },
];

const ProgramChallengePortfolioDetailNavigation = ({
  programType,
  className,
  isReady,
  challengeType,
}: ProgramChallengePortfolioNavigationProps) => {
  const [activeSection, setActiveSection] = useState<string>(
    challengeNavigateItems[0].to,
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

    challengeNavigateItems.forEach((navItem) => {
      const target = document.getElementById(navItem.to);
      if (target) {
        observer.observe(target);
      }
    });

    return () => {
      challengeNavigateItems.forEach((navItem) => {
        const target = document.getElementById(navItem.to);
        if (target) {
          observer.unobserve(target);
        }
      });
    };
  }, [isReady]);

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
        scrollStyleClassName,
        className,
      )}
    >
      <div className="flex w-full max-w-[1000px] items-center justify-between">
        {challengeNavigateItems.map((navItem) => (
          <button
            key={navItem.title}
            className={`border-b-[2.4px] px-1.5 py-4 text-[10px] font-semibold xs:text-xsmall16 md:min-w-[100px]`}
            style={{
              borderBottomColor:
                navItem.to === activeSection ? primaryColor : 'transparent',
              color: navItem.to === activeSection ? primaryColor : '#989ba2',
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

export default ProgramChallengePortfolioDetailNavigation;
