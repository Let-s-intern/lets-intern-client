'use client';

import { twMerge } from '@/lib/twMerge';
import useScrollStore from '@/store/useScrollStore';
import { ReactNode, useEffect, useState } from 'react';
import { SINGLE_ROW_NAVBAR_HEIGHT_OFFSET } from '../ui/layout/header/NextNavBar';

interface TabItem {
  id: string;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'intro', label: '챌린지 소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'differentiators', label: '차별점' },
  { id: 'pricing', label: '가격 구성' },
  { id: 'reviews', label: '후기' },
];

const Tab = ({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        'w-fit translate-y-0.5 gap-2.5 text-nowrap border-b-2 px-2.5 py-4 md:w-[88px]',
        active
          ? 'border-b-[#4A76FF] text-[#4A76FF]'
          : 'border-transparent text-neutral-45',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function ChallengeTabNavigation() {
  const [active, setActive] = useState('intro');

  const { scrollDirection } = useScrollStore();

  const handleClick = (tabId: string) => {
    const target = document.getElementById(tabId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActive(tabId);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.25,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, observerOptions);

    tabs.forEach((item) => {
      const target = document.getElementById(item.id);
      if (target) observer.observe(target);
    });

    return () => {
      tabs.forEach((item) => {
        const target = document.getElementById(item.id);
        if (target) observer.unobserve(target);
      });
    };
  }, []);

  return (
    <nav
      className={twMerge(
        'sticky z-20 flex w-full items-center justify-center border-b-2 border-neutral-80 bg-white px-4 text-xsmall14 font-semibold transition-all md:gap-20 md:px-0 md:text-xsmall16',
        scrollDirection === 'UP'
          ? `duration-300 ${SINGLE_ROW_NAVBAR_HEIGHT_OFFSET}`
          : '-top-0.5 duration-200 md:top-0',
      )}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          active={active === tab.id}
          onClick={() => handleClick(tab.id)}
        >
          {tab.label}
        </Tab>
      ))}
    </nav>
  );
}
