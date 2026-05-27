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
  /**
   * 위치 유틸리티 클래스 (기본 우하단). 앱별로 다른 버튼(문의하기·오늘 등) 위에
   * 배치하려면 override. 예: 'bottom-36 right-6'.
   */
  positionClassName?: string;
  /** 버튼 문구 (기본: 역할별). 문의하기 버튼과 톤을 맞춘 라벨. */
  label?: string;
}

/**
 * 채팅 플로팅 버튼.
 *
 * - 새(안 읽은) 메시지가 있을 때만 노출하며, 개수를 뱃지로 표시한다.
 * - 디자인은 "문의하기"(ChannelTalk) 버튼과 통일: 흰 알약 + 라벨 + 컬러 아이콘 원.
 */
export default function ChatFloatingButton({
  role,
  feedbackIds,
  onOpen,
  pbUrl,
  positionClassName = 'bottom-6 right-6',
  label,
}: ChatFloatingButtonProps) {
  const { total } = useUnreadSummary({ feedbackIds, role, pbUrl });

  // 새(안 읽은) 메시지가 있을 때만 노출한다.
  if (total <= 0) return null;

  const badge = formatBadge(total);
  const text = label ?? (role === 'mentor' ? '멘티와 채팅' : '멘토와 채팅');

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`채팅 열기, 안 읽은 메시지 ${total}개`}
      className={`shadow-05 fixed ${positionClassName} z-40 flex items-center rounded-full bg-neutral-100`}
    >
      <span className="text-xsmall14 md:text-xsmall16 text-neutral-0 flex flex-1 items-center justify-center whitespace-nowrap pl-4 pr-2 font-semibold">
        {text}
      </span>
      <span className="bg-primary relative flex h-12 w-12 items-center justify-center rounded-full text-white sm:h-14 sm:w-14">
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
            className="bg-system-error absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
            aria-hidden
          >
            {badge}
          </span>
        )}
      </span>
    </button>
  );
}
