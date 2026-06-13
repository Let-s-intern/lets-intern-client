'use client';

import { useEffect, useState } from 'react';

import { LIVE_ENTER_LEAD_MS } from '../constants/live';

interface Props {
  startDate?: string;
  endDate?: string;
  disabled?: boolean;
  isPreparing?: boolean;
  onEnter: () => void;
}

type Phase = 'before' | 'open' | 'ended' | 'unknown';

interface ButtonState {
  phase: Phase;
  label: string;
  /** 버튼 활성 여부 (입장 가능 구간에서만 true). */
  active: boolean;
}

function formatRemaining(ms: number): string {
  const totalMinutes = Math.ceil(ms / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
}

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * 현재 시각 기준 버튼 상태 계산 (순수함수 — 테스트 용이).
 * - 시작 20분 전 이전 → 비활성 "입장까지 N시간 N분"
 * - 20분 전 ~ 종료 → 활성 "라이브 입장하기 · 시작까지 N분" (시작 후엔 "진행 중")
 * - 종료 후 → 비활성 "종료된 세션"
 */
export function computeButtonState(
  now: number,
  startDate?: string,
  endDate?: string,
): ButtonState {
  if (!startDate || !endDate) {
    return { phase: 'unknown', label: '일정 확인 중', active: false };
  }
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const openAt = start - LIVE_ENTER_LEAD_MS;

  if (now >= end) {
    return { phase: 'ended', label: '종료된 세션', active: false };
  }
  if (now < openAt) {
    return {
      phase: 'before',
      label: `입장까지 ${formatRemaining(openAt - now)}`,
      active: false,
    };
  }
  if (now < start) {
    return {
      phase: 'open',
      label: `라이브 입장하기 · 시작까지 ${formatRemaining(start - now)}`,
      active: true,
    };
  }
  return {
    phase: 'open',
    label: `라이브 입장하기 · 진행 중 · ${formatCountdown(end - now)}`,
    active: true,
  };
}

const COUNTDOWN_TICK_MS = 1000;

const EnterLiveButton = ({
  startDate,
  endDate,
  disabled,
  isPreparing,
  onEnter,
}: Props) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), COUNTDOWN_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const state = computeButtonState(now, startDate, endDate);
  const isDisabled = disabled || isPreparing || !state.active;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onEnter}
      className="text-small16 bg-primary disabled:bg-neutral-80 flex min-h-[52px] w-full items-center justify-center rounded-md px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:text-neutral-50"
    >
      {isPreparing ? '회의실 준비 중...' : state.label}
    </button>
  );
};

export default EnterLiveButton;
