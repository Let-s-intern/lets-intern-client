'use client';

import { useEffect, useState } from 'react';

import dayjs from '@/lib/dayjs';

const CLOCK_TICK_MS = 1000;
const ONE_MINUTE_MS = 60 * 1000;
const ONE_SECOND_MS = 1000;

/** 남은 시간 — 분:초(MM:SS)만 표시. */
function formatRemaining(remainingMs: number): string {
  const safe = Math.max(remainingMs, 0);
  const minutes = Math.floor(safe / ONE_MINUTE_MS);
  const seconds = Math.floor((safe % ONE_MINUTE_MS) / ONE_SECOND_MS);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface Props {
  /** 세션 시작 ISO */
  startDate?: string;
  /** 세션 종료 ISO */
  endDate?: string;
}

/**
 * 라이브 세션 타이머 — 현재 시각(오전/오후 12시간제) + 남은 시간(분:초).
 *
 * 멘토 앱과 동일 디자인. 좌상단 로고 아크릴 패널(JitsiEmbed topLeftSlot) 안에 들어가므로
 * 자체 배경 없이 텍스트만 렌더한다. 1초마다 갱신(unmount 시 cleanup).
 */
const LiveSessionTimer = ({ startDate, endDate }: Props) => {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const endMs = endDate ? new Date(endDate).getTime() : null;
  const remainingMs = endMs != null ? endMs - nowMs : null;
  const isEnded = remainingMs != null && remainingMs <= 0;
  void startDate; // 시작 전/후 라벨이 필요해지면 사용.

  return (
    <div className="pointer-events-none inline-flex items-center gap-3 px-1 text-white">
      <span className="flex items-baseline gap-1.5">
        <span className="text-[11px] font-medium text-white/55">현재</span>
        <span className="text-[13px] font-semibold tabular-nums">
          {dayjs(nowMs).format('A h:mm:ss')}
        </span>
      </span>
      {remainingMs != null && (
        <>
          <span className="h-3 w-px bg-white/25" />
          <span className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-medium text-white/55">남은</span>
            <span
              className={`text-[13px] font-semibold tabular-nums ${
                isEnded ? 'text-white/50' : 'text-[#a9c1ff]'
              }`}
            >
              {isEnded ? '종료' : formatRemaining(remainingMs)}
            </span>
          </span>
        </>
      )}
    </div>
  );
};

export default LiveSessionTimer;
