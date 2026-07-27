'use client';

import { useEffect, useState } from 'react';

import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';

/**
 * 상세 페이지 앵커 섹션 id.
 * 챌린지 상페(`domain/program/ProgramDetailNavigation.tsx`)와 같은 규약으로 둔다 —
 * 접두사로 도메인을 구분하고, 스크롤 대상 엘리먼트에 그대로 부여한다.
 */
export const LM_MENTORING_INTRO_ID = 'live-mentoring-intro';
export const LM_MENTOR_INFO_ID = 'live-mentoring-mentor';
export const LM_DIFFERENT_ID = 'live-mentoring-different';
export const LM_REVIEW_ID = 'live-mentoring-review';
export const LM_FAQ_ID = 'live-mentoring-faq';

export const liveMentoringNavItems = [
  { title: '멘토링 소개', to: LM_MENTORING_INTRO_ID },
  { title: '멘토 정보', to: LM_MENTOR_INFO_ID },
  { title: '차별점', to: LM_DIFFERENT_ID },
  { title: '후기', to: LM_REVIEW_ID },
  { title: 'FAQ', to: LM_FAQ_ID },
] as const;

/** 스크롤 시 헤더에 가리지 않도록 빼는 여백 — 챌린지 상페와 동일. */
const SCROLL_OFFSET = 70;

/**
 * 헤더 높이만큼 sticky 위치를 내리는 클래스.
 *
 * 값의 출처는 `common/layout/header/NavBar.tsx` 의
 * `FULL_NAVBAR_HEIGHT_OFFSET` / `SINGLE_ROW_NAVBAR_HEIGHT_OFFSET` 이지만,
 * 그 모듈을 import 하면 `import.meta` 를 쓰는 의존성이 딸려와 jest 가 파싱하지 못한다.
 * 값이 바뀌면 NavBar 와 함께 고쳐야 한다.
 */
const FULL_NAVBAR_OFFSET = 'top-[84px] md:top-[115px]';
const SINGLE_ROW_NAVBAR_OFFSET = 'top-[43px] md:top-[115px]';

interface DetailNavigationProps {
  /** 섹션이 DOM 에 올라온 뒤 관찰을 시작하기 위한 플래그. */
  isReady?: boolean;
  className?: string;
}

/**
 * 1대1 라이브 멘토링 상세 앵커 네비게이션 (시안 0 하단).
 *
 * 챌린지 상페의 `ProgramDetailNavigation` 과 **같은 동작·같은 시각 규약**을 따른다:
 * IntersectionObserver(`rootMargin: -50%`) 스크롤 스파이, 활성 탭 하단 2.4px 인디케이터,
 * 비활성 `#989ba2`, 스크롤 방향에 따라 sticky 위치가 바뀌는 헤더 오프셋.
 * (도메인 간 import 금지 규칙이라 컴포넌트를 공유하지 않고 규약만 맞춘다.)
 */
const DetailNavigation = ({ isReady, className }: DetailNavigationProps) => {
  const [activeSection, setActiveSection] = useState<string>(
    liveMentoringNavItems[0].to,
  );
  /** DOM 에 존재하는 섹션 id. null 이면 아직 확인 전. */
  const [mountedIds, setMountedIds] = useState<string[] | null>(null);
  const scrollDirection = useScrollDirection();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const scrollStyleClassName =
    scrollDirection === 'UP'
      ? `duration-300 ${isMobile ? SINGLE_ROW_NAVBAR_OFFSET : FULL_NAVBAR_OFFSET}`
      : '-top-0.5 duration-200 md:top-0';

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    const present: string[] = [];
    liveMentoringNavItems.forEach(({ to }) => {
      const target = document.getElementById(to);
      if (target) {
        present.push(to);
        observer.observe(target);
      }
    });
    setMountedIds(present);
    if (present[0]) setActiveSection(present[0]);

    return () => observer.disconnect();
  }, [isReady]);

  const handleScroll = (id: string) => {
    const target = document.getElementById(id);
    // 조건부 섹션(전략·후기)은 노출 off 면 DOM 에 없다 — 조용히 무시한다.
    if (!target) return;
    window.scrollBy({
      top: target.getBoundingClientRect().top - SCROLL_OFFSET,
      behavior: 'smooth',
    });
  };

  // DOM 에 실제로 올라온 섹션만 탭으로 노출한다.
  // 없는 섹션 탭을 눌러도 아무 일이 없으면 "고장난 것"으로 읽힌다.
  const visibleItems = liveMentoringNavItems.filter(
    (item) => mountedIds === null || mountedIds.includes(item.to),
  );

  return (
    <nav
      className={twMerge(
        'border-neutral-80 sticky z-20 flex w-full justify-center gap-x-1 border-b-2 bg-white px-6 transition-all md:gap-x-[100px]',
        scrollStyleClassName,
        className,
      )}
    >
      <div className="flex w-full max-w-[1000px] items-center justify-between">
        {visibleItems.map((navItem) => {
          const isActive = navItem.to === activeSection;
          return (
            <button
              key={navItem.to}
              type="button"
              onClick={() => handleScroll(navItem.to)}
              className="xs:text-xsmall16 border-b-[2.4px] px-1.5 py-4 text-[10px] font-semibold md:min-w-[100px]"
              style={{
                borderBottomColor: isActive ? '#4d55f5' : 'transparent',
                color: isActive ? '#4d55f5' : '#989ba2',
              }}
            >
              {navItem.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default DetailNavigation;
