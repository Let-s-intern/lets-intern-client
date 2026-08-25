'use client';

import useScrollDirection from '@/hooks/useScrollDirection';
import { useEffect, useRef, useState } from 'react';

interface NavItem {
  title: string;
  to: string;
}

// 글로벌 NavBar 아래에 붙는 멤버십 섹션 앵커 네비.
// 디자인·동작은 챌린지 상페 ProgramDetailNavigation 을 따르되,
// .membership-root 의 전역 리셋(* { padding:0 })에 눌리지 않도록 스코프드 CSS(.mnav)로 스타일링한다.
// LC-3219 앵커 5개. 순서는 반드시 랜딩의 DOM 순서와 같아야 한다 —
// 스크롤 스파이가 IntersectionObserver 로 현재 섹션을 하이라이트하므로, 나열 순서가 어긋나면
// 스크롤할 때 활성 항목이 앞뒤로 튄다.
//
// 세미나·제휴 혜택은 섹션이 시안에서 빠지면서 항목도 함께 뺐다. 없는 id 를 가리키면
// 클릭이 무반응이 되고 observer 도 대상을 못 찾는다.
const NAV_ITEMS: NavItem[] = [
  { title: '패스 구성', to: 'solution' },
  { title: '멤버십 플랜', to: 'plans' },
  { title: '챌린지 일정', to: 'challenge-schedule' },
  { title: '혜택', to: 'course-plan' },
  { title: '후기', to: 'reviews' },
];

export default function MembershipNav() {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>(NAV_ITEMS[0].to);

  // 스크롤 다운 시 글로벌 NavBar 가 숨으면(scrollEventPage 에 /membership 추가됨)
  // 이 네비는 top:0 으로 올라붙고, 업 시 NavBar 높이만큼 내려간다.
  const scrollDirection = useScrollDirection();

  // 현재 보이는 섹션 하이라이트 (ProgramDetailNavigation 패턴 차용).
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    const targets = NAV_ITEMS.map((item) =>
      document.getElementById(item.to),
    ).filter((el): el is HTMLElement => el !== null);
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleScroll = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const targetTop = target.getBoundingClientRect().top;
    // 아래로 스크롤하면 글로벌 NavBar 가 숨으므로 최종 헤더 높이는 보조 네비뿐이고,
    // 위로 스크롤하면 NavBar 가 다시 보이므로 NavBar + 보조 네비 높이를 빼야 한다.
    const isScrollingDown = targetTop > 0;
    const isDesktop =
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px)').matches;
    const navBarHeight = isDesktop ? 115 : 84;
    const mnavHeight = navRef.current?.getBoundingClientRect().height ?? 56;
    const offset = isScrollingDown ? mnavHeight : navBarHeight + mnavHeight;
    window.scrollBy({ top: targetTop - offset - 8, behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      aria-label="멤버십 섹션 내비게이션"
      className="mnav"
      data-direction={scrollDirection === 'DOWN' ? 'down' : 'up'}
    >
      <div className="mnav-in">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.to}
            type="button"
            className="mnav-link"
            data-active={item.to === activeSection}
            onClick={() => handleScroll(item.to)}
          >
            {item.title}
          </button>
        ))}
      </div>
    </nav>
  );
}
