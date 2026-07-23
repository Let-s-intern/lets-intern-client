'use client';

import { useEffect, useState } from 'react';

const CLOCK_TICK_MS = 1000;
const ONE_MINUTE_MS = 60 * 1000;
const ONE_SECOND_MS = 1000;

/** 현재 시각 "오전/오후 h:mm:ss" (ko) — 패키지엔 dayjs 가 없어 Intl 사용. */
const clockFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

/** 남은 시간 — 분:초(MM:SS)만 표시. */
function formatRemaining(remainingMs: number): string {
  const safe = Math.max(remainingMs, 0);
  const minutes = Math.floor(safe / ONE_MINUTE_MS);
  const seconds = Math.floor((safe % ONE_MINUTE_MS) / ONE_SECOND_MS);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface Props {
  /** 세션 종료 ISO — 남은 시간 계산용. */
  endDate?: string;
}

/**
 * 라이브 세션 타이머 — 현재 시각(오전/오후 12시간제) + 남은 시간(분:초).
 *
 * 멘토 앱/알림톡/챌린지 피드백 입장 모달 공통. JitsiEmbed 좌상단 아크릴 패널(topLeftSlot)
 * 안에 들어가므로 자체 배경 없이 텍스트만 렌더한다. 1초마다 갱신(unmount 시 cleanup).
 */
const LiveSessionTimer = ({ endDate }: Props) => {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const endMs = endDate ? new Date(endDate).getTime() : null;
  const remainingMs = endMs != null ? endMs - nowMs : null;
  const isEnded = remainingMs != null && remainingMs <= 0;

  return (
    <div className="pointer-events-none inline-flex items-center gap-3 px-1 text-white">
      <span className="flex items-baseline gap-1.5">
        <span className="text-[11px] font-medium text-white/55">현재</span>
        <span className="text-[13px] font-semibold tabular-nums">
          {clockFormatter.format(new Date(nowMs))}
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
