import { useEffect, useState } from 'react';

interface NavItem {
  title: string;
  to: string;
}

interface ChallengeNavigationProps {
  navItems: NavItem[];
  isLive?: boolean;
}

export const challengeNavigateItems: NavItem[] = [
  { title: '프로그램 소개', to: 'program-intro' },
  { title: '커리큘럼', to: 'curriculum' },
  { title: '차별점', to: 'special' },
  { title: '후기', to: 'review' },
  { title: 'FAQ', to: 'faq' },
];

export const liveNavigateItems: NavItem[] = [
  { title: '멘토 소개', to: 'mentor-intro' },
  { title: '클래스 소개', to: 'class-checklist' },
  { title: '커리큘럼', to: 'curriculum' },
  { title: '후기', to: 'review' },
  { title: 'FAQ', to: 'faq' },
];

const ChallengeNavigation = ({
  navItems,
  isLive,
}: ChallengeNavigationProps) => {
  const [activeSection, setActiveSection] = useState<string>(navItems[0].to);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
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
    <nav className="sticky top-[3.65rem] z-10 z-30 flex w-full items-center justify-center gap-x-1 border-b-2 border-neutral-80 bg-white px-4 md:top-[4.275rem] md:gap-x-[100px] lg:top-[4.65rem]">
      {navItems.map((navItem) => (
        <button
          key={navItem.title}
          className={`border-b-[2.4px] px-1.5 py-4 text-xsmall16 font-semibold ${navItem.to === activeSection ? (isLive ? 'border-primary text-primary' : 'border-challenge text-challenge') : 'border-transparent text-neutral-45'}`}
          onClick={() => handleScroll(navItem.to)}
        >
          {navItem.title}
        </button>
      ))}
    </nav>
  );
};

export default ChallengeNavigation;
