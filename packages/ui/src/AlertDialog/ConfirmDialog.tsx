'use client';

import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from './primitives';

export type ConfirmVariant = 'default' | 'destructive';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** description과 액션 버튼 사이에 렌더되는 추가 콘텐츠 (예: type-to-confirm input) */
  extra?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  /** Confirm 버튼 disabled 강제 (type-to-confirm 등에서 사용) */
  confirmDisabled?: boolean;
  onConfirm: () => void | Promise<void>;
}

const DEFAULT_CONFIRM_LABEL = '확인';
const DEFAULT_CANCEL_LABEL = '취소';

const OVERLAY_CLASSES =
  'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in';

const CONTENT_CLASSES =
  'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-04 focus:outline-none data-[state=open]:animate-fade-in';

const TITLE_CLASSES = 'text-small18 font-semibold text-neutral-0';
const DESCRIPTION_CLASSES = 'mt-2 text-xsmall14 text-neutral-30';

const BUTTON_BASE =
  'inline-flex h-10 items-center justify-center rounded-sm px-4 text-xsmall14 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const CANCEL_CLASSES = `${BUTTON_BASE} border border-neutral-70 bg-white text-neutral-20 hover:bg-neutral-95`;

const ACTION_DEFAULT = `${BUTTON_BASE} bg-primary text-white hover:bg-primary-hover`;
const ACTION_DESTRUCTIVE = `${BUTTON_BASE} bg-red-500 text-white hover:bg-red-600`;

/**
 * 선언적 confirm 다이얼로그 (Layer 1).
 *
 * - destructive variant: 빨간 톤 액션 버튼
 * - onConfirm이 Promise를 반환하면 await 후 닫힘
 * - `extra` prop으로 description과 버튼 사이에 추가 콘텐츠 주입 가능
 * - `confirmDisabled`로 confirm 버튼 강제 비활성화 가능
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  extra,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  variant = 'default',
  confirmDisabled = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false);

  const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const result = onConfirm();
    if (result instanceof Promise) {
      // async path: Radix 기본 닫힘 동작을 막고 await 후 직접 닫는다
      event.preventDefault();
      setPending(true);
      try {
        await result;
        onOpenChange(false);
      } finally {
        setPending(false);
      }
    }
  };

  const actionClasses =
    variant === 'destructive' ? ACTION_DESTRUCTIVE : ACTION_DEFAULT;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogOverlay className={OVERLAY_CLASSES} />
        <AlertDialogContent className={CONTENT_CLASSES}>
          <AlertDialogTitle className={TITLE_CLASSES}>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription className={DESCRIPTION_CLASSES}>
              {description}
            </AlertDialogDescription>
          ) : null}
          {extra}
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel className={CANCEL_CLASSES} disabled={pending}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              data-variant={variant}
              className={actionClasses}
              disabled={pending || confirmDisabled}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
