'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface Props {
  deadline: string | null;
  /** light = 밝은 배경(기본, Hero 카드) / dark = 어두운 배경(최종 CTA) */
  variant?: 'light' | 'dark';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calc = (targetMs: number): TimeLeft => {
  const diff = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

/** 마감일까지 남은 시간(일/시간/분/초). 매초 갱신. 마감일 없으면 렌더 안 함. */
export default function LandingCountdown({
  deadline,
  variant = 'light',
}: Props) {
  const target = deadline ? new Date(deadline).getTime() : null;
  const [time, setTime] = useState<TimeLeft | null>(() =>
    target ? calc(target) : null,
  );

  useEffect(() => {
    if (!target) return;
    setTime(calc(target));
    const id = setInterval(() => setTime(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!time) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  const segments = [
    { value: time.days, label: '일' },
    { value: time.hours, label: '시간' },
    { value: time.minutes, label: '분' },
    { value: time.seconds, label: '초' },
  ];

  const isDark = variant === 'dark';
  const boxClass = isDark ? 'bg-white/10' : 'bg-primary-5';
  const numClass = isDark ? 'text-white' : 'text-neutral-0';
  const labelClass = isDark ? 'text-white/60' : 'text-neutral-35';

  return (
    <div className="flex w-full gap-2">
      {segments.map(({ value, label }) => (
        <div
          key={label}
          className={clsx(
            'flex flex-1 flex-col items-center gap-1.5 rounded-[14px] py-3.5',
            boxClass,
          )}
        >
          <span
            className={clsx('text-xlarge28 font-bold tabular-nums', numClass)}
          >
            {pad(value)}
          </span>
          <span className={clsx('text-xxsmall12', labelClass)}>{label}</span>
        </div>
      ))}
    </div>
  );
}
