'use client';

import { useUnreadSummary } from '../hooks/useUnreadSummary';
import type { ChatRole } from '../schema';
import { formatBadge } from './badge';

interface ChatFloatingButtonProps {
  role: ChatRole;
  /** 내가 속한 방들의 feedbackId 목록. */
  feedbackIds: number[];
  onOpen: () => void;
  pbUrl?: string;
}

export default function ChatFloatingButton({
  role,
  feedbackIds,
  onOpen,
  pbUrl,
}: ChatFloatingButtonProps) {
  const { total } = useUnreadSummary({ feedbackIds, role, pbUrl });
  const badge = formatBadge(total);
  const ariaLabel =
    total > 0 ? `채팅 열기, 안 읽은 메시지 ${total}개` : '채팅 열기';

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={ariaLabel}
      className="bg-primary hover:bg-primary-hover fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-colors"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {badge && (
        <span
          className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white"
          aria-hidden
        >
          {badge}
        </span>
      )}
    </button>
  );
}
