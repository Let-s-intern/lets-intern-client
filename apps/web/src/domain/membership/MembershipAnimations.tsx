'use client';
import { useEffect } from 'react';

// 원본 HTML의 JS 애니메이션 로직을 재현
// - body.heroin: 히어로 섹션 entrance (hero .he, .offer)
// - .rv.in:      스크롤 진입 시 reveal (IntersectionObserver)
// - .timeline.in: 로드맵 타임라인 드로우
export default function MembershipAnimations() {
  useEffect(() => {
    // 1. 히어로 entrance
    const heroTimer = setTimeout(() => {
      document.body.classList.add('heroin');
    }, 80);

    // 2. 스크롤 reveal (.rv 요소)
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll('.rv')
      .forEach((el) => revealObserver.observe(el));

    // 3. 타임라인 드로우 (.timeline)
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    document
      .querySelectorAll('.timeline')
      .forEach((el) => timelineObserver.observe(el));

    return () => {
      clearTimeout(heroTimer);
      revealObserver.disconnect();
      timelineObserver.disconnect();
      document.body.classList.remove('heroin');
    };
  }, []);

  return null;
}
