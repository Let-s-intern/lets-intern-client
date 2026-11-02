'use client';

import { useEffect, useState } from 'react';
import { LETSCON_HERO_ID } from '../data/sections';
import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';

export function FloatingApplyBar({ apply }: { apply: LetsconApply }) {
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(LETSCON_HERO_ID);
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsPastHero(
        !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
      );
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-30 px-4 transition-[transform,opacity,visibility] duration-500 ease-out motion-reduce:transition-none sm:bottom-6 ${
        isPastHero ? 'visible opacity-100' : 'invisible translate-y-6 opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 rounded-[16px] border border-[#a0aaff]/40 bg-[#141544]/[0.86] px-3.5 py-2.5 shadow-[0_16px_48px_rgba(11,14,43,0.4)] backdrop-blur-[14px] sm:px-5 sm:py-4 md:gap-6 md:px-4 md:py-3">
        <div className="flex min-w-0 flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <p
            aria-hidden="true"
            className="flex items-end text-[17px] font-black leading-none tracking-[-0.04em] text-white md:text-[22px]"
          >
            LETS<span className="text-[#ffe066]">CON</span>
            <span className="mb-0.5 ml-0.5 size-1 rounded-full bg-[#ffe066] md:mb-[3px] md:size-1.5" />
          </p>
          <p className="whitespace-nowrap text-[11px] font-medium leading-none text-white/70 md:text-sm md:leading-normal md:text-white/80">
            <span className="sr-only">렛츠콘 · </span>11/14(토) · 11/15(일)
          </p>
        </div>

        <button
          type="button"
          disabled={apply.status !== 'available'}
          onClick={apply.openSheet}
          className="h-11 shrink-0 rounded-[10px] bg-[#ffe066] px-5 text-sm font-bold text-[#141544] transition-colors enabled:hover:bg-[#ffe98a] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/60 md:h-12 md:w-[240px] md:px-6"
        >
          {getApplyButtonLabel(apply.status, '렛츠콘 신청하기')}
        </button>
      </div>
    </div>
  );
}
