'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useChallengeMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useMentorChallengeListQuery } from '@/api/user/user';
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

/** 단일 챌린지의 공지를 가져오는 훅 — 안전하게 빈 배열 반환 */
function useChallengeGuides(challengeId: number) {
  const { data } = useChallengeMentorGuideListQuery(challengeId);
  return data?.challengeMentorGuideList ?? [];
}

/**
 * 최대 10개 챌린지까지 지원하는 공지 수집 훅.
 * 훅은 조건부 호출이 불가하므로 고정 슬롯으로 처리.
 */
function useAllGuides(challengeIds: number[]) {
  const g0 = useChallengeGuides(challengeIds[0] ?? 0);
  const g1 = useChallengeGuides(challengeIds[1] ?? 0);
  const g2 = useChallengeGuides(challengeIds[2] ?? 0);
  const g3 = useChallengeGuides(challengeIds[3] ?? 0);
  const g4 = useChallengeGuides(challengeIds[4] ?? 0);
  const g5 = useChallengeGuides(challengeIds[5] ?? 0);
  const g6 = useChallengeGuides(challengeIds[6] ?? 0);
  const g7 = useChallengeGuides(challengeIds[7] ?? 0);
  const g8 = useChallengeGuides(challengeIds[8] ?? 0);
  const g9 = useChallengeGuides(challengeIds[9] ?? 0);

  return useMemo(() => {
    const all = [g0, g1, g2, g3, g4, g5, g6, g7, g8, g9];
    return all
      .slice(0, challengeIds.length)
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createDate ?? 0).getTime() -
          new Date(a.createDate ?? 0).getTime(),
      );
  }, [g0, g1, g2, g3, g4, g5, g6, g7, g8, g9, challengeIds.length]);
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: challengeData } = useMentorChallengeListQuery();
  const challengeIds = useMemo(
    () => (challengeData?.myChallengeMentorVoList ?? []).map((c) => c.challengeId),
    [challengeData],
  );
  const { readIds, markAsRead, isRead } = useNotificationState();

  const flatGuides = useAllGuides(challengeIds);

  // 오늘 안 읽은 수
  const unreadCount = useMemo(
    () =>
      flatGuides.filter(
        (g: ChallengeMentorGuideItem) =>
          g.createDate &&
          isToday(g.createDate) &&
          !readIds.includes(g.challengeMentorGuideId),
      ).length,
    [flatGuides, readIds],
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
          guides={flatGuides}
          isRead={isRead}
          onMarkRead={markAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
