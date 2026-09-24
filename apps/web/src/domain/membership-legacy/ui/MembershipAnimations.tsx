import { useEffect } from 'react';

// 원본 HTML의 JS 애니메이션 로직 재현. "애니메이션이 가끔 안 나오는" 문제를 막도록 보강.
// - body.heroin: 히어로 섹션 entrance (hero .he, .offer)
// - .rv.in:      스크롤 진입 시 reveal (IntersectionObserver)
// - .timeline.in: 로드맵 타임라인 드로우
export default function MembershipAnimations() {
  useEffect(() => {
    const heroTimer = setTimeout(() => {
      document.body.classList.add('heroin');
    }, 80);

    const root = document.querySelector('main') ?? document.body;

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
    // .rv/.timeline 은 모두 마운트 시 존재하므로 1회 관찰로 충분하다.
    // (MutationObserver 는 매초 갱신되는 Countdown 텍스트 변화에도 발화해 불필요한
    //  querySelectorAll 비용이 컸기에 제거 — 토글 뷰는 .rv 를 쓰지 않아 누락 없음)
    observeAll();

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
      revealObserver.disconnect();
      timelineObserver.disconnect();
      document.body.classList.remove('heroin');
    };
  }, []);

  return null;
}
