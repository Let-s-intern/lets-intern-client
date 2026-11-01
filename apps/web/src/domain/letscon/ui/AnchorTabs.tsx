'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { getAnchorTabs } from '../lib/anchorTabs';

export function AnchorTabs({ showFaq }: { showFaq: boolean }) {
  const tabs = getAnchorTabs(showFaq);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const navRef = useRef<HTMLElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const updateActive = () => {
      const nav = navRef.current;
      if (!nav) return;

      // 공감 섹션은 소개보다 위에 있으므로 어떤 섹션도 닿지 않았으면 첫 탭이다
      const line = nav.getBoundingClientRect().bottom + 1;
      const passed = tabs.filter(({ id }) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= line;
      });
      setActiveId(passed.at(-1)?.id ?? tabs[0].id);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [tabs]);

  // 태블릿 폭에서 헤더가 여러 줄로 접혀 높이가 달라진다. 실제 높이를 재서 sticky 와 앵커 위치에 쓴다
  useEffect(() => {
    const header = document.querySelector('header > div');
    if (!header) return;

    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      const height = header.getBoundingClientRect().height;
      root.style.setProperty('--letscon-header-height', `${height}px`);
    });
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--letscon-header-height');
    };
  }, []);

  // 모바일 가로 스크롤에서 활성 탭이 화면 밖에 있지 않게 한다
  useEffect(() => {
    const nav = navRef.current;
    const link = activeLinkRef.current;
    if (!nav || !link) return;
    nav.scrollTo({
      left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2,
      behavior: 'smooth',
    });
  }, [activeId]);

  const scrollToSection = (event: MouseEvent, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      aria-label="렛츠콘 섹션"
      className="scrollbar-hide sticky top-[var(--letscon-header-height,84px)] z-20 flex overflow-x-auto border-y border-[#e4e4e7] bg-white md:top-[var(--letscon-header-height,156px)] md:justify-center md:overflow-x-visible"
    >
      {tabs.map(({ id, label }) => {
        const active = id === activeId;
        return (
          <a
            key={id}
            ref={active ? activeLinkRef : undefined}
            href={`#${id}`}
            aria-current={active ? 'true' : undefined}
            onClick={(event) => scrollToSection(event, id)}
            className={`relative flex h-12 shrink-0 grow items-center justify-center whitespace-nowrap px-5 text-sm font-bold md:h-[68px] md:w-[244px] md:shrink md:grow-0 md:text-base ${
              active ? 'text-[#4d55f5]' : 'text-[#9a9aa3]'
            }`}
          >
            {label}
            {active && (
              <span className="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-full bg-[#4d55f5] md:w-[120px]" />
            )}
          </a>
        );
      })}
    </nav>
  );
}
