'use client';

import { useEffect, useState } from 'react';

interface SessionCountdownProps {
  /** "YYYY-MM-DD" */
  date?: string;
  /** "HH:mm" */
  startTime?: string;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * 라이브 피드백 세션 시작 1시간 전부터 카운트다운을 표시.
 * 1시간보다 멀거나 이미 시작/종료된 경우 렌더하지 않음.
 */
const SessionCountdown = ({ date, startTime }: SessionCountdownProps) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!date || !startTime) return null;

  const target = new Date(`${date}T${startTime}:00`).getTime();
  if (Number.isNaN(target)) return null;

  const diff = target - now;
  if (diff <= 0 || diff > ONE_HOUR_MS) return null;

  const minutes = Math.floor(diff / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <span className="flex items-center gap-1 text-sm font-medium text-red-500">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      {minutes}분 {String(seconds).padStart(2, '0')}초 남음
    </span>
  );
};

export default SessionCountdown;
