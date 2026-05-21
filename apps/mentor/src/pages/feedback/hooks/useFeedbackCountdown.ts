import { useEffect, useState } from 'react';

import dayjs from '@/lib/dayjs';

import { currentNow, MOCK_NOW } from '../../schedule/constants/mockNow';

/**
 * 카운트다운 상태.
 * - `before`: 예약 시작 전
 * - `during`: 예약 시작 ~ 종료 사이
 * - `after`: 예약 종료 후
 */
export type FeedbackCountdownStatus = 'before' | 'during' | 'after';

export interface FeedbackCountdownResult {
  status: FeedbackCountdownStatus;
  /** 사람이 읽는 라벨. before/during 일 때만 의미가 있고 after 면 '종료됨'. */
  label: string;
  /** 종료까지 남은 ms (during일 때만 양수). 그 외 0 또는 음수. */
  remainingMs: number;
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;

function formatBeforeLabel(remainingMs: number): string {
  // 1시간 이내: "N분 N초 후 시작"
  if (remainingMs <= ONE_HOUR_MS) {
    const minutes = Math.floor(remainingMs / ONE_MINUTE_MS);
    const seconds = Math.floor((remainingMs % ONE_MINUTE_MS) / 1000);
    return `${minutes}분 ${seconds}초 후 시작`;
  }
  // 1시간 초과: "N시간 N분 후 시작"
  const totalMinutes = Math.floor(remainingMs / ONE_MINUTE_MS);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}시간 ${minutes}분 후 시작`;
}

function computeStatus(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  nowMs: number,
): FeedbackCountdownResult {
  if (!startDate || !endDate) {
    return { status: 'before', label: '', remainingMs: 0 };
  }

  const startMs = dayjs(startDate).valueOf();
  const endMs = dayjs(endDate).valueOf();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return { status: 'before', label: '', remainingMs: 0 };
  }

  if (nowMs < startMs) {
    const diff = startMs - nowMs;
    return {
      status: 'before',
      label: formatBeforeLabel(diff),
      remainingMs: diff,
    };
  }
  if (nowMs < endMs) {
    return {
      status: 'during',
      label: '진행 중',
      remainingMs: endMs - nowMs,
    };
  }
  return { status: 'after', label: '종료됨', remainingMs: 0 };
}

/**
 * 라이브 피드백 모달 카운트다운 hook.
 *
 * - 1초 간격으로 `now`를 갱신해 라벨/상태를 재계산한다.
 * - **모달 mount 시점에만 `setInterval`을 생성하고, unmount 시 `clearInterval` 한다.**
 *   (Vercel best practice: setInterval cleanup 누락 방지)
 * - mock 시각이 설정되어 있으면 tick을 발생시키지 않고 정지 상태로 유지한다 (시연용).
 *
 * @param startDate BE `Feedback.startDate` ISO 문자열
 * @param endDate   BE `Feedback.endDate` ISO 문자열
 */
export function useFeedbackCountdown(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): FeedbackCountdownResult {
  const [nowMs, setNowMs] = useState(() => currentNow().getTime());

  useEffect(() => {
    // mock 시각이 잡혀있으면 정지 (시연용)
    if (MOCK_NOW) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return computeStatus(startDate, endDate, nowMs);
}
