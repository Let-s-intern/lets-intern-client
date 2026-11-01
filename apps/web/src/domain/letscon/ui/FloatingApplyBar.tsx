'use client';

import { useEffect, useState } from 'react';
import { LETSCON_HERO_ID } from '../data/sections';
import type { LetsconApply } from '../hooks/useLetsconApply';
import { getApplyButtonLabel } from '../lib/applyLabel';

const BUTTON =
  'flex h-[52px] flex-1 flex-col items-center justify-center rounded-[12px] px-2 md:flex-none md:px-5 disabled:cursor-not-allowed disabled:opacity-50';

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

  if (!isPastHero) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#dcdce0] bg-white pb-[env(safe-area-inset-bottom)] md:bg-[#e9e9e9]">
      <div className="mx-auto flex max-w-[920px] items-center justify-between px-4 py-3 md:h-[100px] md:px-5 md:py-0">
        <p className="hidden text-base font-bold text-[#1c1e2b] md:block">
          렛츠콘 · 11/14(토) · 11/15(일)
        </p>
        <div className="flex flex-1 gap-2 md:flex-none">
          <button
            type="button"
            disabled={apply.online !== 'available'}
            onClick={() => apply.apply('online')}
            className={`${BUTTON} border-primary text-primary border bg-white`}
          >
            <span className="text-sm font-bold">
              {getApplyButtonLabel(apply.online, '온라인만 신청')}
            </span>
            <span className="text-[11px] font-medium opacity-80">무료</span>
          </button>
          <button
            type="button"
            disabled={apply.offline !== 'available'}
            onClick={() => apply.apply('offline')}
            className={`${BUTTON} bg-primary text-white shadow-[0_6px_16px_rgba(77,85,245,0.25)]`}
          >
            <span className="text-sm font-bold">
              {getApplyButtonLabel(apply.offline, '온라인 + 오프라인 신청')}
            </span>
            <span className="text-[11px] font-medium opacity-80">
              보증금 15,000원 · 참석 시 환급
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
