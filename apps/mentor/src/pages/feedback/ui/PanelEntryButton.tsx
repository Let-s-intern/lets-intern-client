'use client';

import type { ReactNode } from 'react';

import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import { twMerge } from '@/lib/twMerge';

import { RightPanelIcon } from './panelIcons';

/** 외부 링크(새 탭) 아이콘 — 제출물·경험 보기용. */
export const ExternalLinkIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M6 3.5H3.5V12.5H12.5V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"
      stroke="#4D55F5"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface PanelEntryButtonProps {
  children: ReactNode;
  /** 컴팩트(크게 보기) 변형 — 높이 30px, 작은 아이콘. */
  compact?: boolean;
  /** 새 탭 링크면 href, 아니면 onClick. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** 기본은 외부 링크 아이콘. 오른쪽 패널 진입은 `right-panel`. */
  icon?: 'external' | 'right-panel';
  className?: string;
}

/**
 * 참고자료 진입 버튼 — 제출물 보기 / 경험 보기 / 사전 질문(Q&A) 보기 공통.
 *
 * 서면·라이브 두 모달이 같은 모양·높이로 한 줄에 서야 해서 한 곳에서 만든다.
 * 높이는 옆에 붙는 `SideViewButton`(38px / 컴팩트 30px)과 맞춰져 있다.
 */
const PanelEntryButton = ({
  children,
  compact = false,
  href,
  onClick,
  disabled = false,
  icon = 'external',
  className,
}: PanelEntryButtonProps) => {
  const size = compact ? 14 : 16;
  const base = compact
    ? feedbackModalDesign.panelEntryButtonCompact
    : feedbackModalDesign.panelEntryButton;
  const iconNode =
    icon === 'right-panel' ? (
      <RightPanelIcon size={size} />
    ) : (
      <ExternalLinkIcon size={size} />
    );

  if (href && !disabled) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={twMerge(base, className)}
      >
        {iconNode}
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        base,
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {iconNode}
      {children}
    </button>
  );
};

export default PanelEntryButton;
