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
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-6 rounded-[16px] border border-[#a0aaff]/40 bg-[#141544]/[0.86] px-4 py-3 shadow-[0_16px_48px_rgba(11,14,43,0.4)] backdrop-blur-[14px] sm:px-5 sm:py-4">
        <div className="hidden items-center gap-4 md:flex">
          <p
            aria-hidden="true"
            className="flex items-end text-[22px] font-black leading-none tracking-[-0.04em] text-white"
          >
            LETS<span className="text-[#ffe066]">CON</span>
            <span className="mb-[3px] ml-0.5 size-1.5 rounded-full bg-[#ffe066]" />
          </p>
          <p className="text-sm font-medium text-white/80">
            <span className="sr-only">렛츠콘 · </span>11/14(토) · 11/15(일)
          </p>
        </div>

        <button
          type="button"
          disabled={apply.status !== 'available'}
          onClick={apply.openSheet}
          className="h-12 min-w-0 flex-1 rounded-[10px] bg-[#ffe066] px-6 text-sm font-bold text-[#141544] transition-colors enabled:hover:bg-[#ffe98a] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/60 md:w-[240px] md:flex-none"
        >
          {getApplyButtonLabel(apply.status, '렛츠콘 신청하기')}
        </button>
      </div>
    </div>
  );
}
