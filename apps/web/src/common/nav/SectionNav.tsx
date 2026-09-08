'use client';

import useProgramScrollDirectionStyle from '@/hooks/useProgramScrollDirectionStyle';
import { twMerge } from '@/lib/twMerge';
import { useEffect, useState } from 'react';

export interface SectionNavItem {
  title: string;
  /** 스크롤 타겟 섹션의 id */
  to: string;
}

interface SectionNavProps {
  items: SectionNavItem[];
  className?: string;
  /** 클릭 스크롤 시 상단 오프셋(px). 기본 70 (챌린지 상세와 동일) */
  scrollOffset?: number;
}

/**
 * 랜딩 페이지 공용 sticky 섹션 네비게이션.
 * 챌린지 상세(ProgramDetailNavigation)와 동일한 스크롤/오프셋 동작을 하되,
 * challenge/live 결합 없이 items 만 받는 범용 컴포넌트.
 * - sticky top 은 useProgramScrollDirectionStyle 로 전역 헤더 아래에 붙는다.
 * - active 섹션은 IntersectionObserver(rootMargin -50%)로 추적한다.
 */
export default function SectionNav({
  items,
  className,
  scrollOffset = 70,
}: SectionNavProps) {
  const [active, setActive] = useState(items[0]?.to ?? '');
  const scrollStyleClassName = useProgramScrollDirectionStyle();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    items.forEach(({ to }) => {
      const target = document.getElementById(to);
      if (target) observer.observe(target);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleScroll = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = target.getBoundingClientRect().top - scrollOffset;
    window.scrollBy({ top: offset, behavior: 'smooth' });
  };

  return (
    <nav
      className={twMerge(
        'border-neutral-80 bg-static-100 sticky z-20 flex w-full justify-center border-b-2 px-5 transition-all',
        scrollStyleClassName,
        className,
      )}
    >
      <div className="flex w-full max-w-[1000px] items-center justify-between">
        {items.map(({ title, to }) => {
          const isActive = to === active;
          return (
            <button
              key={to}
              type="button"
              onClick={() => handleScroll(to)}
              className={twMerge(
                'xs:text-xsmall16 border-b-[2.4px] px-1.5 py-4 text-[10px] font-semibold transition-colors md:min-w-[100px]',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-45',
              )}
            >
              {title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
