'use client';
import { useEffect } from 'react';

// 원본 HTML의 JS 애니메이션 로직을 재현하되, "애니메이션이 가끔 안 나오는" 문제를 막도록 보강
// - body.heroin: 히어로 섹션 entrance (hero .he, .offer)
// - .rv.in:      스크롤 진입 시 reveal (IntersectionObserver)
// - .timeline.in: 로드맵 타임라인 드로우
//
// 가끔 reveal 이 안 되던 원인과 대응:
//  1) 하이드레이션 지연 중 사용자가 스크롤하면, 옵저버가 붙기 전에 이미 지나간 요소는
//     영영 isIntersecting 이 되지 않아 opacity:0 으로 남는다 → 관측 시점에 이미 뷰포트 위로
//     지나간 요소는 즉시 노출한다.
//  2) querySelectorAll 을 마운트 시 1회만 호출하면, 이후 비동기로 추가/교체되는 요소(.rv)는
//     관측되지 않는다 → MutationObserver 로 새로 추가되는 요소도 관측한다.
//  3) 그 외 예외 상황에서도 화면에 보이는 요소가 영구히 숨지 않도록 안전망을 둔다.
export default function MembershipAnimations() {
  useEffect(() => {
    const heroTimer = setTimeout(() => {
      document.body.classList.add('heroin');
    }, 80);

    const root = document.querySelector('main') ?? document.body;

    // 모션 최소화 설정 또는 IO 미지원 환경: 전부 즉시 노출하고 종료
    const prefersReduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduce || typeof IntersectionObserver === 'undefined') {
      root
        .querySelectorAll('.rv, .timeline')
        .forEach((el) => el.classList.add('in'));
      return () => {
        clearTimeout(heroTimer);
        document.body.classList.remove('heroin');
      };
    }

    const createObserver = (threshold: number) =>
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            // 뷰포트에 들어왔거나, 관측 시점에 이미 뷰포트 위로 완전히 지나간
            // 요소(하이드레이션 지연 중 스크롤로 지나친 경우)는 노출한다.
            const passedOrVisible =
              entry.isIntersecting || entry.boundingClientRect.bottom < 0;
            if (passedOrVisible) {
              entry.target.classList.add('in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold },
      );

    const revealObserver = createObserver(0.12);
    const timelineObserver = createObserver(0.2);

    const observeAll = () => {
      root
        .querySelectorAll('.rv:not(.in)')
        .forEach((el) => revealObserver.observe(el));
      root
        .querySelectorAll('.timeline:not(.in)')
        .forEach((el) => timelineObserver.observe(el));
    };
    observeAll();

    // 비동기로 추가/교체되는 요소(예: API 로딩 후 렌더되는 섹션)도 관측
    let rafId = 0;
    const mutationObserver = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(observeAll);
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    // 안전망: 화면에 보이는데도 누락된 요소가 있으면 강제로 노출 (영구히 숨는 것 방지)
    const safetyTimer = setTimeout(() => {
      root
        .querySelectorAll('.rv:not(.in), .timeline:not(.in)')
        .forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('in');
          }
        });
    }, 2500);

    return () => {
      clearTimeout(heroTimer);
      clearTimeout(safetyTimer);
      cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      revealObserver.disconnect();
      timelineObserver.disconnect();
      document.body.classList.remove('heroin');
    };
  }, []);

  return null;
}
