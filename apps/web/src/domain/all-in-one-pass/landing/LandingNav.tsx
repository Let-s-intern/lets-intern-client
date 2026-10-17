'use client';

import useProgramScrollDirectionStyle from '@/hooks/useProgramScrollDirectionStyle';
import { twMerge } from '@/lib/twMerge';
import { useEffect, useState } from 'react';

const ACTIVE_COLOR = '#4A76FF';
const INACTIVE_COLOR = '#989ba2';

interface NavItem {
  title: string;
  to: string;
}

export const LANDING_NAV_ITEMS: NavItem[] = [
  { title: '소개', to: 'intro' },
  { title: '혜택', to: 'benefit' },
  { title: '후기', to: 'review' },
  { title: '가격', to: 'price' },
  { title: 'FAQ', to: 'faq' },
];

interface Props {
  isReady?: boolean;
}

/** 랜딩 섹션 앵커 네비 (ProgramDetailNavigation 패턴). 스크롤 스파이로 현재 섹션 하이라이트. */
export default function LandingNav({ isReady = true }: Props) {
  const [activeSection, setActiveSection] = useState(LANDING_NAV_ITEMS[0].to);
  const scrollStyleClassName = useProgramScrollDirectionStyle();

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
    LANDING_NAV_ITEMS.forEach((item) => {
      const target = document.getElementById(item.to);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, [isReady]);

  const handleScroll = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    window.scrollBy({
      top: target.getBoundingClientRect().top - 70,
      behavior: 'smooth',
    });
  };

  return (
    <nav
      className={twMerge(
        'border-neutral-80 sticky z-20 flex w-full justify-center border-b-2 bg-white px-6 transition-all',
        scrollStyleClassName,
      )}
    >
      <div className="flex w-full max-w-[1000px] items-center justify-between">
        {LANDING_NAV_ITEMS.map((item) => {
          const active = item.to === activeSection;
          return (
            <button
              key={item.to}
              type="button"
              onClick={() => handleScroll(item.to)}
              className="md:text-xsmall16 text-xsmall14 border-b-[2.4px] px-1.5 py-4 font-semibold md:min-w-[100px]"
              style={{
                borderBottomColor: active ? ACTIVE_COLOR : 'transparent',
                color: active ? ACTIVE_COLOR : INACTIVE_COLOR,
              }}
            >
              {item.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
