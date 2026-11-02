'use client';

import useScrollDirection from '@/hooks/useScrollDirection';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { getAnchorTabs } from '../lib/anchorTabs';

const HEADER_SELECTOR = 'header > div';

const scrollToSection = (
  nav: HTMLElement | null,
  id: string,
  behavior: ScrollBehavior,
) => {
  const section = document.getElementById(id);
  if (!section || !nav) return;

  // 아래로 가면 헤더가 숨어 탭이 맨 위에, 위로 가면 헤더가 돌아와 탭이 헤더 아래에 멈춘다
  const headerHeight =
    document.querySelector(HEADER_SELECTOR)?.getBoundingClientRect().height ??
    0;
  const distanceDown =
    section.getBoundingClientRect().top - nav.getBoundingClientRect().height;
  window.scrollBy({
    top: distanceDown > 0 ? distanceDown : distanceDown - headerHeight,
    behavior,
  });
};

export function AnchorTabs({ showFaq }: { showFaq: boolean }) {
  const tabs = getAnchorTabs(showFaq);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const navRef = useRef<HTMLElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const scrollDirection = useScrollDirection();
  const isHashHandledRef = useRef(false);

  // 해시 진입도 탭 클릭과 같은 위치로 보낸다. FAQ 는 응답 뒤에 그려져 브라우저가 대상을 못 찾는다
  useEffect(() => {
    if (isHashHandledRef.current) return;
    const id = window.location.hash.slice(1);
    if (!tabs.some((tab) => tab.id === id)) return;
    isHashHandledRef.current = true;
    scrollToSection(navRef.current, id, 'auto');
  }, [tabs]);

  // 새로고침으로 복원된 위치는 스크롤 이벤트 없이 헤더가 돌아와 탭이 내용을 가린다
  useEffect(() => {
    if (window.scrollY > 0) window.dispatchEvent(new Event('scroll'));
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateActive = () => {
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
    // 스크롤이 먼저 멈춰도 탭이 자리를 잡은 뒤의 위치로 다시 판단한다
    nav.addEventListener('transitionend', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
      nav.removeEventListener('transitionend', updateActive);
    };
  }, [tabs]);

  // 태블릿 폭에서 헤더가 여러 줄로 접혀 높이가 달라진다. 실제 높이를 재서 sticky 와 앵커 위치에 쓴다
  useEffect(() => {
    const header = document.querySelector(HEADER_SELECTOR);
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

  return (
    <nav
      ref={navRef}
      aria-label="렛츠콘 섹션"
      className={`scrollbar-hide sticky z-20 flex overflow-x-auto border-y border-[#e4e4e7] bg-white transition-[top] duration-300 motion-reduce:transition-none md:justify-center md:overflow-x-visible ${
        scrollDirection === 'DOWN'
          ? 'top-0'
          : 'top-[var(--letscon-header-height,84px)] md:top-[var(--letscon-header-height,156px)]'
      }`}
    >
      {tabs.map(({ id, label }) => {
        const active = id === activeId;
        return (
          <a
            key={id}
            ref={active ? activeLinkRef : undefined}
            href={`#${id}`}
            aria-current={active ? 'true' : undefined}
            onClick={(event: MouseEvent) => {
              event.preventDefault();
              scrollToSection(navRef.current, id, 'smooth');
            }}
            className={`relative flex h-[58px] shrink-0 grow items-center justify-center whitespace-nowrap px-5 text-sm font-bold md:h-[70px] md:w-[244px] md:shrink md:grow-0 md:text-base ${
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
