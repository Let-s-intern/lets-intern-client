'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface Props {
  passTitle: string;
  periodDays: number | null;
  deadline: string | null;
  ctaDisabled: boolean;
  onStart: () => void;
}

// 하단 바 전용 컴팩트 카운트다운 ("8일 17시간 0분 31초 남음"). 멤버십 BarCountdown 포맷.
function calc(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function BarCountdown({ deadline }: { deadline: string | null }) {
  const target = deadline ? new Date(deadline).getTime() : null;
  // SSR/CSR 일치를 위해 마운트 전에는 0으로 고정 렌더.
  const [t, setT] = useState(() => calc(target ?? Date.now()));

  useEffect(() => {
    if (target == null) return;
    setT(calc(target));
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (target == null) return null;

  const unit = 'text-[11px] font-semibold text-neutral-40 md:text-[12.5px]';
  return (
    <span className="text-neutral-0 flex items-baseline gap-[3px] whitespace-nowrap text-[14px] font-bold md:text-[17px]">
      {t.days}
      <span className={unit}>일</span> {t.hours}
      <span className={unit}>시간</span> {t.minutes}
      <span className={unit}>분</span> {t.seconds}
      <span className={unit}>초</span>
      <span className={clsx(unit, 'ml-1')}>남음</span>
    </span>
  );
}

/** 하단 고정 신청 바 — 멤버십 ApplyBar 디자인(색만 현재 유지). */
export default function LandingApplyBar({
  passTitle,
  periodDays,
  deadline,
  ctaDisabled,
  onStart,
}: Props) {
  return (
    <div className="fixed inset-x-2 bottom-2 z-[60] mx-auto flex max-w-[1080px] items-stretch gap-3 rounded-lg bg-white/60 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.14)] backdrop-blur-md md:inset-x-3 md:bottom-3 md:items-center md:justify-between md:gap-4 md:py-[14px] md:pl-6 md:pr-[14px]">
      <div className="flex flex-1 shrink-0 flex-col items-start justify-between gap-1 md:flex-row md:items-center md:gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-neutral-0 whitespace-normal text-[15px] font-bold md:text-[17px]">
            {passTitle}
          </span>
          {periodDays != null && (
            <span className="text-neutral-40 hidden text-[13.5px] font-medium md:block md:truncate">
              {periodDays}일 간 무엇부터 준비할지 고민하지 마세요
            </span>
          )}
        </div>
        {!ctaDisabled && <BarCountdown deadline={deadline} />}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 md:justify-end md:gap-[18px]">
        <button
          type="button"
          onClick={onStart}
          disabled={ctaDisabled}
          className={clsx(
            'rounded-ms whitespace-nowrap px-[18px] py-[13px] text-[14px] font-bold text-neutral-100 md:px-7 md:py-[15px] md:text-[16px]',
            ctaDisabled ? 'bg-[#F9B68F]' : 'bg-[#F36D32] hover:bg-[#E15D28]',
          )}
        >
          지금 바로 시작
        </button>
      </div>
    </div>
  );
}
