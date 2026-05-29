'use client';

import { useEffect, useState } from 'react';

/**
 * 대상 요소(본문) 기준 읽기 진행률을 0~1로 반환한다.
 *
 * - 진행률 = (innerHeight - rect.top) / rect.height
 *   (요소 하단이 뷰포트 하단에 닿으면 1, 요소 상단이 뷰포트 하단에 닿으면 0 근처)
 * - `getBoundingClientRect()`는 항상 뷰포트 기준 좌표라 positioned 조상 유무와
 *   무관하게 정확하다(offsetTop은 offsetParent 기준이라 어긋날 수 있음).
 * - rect는 캐싱하지 않고 매 scroll/resize 틱마다 live로 재측정한다.
 *   → lazy 이미지/임베드 로딩으로 본문 높이가 나중에 늘어나도 자가 보정된다.
 * - scroll/resize는 passive 리스너 + requestAnimationFrame throttle로 처리한다.
 *
 * @param getEl 진행률 측정 대상 요소를 반환하는 lazy getter (RSC 본문을 client에서
 *   참조하기 위해 getElementById 등을 감싸 전달). 요소가 없으면 0을 반환한다.
 */
export default function useReadingProgress(
  getEl: () => HTMLElement | null,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      const el = getEl();
      if (!el) {
        setProgress(0);
        return;
      }

      // 매 틱마다 live 재측정 (캐싱 금지)
      const rect = el.getBoundingClientRect();
      const ratio =
        rect.height > 0 ? (window.innerHeight - rect.top) / rect.height : 0;

      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(measure);
    };

    // 마운트 시 1회 계산
    measure();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [getEl]);

  return progress;
}
