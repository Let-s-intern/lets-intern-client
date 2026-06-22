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
    observeAll();

    let rafId = 0;
    const mutationObserver = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(observeAll);
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

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
