'use client';

import useScrollDirection from '@/hooks/useScrollDirection';
import { useEffect, useRef, useState } from 'react';

import { CHECKUP } from '../data/checkup';
import { PASS_INTRO } from '../data/passBenefitModals';
import { PLAYBOOK_INTRO } from '../data/playbookIntro';
import { PREP_STEPS } from '../data/prepSteps';
import { PRICING } from '../data/pricing';

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
// 앵커는 **랜딩에 실제로 있는 섹션 id** 만 넣는다. 없는 id 를 남기면 눌러도 아무 일이
// 일어나지 않고, IntersectionObserver 가 관측 대상을 못 찾아 하이라이트도 멈춘다.
// 섹션을 빼거나 더할 때 이 목록을 함께 고칠 것. (LC-3294)
//
// PRD 4.14 로 섹션이 확정되면서 목록을 다시 맞췄다. 「패스 혜택」(#pass-intro)과
// 「혜택」(#benefits)이 나란히 있어 같은 말이 두 번 나오던 것도 여기서 없앴다 —
// PassBenefitsSection 이 렌더에서 빠져 #benefits 자체가 사라졌다.
//
// id 를 문자열로 적지 않고 각 섹션의 데이터 상수에서 가져온다. 섹션이 id 를 바꾸면
// 여기도 함께 바뀌어, 죽은 앵커가 조용히 생기는 경로를 하나 줄인다.
export const NAV_ITEMS: NavItem[] = [
  { title: '무료 진단', to: CHECKUP.anchorId },
  { title: '준비 단계', to: PREP_STEPS.anchorId },
  { title: '패스 혜택', to: PASS_INTRO.anchorId },
  { title: '플레이북', to: PLAYBOOK_INTRO.anchorId },
  { title: '가격', to: PRICING.anchorId },
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
