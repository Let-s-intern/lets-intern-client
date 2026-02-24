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

const CurationStickyNav = ({
  onScrollToForm,
  onScrollToChallengeComparison,
  onScrollToFaq,
}: CurationStickyNavProps) => {
  const [activeSection, setActiveSection] = useState<string>('form');

  const navItems: NavItem[] = [
    { title: '맞춤 추천', sectionId: 'form', onClick: onScrollToForm },
    {
      title: '챌린지 비교',
      sectionId: 'challenge-comparison',
      onClick: onScrollToChallengeComparison,
    },
    { title: 'FAQ', sectionId: 'faq', onClick: onScrollToFaq },
  ];

  // 섹션 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'curation-form') setActiveSection('form');
            else if (id === 'curation-challenge-comparison')
              setActiveSection('challenge-comparison');
            else if (id === 'curation-faq') setActiveSection('faq');
          }
        });
      },
      {
        root: null,
        rootMargin: '-80px 0px -50% 0px',
        threshold: 0,
      },
    );

    const formSection = document.querySelector('#curation-form');
    const challengeComparisonSection = document.getElementById(
      'curation-challenge-comparison',
    );
    const faqSection = document.getElementById('curation-faq');

    if (formSection) observer.observe(formSection);
    if (challengeComparisonSection)
      observer.observe(challengeComparisonSection);
    if (faqSection) observer.observe(faqSection);

    return () => {
      if (formSection) observer.unobserve(formSection);
      if (challengeComparisonSection)
        observer.unobserve(challengeComparisonSection);
      if (faqSection) observer.unobserve(faqSection);
    };
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
              onClick={navItem.onClick}
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
