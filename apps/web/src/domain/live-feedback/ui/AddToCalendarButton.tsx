'use client';

import { useEffect, useState } from 'react';

import { createGoogleCalendarUrl } from '../utils/googleCalendar';

interface Props {
  /** 캘린더 일정 제목 */
  title: string;
  startDate?: string;
  endDate?: string;
}

/** 구글 캘린더 아이콘(달력 + 체크). */
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect
      x="2.5"
      y="3"
      width="11"
      height="10.5"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M2.5 6h11M5.5 2v2M10.5 2v2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M6 9.8l1.4 1.4 2.8-2.9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 세션 시작 1시간 전부터는 캘린더 추가 버튼을 숨긴다(이후엔 입장 버튼/카운트다운이 안내). */
const HIDE_BEFORE_START_MS = 60 * 60 * 1000;

/**
 * 예약된 라이브 피드백을 구글 캘린더에 담는 버튼(입장 버튼 아래에 표시).
 *
 * - 세션 시작 1시간 전부터는 숨긴다 — 임박한 시점엔 아래 입장 버튼/카운트다운이 안내한다.
 * - 프리필 링크라 새 탭에서 열려 사용자가 저장을 눌러 등록한다.
 * - 캘린더 일정의 링크로는 현재 입장 페이지 URL 을 넣어, 알림에서 바로 입장할 수 있게 한다.
 * - window 접근·시각 판정이 클라이언트에서만 확정되므로 마운트 후에만 렌더한다(하이드레이션 안전).
 */
const AddToCalendarButton = ({ title, startDate, endDate }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    // 숨김 시점에 맞춰 갱신하기 위한 저빈도 갱신(분 단위면 충분).
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !startDate || !endDate) return null;

  const start = new Date(startDate).getTime();
  if (Number.isNaN(start) || now >= start - HIDE_BEFORE_START_MS) return null;

  const entryUrl = `${window.location.origin}${window.location.pathname}`;
  const url = createGoogleCalendarUrl({
    title,
    startAt: startDate,
    endAt: endDate,
    // 위치(location) 필드는 지도 핀으로 렌더돼 URL 이 지저분하므로 쓰지 않고,
    // 설명(details)에 입장 링크만 한 줄로 넣는다(구글이 자동 하이퍼링크 처리).
    details: `라이브 피드백 입장 링크\n${entryUrl}`,
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-small16 text-primary bg-primary-10 hover:bg-primary-15 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold transition-colors"
    >
      <CalendarIcon />
      구글 캘린더에 추가
    </a>
  );
};

export default AddToCalendarButton;
