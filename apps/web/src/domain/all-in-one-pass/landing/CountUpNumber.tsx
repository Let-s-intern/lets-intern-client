'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  durationMs?: number;
}

export default function CountUpNumber({ value, durationMs = 1400 }: Props) {
  const hasPlus = value.trim().endsWith('+');
  const numStr = value.replace(/[+,\s]/g, '');
  const target = parseFloat(numStr) || 0;
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

  const ref = useRef<HTMLSpanElement>(null);
  const [start, setStart] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setStart(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!start) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCurrent(target);
      return;
    }
    let raf = 0;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setCurrent(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setCurrent(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs]);

  const display = current.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {display}
      {hasPlus ? '+' : ''}
    </span>
  );
}
