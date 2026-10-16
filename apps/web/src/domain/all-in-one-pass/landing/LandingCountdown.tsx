'use client';

import { useEffect, useState } from 'react';

interface Props {
  deadline: string | null;
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
export default function LandingCountdown({ deadline }: Props) {
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

  return (
    <div className="flex gap-2">
      {segments.map(({ value, label }) => (
        <div
          key={label}
          className="bg-primary-5 flex flex-1 flex-col items-center gap-1.5 rounded-[14px] py-3.5"
        >
          <span className="text-xlarge28 text-neutral-0 font-bold tabular-nums">
            {pad(value)}
          </span>
          <span className="text-xxsmall12 text-neutral-35">{label}</span>
        </div>
      ))}
    </div>
  );
}
