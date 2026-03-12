'use client';

import { useEffect, useState } from 'react';

interface NavItem {
  title: string;
  sectionId: string;
  onClick: () => void;
}

interface CurationStickyNavProps {
  onScrollToForm: () => void;
  onScrollToChallengeComparison: () => void;
  onScrollToFaq: () => void;
}

/** 역순(하단→상단)으로 순회하여 뷰포트 상단을 가장 최근에 지난 섹션 감지 */
const SECTIONS_REVERSE = [
  { id: 'curation-faq', sectionId: 'faq' },
  { id: 'curation-challenge-comparison', sectionId: 'challenge-comparison' },
  { id: 'curation-form', sectionId: 'form' },
];

/** sticky nav 높이(60px) + 여유 */
const TRIGGER_TOP = 100;

const CurationStickyNav = ({
  onScrollToForm,
  onScrollToChallengeComparison,
  onScrollToFaq,
}: CurationStickyNavProps) => {
  const [activeSection, setActiveSection] = useState<string>('form');

  const navItems: NavItem[] = [
    { title: '3초 큐레이션', sectionId: 'form', onClick: onScrollToForm },
    {
      title: '챌린지 비교표',
      sectionId: 'challenge-comparison',
      onClick: onScrollToChallengeComparison,
    },
    { title: '자주 묻는 질문', sectionId: 'faq', onClick: onScrollToFaq },
  ];

  useEffect(() => {
    let ticking = false;

    const detectActive = () => {
      for (const { id, sectionId } of SECTIONS_REVERSE) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= TRIGGER_TOP) {
          setActiveSection(sectionId);
          return;
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        detectActive();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    detectActive();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-40 flex w-full justify-center border-b-2 border-neutral-80 bg-white shadow-sm">
      <div className="flex w-full max-w-[1000px] items-center justify-between px-6">
        {navItems.map((navItem) => {
          const isActive = activeSection === navItem.sectionId;

          return (
            <button
              key={navItem.title}
              className="border-b-[2.4px] px-1.5 py-4 text-[10px] font-semibold transition-colors xs:text-xsmall16 md:min-w-[100px]"
              style={{
                borderBottomColor: isActive ? '#4D55F5' : 'transparent',
                color: isActive ? '#4D55F5' : '#989ba2',
              }}
              onClick={() => {
                setActiveSection(navItem.sectionId);
                navItem.onClick();
              }}
              type="button"
            >
              {navItem.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CurationStickyNav;
