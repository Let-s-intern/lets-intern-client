import { useEffect, useState } from 'react';

import dayjs from '@/lib/dayjs';
import { useFeedbackCountdown } from '@/pages/feedback/hooks/useFeedbackCountdown';

import { currentNow, MOCK_NOW } from '../constants/mockNow';

/** 현재 시각 갱신 주기(ms) — 1초마다 시계를 다시 그린다. */
const CLOCK_TICK_MS = 1000;

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;
const ONE_SECOND_MS = 1000;

/** `남은 시간` 표기 — 1시간 이상이면 H:MM:SS, 미만이면 MM:SS. */
function formatRemaining(remainingMs: number): string {
  const safe = Math.max(remainingMs, 0);
  const hours = Math.floor(safe / ONE_HOUR_MS);
  const minutes = Math.floor((safe % ONE_HOUR_MS) / ONE_MINUTE_MS);
  const seconds = Math.floor((safe % ONE_MINUTE_MS) / ONE_SECOND_MS);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) return `${hours}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

interface LiveSessionTimerProps {
  /** BE `Feedback.startDate` ISO 문자열 */
  startDate: string;
  /** BE `Feedback.endDate` ISO 문자열 */
  endDate: string;
}

/**
 * 라이브 세션 타이머 — 상단 현재 시각(HH:mm:ss) · 하단 남은 시간.
 *
 * - 현재 시각: `CLOCK_TICK_MS`(1초) 간격 `setInterval`로 갱신하며 unmount 시 cleanup 한다.
 *   (mock 시각이 잡혀 있으면 정지 — 시연용)
 * - 남은 시간/종료 판정은 공통 `useFeedbackCountdown`(start/end)을 재사용한다.
 *   종료(`after`) 시 "종료" 라벨을 표시한다.
 */
const LiveSessionTimer = ({ startDate, endDate }: LiveSessionTimerProps) => {
  const countdown = useFeedbackCountdown(startDate, endDate);
  const [nowMs, setNowMs] = useState(() => currentNow().getTime());

  useEffect(() => {
    if (MOCK_NOW) return;
    const id = setInterval(() => setNowMs(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const isEnded = countdown.status === 'after';

  // 영상 위에 투명하게 떠 있는 컴팩트 타이머 칩.
  // pointer-events-none 으로 Jitsi 자체 컨트롤 클릭을 가로채지 않는다.
  return (
    <div className="pointer-events-none inline-flex items-center gap-3 px-1 text-white">
      <span className="flex items-baseline gap-1.5">
        <span className="text-[11px] font-medium text-white/55">현재</span>
        <span className="text-[13px] font-semibold tabular-nums">
          {dayjs(nowMs).format('A h:mm:ss')}
        </span>
      </span>
      <span className="h-3 w-px bg-white/25" />
      <span className="flex items-baseline gap-1.5">
        <span className="text-[11px] font-medium text-white/55">남은</span>
        <span
          className={`text-[13px] font-semibold tabular-nums ${
            isEnded ? 'text-white/50' : 'text-[#a9c1ff]'
          }`}
        >
          {isEnded ? '종료' : formatRemaining(countdown.remainingMs)}
        </span>
      </span>
    </div>
  );
};

export default LiveSessionTimer;
