'use client';

import { useEffect, useState } from 'react';
import { LETSCON_HERO_ID } from '../data/sections';
import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';

const BUTTON =
  'flex h-12 min-w-0 flex-col items-center justify-center whitespace-nowrap rounded-[10px] px-2 transition-[transform,background-color] duration-200 enabled:hover:-translate-y-0.5 enabled:active:translate-y-0 disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:enabled:hover:translate-y-0';
const TITLE = 'text-sm font-bold leading-[18px]';
const CAPTION = 'text-[11px] font-medium leading-[14px]';

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

        <div className="flex min-w-0 flex-1 gap-2 md:flex-none md:gap-3">
          <button
            type="button"
            disabled={apply.online !== 'available'}
            onClick={() => apply.apply('online')}
            className={`${BUTTON} flex-1 border border-[#b7bdff]/90 bg-white/[0.14] text-white enabled:hover:bg-white/[0.22] disabled:border-white/20 disabled:bg-transparent disabled:text-white/50 md:w-[132px] md:flex-none`}
          >
            <span className={TITLE}>
              {getApplyButtonLabel(apply.online, '온라인만 신청')}
            </span>
            <span className={CAPTION}>무료</span>
          </button>
          <button
            type="button"
            disabled={apply.offline !== 'available'}
            onClick={() => apply.apply('offline')}
            className={`${BUTTON} flex-[1.7] bg-[#ffe066] text-[#141544] enabled:hover:bg-[#ffe98a] disabled:bg-white/10 disabled:text-white/50 md:w-[212px] md:flex-none`}
          >
            <span className={TITLE}>
              {getApplyButtonLabel(apply.offline, '온라인 + 오프라인 신청')}
            </span>
            <span className={`${CAPTION} opacity-80`}>
              보증금 15,000원 · 참석 시 환급
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
