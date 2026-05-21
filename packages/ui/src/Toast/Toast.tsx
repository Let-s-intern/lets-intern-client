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
 *   호출부에서 직접 써도 되지만 일관성을 위해 Layer 2 preset(SuccessToast /
 *   ErrorToast) 사용을 권장한다. 결과 알림의 톤이 컴파일 타임에 결정되도록 강제.
 *
 *   imperative 호출(useToast)도 내부적으로 Toaster가 이 컴포넌트를 사용한다.
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

const ROOT_BASE =
  'group pointer-events-auto relative flex w-[20rem] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border p-4 shadow-04 data-[state=open]:animate-fade-in data-[state=closed]:opacity-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:transition-transform';

const ROOT_DEFAULT = 'border-neutral-70 bg-white text-neutral-0';
const ROOT_SUCCESS = 'border-green-200 bg-green-50 text-green-900';
const ROOT_ERROR = 'border-red-200 bg-red-50 text-red-900';

const TITLE_CLASSES = 'text-xsmall14 font-semibold';
const DESCRIPTION_CLASSES = 'mt-1 text-xsmall12 opacity-80';
const CLOSE_CLASSES =
  'absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded text-xsmall12 opacity-60 hover:opacity-100';
const BODY_CLASSES = 'flex-1';
const ACTION_WRAPPER_CLASSES = 'mt-2';

function variantClasses(variant: ToastVariant): string {
  if (variant === 'success') return ROOT_SUCCESS;
  if (variant === 'error') return ROOT_ERROR;
  return ROOT_DEFAULT;
}

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
      className={`${ROOT_BASE} ${variantClasses(variant)}`}
    >
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
        ×
      </ToastClose>
    </ToastRoot>
  );
}
