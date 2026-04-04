'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import { useNotificationState } from '../hooks/useNotificationState';
import NotificationDropdown from './NotificationDropdown';

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useMentorGuideListQuery();
  const guides = data?.challengeMentorGuideList ?? [];
  const { readIds, markAsRead, isRead } = useNotificationState();

  // 최신순 정렬
  const sortedGuides = useMemo(
    () =>
      [...guides].sort(
        (a, b) =>
          new Date(b.createDate ?? 0).getTime() -
          new Date(a.createDate ?? 0).getTime(),
      ),
    [guides],
  );

  // 오늘 안 읽은 수
  const unreadCount = useMemo(
    () =>
      sortedGuides.filter(
        (g: ChallengeMentorGuideItem) =>
          g.createDate &&
          isToday(g.createDate) &&
          !readIds.includes(g.challengeMentorGuideId),
      ).length,
    [sortedGuides, readIds],
  );

  // PWA 앱 배지
  useEffect(() => {
    if ('setAppBadge' in navigator) {
      if (unreadCount > 0) {
        navigator.setAppBadge(unreadCount).catch(() => {});
      } else {
        navigator.clearAppBadge?.();
      }
    }
  }, [unreadCount]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-1"
        aria-label="알림"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
            stroke="#27272D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="#27272D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          guides={sortedGuides}
          isRead={isRead}
          onMarkRead={markAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
