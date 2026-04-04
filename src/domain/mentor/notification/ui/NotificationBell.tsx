'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

/** 챌린지별 공지를 수집하는 내부 컴포넌트 */
function ChallengeNoticeCollector({
  challengeId,
  onData,
}: {
  challengeId: number;
  onData: (challengeId: number, guides: ChallengeMentorGuideItem[]) => void;
}) {
  const { data } = useChallengeMentorGuideListQuery(challengeId);
  const guides = data?.challengeMentorGuideList ?? [];

  useEffect(() => {
    onData(challengeId, guides);
  }, [challengeId, guides, onData]);

  return null;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: challengeData } = useMentorChallengeListQuery();
  const challenges = challengeData?.myChallengeMentorVoList ?? [];
  const { readIds, markAsRead, isRead } = useNotificationState();

  // 모든 챌린지의 공지를 수집
  const [allGuides, setAllGuides] = useState<
    Map<number, ChallengeMentorGuideItem[]>
  >(new Map());

  const handleData = useCallback(
    (challengeId: number, guides: ChallengeMentorGuideItem[]) => {
      setAllGuides((prev) => {
        const next = new Map(prev);
        next.set(challengeId, guides);
        return next;
      });
    },
    [],
  );

  // 전체 공지 평탄화 + 최신순 정렬
  const flatGuides = Array.from(allGuides.values())
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createDate ?? 0).getTime() -
        new Date(a.createDate ?? 0).getTime(),
    );

  // 오늘 안 읽은 수
  const unreadCount = flatGuides.filter(
    (g) =>
      g.createDate &&
      isToday(g.createDate) &&
      !readIds.includes(g.challengeMentorGuideId),
  ).length;

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
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* 챌린지별 공지 수집 */}
      {challenges.map((c) => (
        <ChallengeNoticeCollector
          key={c.challengeId}
          challengeId={c.challengeId}
          onData={handleData}
        />
      ))}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
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
            onMarkRead={(id) => {
              markAsRead(id);
            }}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}
