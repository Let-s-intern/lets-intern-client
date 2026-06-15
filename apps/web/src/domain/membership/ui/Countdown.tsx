'use client';
import { useEffect, useState } from 'react';

interface CountdownProps {
  deadline: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(deadline: Date): TimeLeft {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown({ deadline }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calcTimeLeft(deadline));
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(deadline)), 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const pad = (n: number) => String(n).padStart(2, '0');
  const t = timeLeft ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <>
      <div className="seg">
        <span className="n num tick" suppressHydrationWarning>
          {String(t.days).padStart(2, '0')}
        </span>
        <span className="l">일</span>
      </div>
      <div className="seg">
        <span className="n num tick" suppressHydrationWarning>
          {pad(t.hours)}
        </span>
        <span className="l">시간</span>
      </div>
      <div className="seg">
        <span className="n num tick" suppressHydrationWarning>
          {pad(t.minutes)}
        </span>
        <span className="l">분</span>
      </div>
      <div className="seg">
        <span className="n num tick" suppressHydrationWarning>
          {pad(t.seconds)}
        </span>
        <span className="l">초</span>
      </div>
    </>
  );
}
