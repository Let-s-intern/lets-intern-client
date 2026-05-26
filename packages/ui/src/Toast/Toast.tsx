'use client';

/**
 * Layer 1 — 스타일 입힌 generic Toast.
 *
 * 어떤 컴포넌트인가:
 *   Layer 0(primitives.tsx)의 Radix raw 컴포넌트를 조합해 디자인 시스템 기본
 *   스타일(Tailwind)을 입힌 선언적 Toast. variant prop('default' | 'success' |
 *   'error')으로 톤을 분기한다. 닫기 버튼이 기본 포함되며, duration을 통해 자동
 *   dismiss 타이머도 Radix가 책임진다.
 *
 *   디자인 시스템 결정:
 *     • 화면 중앙에 표시(Toaster가 viewport 위치 결정)
 *     • 카드 형태(큰 패딩, 둥근 모서리, 그림자, 링)
 *     • variant별 아이콘 + 컬러 톤
 *     • fade + scale transition (열림/닫힘 자연스러운 등장·사라짐)
 *     • Radix `data-state` 속성에 반응하는 Tailwind variant로 애니메이션 처리
 *
 *   호출부에서 직접 써도 되지만 일관성을 위해 Layer 2 preset(SuccessToast /
 *   ErrorToast) 사용을 권장한다. imperative 호출(useToast)도 내부적으로 Toaster가
 *   이 컴포넌트를 사용한다.
 *
 * 어디에 쓰이는가:
 *   직접 호출처 0건 (apps/web — 2026-05-21).
 *   Toaster(useToast 백킹)와 Layer 2 preset이 내부에서 사용 중.
 *   직접 호출 케이스가 생기면 여기에 기록해주세요.
 */

import * as React from 'react';

import {
  ToastClose,
  ToastDescription,
  ToastRoot,
  ToastTitle,
} from './primitives';

export type ToastVariant = 'default' | 'success' | 'error';

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: React.ReactNode;
  /** 자동 dismiss 시간 (ms). 기본 4000ms. */
  duration?: number;
}

const DEFAULT_DURATION_MS = 4000;

// 중앙 표시 + scale/fade 애니메이션 + swipe(up)로 dismiss
const ROOT_CLASSES =
  'group pointer-events-auto relative flex w-[22rem] max-w-[calc(100vw-3rem)] flex-col items-center gap-4 rounded-2xl bg-white px-6 py-8 shadow-2xl ring-1 ring-black/5 transition-all duration-200 ease-out data-[state=open]:translate-y-0 data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:translate-y-2 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=cancel]:translate-y-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=end]:transition-transform';

const ICON_WRAPPER_BASE =
  'flex h-14 w-14 items-center justify-center rounded-full';

const ICON_WRAPPER: Record<ToastVariant, string> = {
  default: `${ICON_WRAPPER_BASE} bg-neutral-95 text-neutral-30`,
  success: `${ICON_WRAPPER_BASE} bg-green-50 text-green-600`,
  error: `${ICON_WRAPPER_BASE} bg-red-50 text-red-600`,
};

// variant별 SVG 아이콘 (lucide 의존 없이 inline)
const ICON_NODE: Record<ToastVariant, React.ReactNode> = {
  default: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const TITLE_CLASSES = 'text-center text-base font-semibold text-neutral-0';
const DESCRIPTION_CLASSES =
  'mt-1 text-center text-sm leading-relaxed text-neutral-30';
const CLOSE_CLASSES =
  'absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-50 transition-colors hover:bg-neutral-95 hover:text-neutral-0';
const BODY_CLASSES = 'flex w-full flex-col items-center';
const ACTION_WRAPPER_CLASSES = 'mt-3';

/**
 * 선언적 Toast (Layer 1).
 *
 * - variant: default/success/error 톤 분기. data-variant 속성으로도 노출되어
 *   외부에서 스타일 오버라이드 가능.
 * - duration: 자동 dismiss 타이머. Radix Toast가 책임.
 * - action: description 아래 슬롯에 임의 노드 렌더 (예: "되돌리기" 버튼).
 */
export function Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  action,
  duration = DEFAULT_DURATION_MS,
}: ToastProps) {
  return (
    <ToastRoot
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      data-variant={variant}
      className={ROOT_CLASSES}
    >
      <div className={ICON_WRAPPER[variant]} aria-hidden="true">
        {ICON_NODE[variant]}
      </div>
      <div className={BODY_CLASSES}>
        <ToastTitle className={TITLE_CLASSES}>{title}</ToastTitle>
        {description ? (
          <ToastDescription className={DESCRIPTION_CLASSES}>
            {description}
          </ToastDescription>
        ) : null}
        {action ? <div className={ACTION_WRAPPER_CLASSES}>{action}</div> : null}
      </div>
      <ToastClose className={CLOSE_CLASSES} aria-label="닫기">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </ToastClose>
    </ToastRoot>
  );
}
