'use client';

import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './index';

export type ConfirmVariant = 'default' | 'destructive';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
}

const DEFAULT_CONFIRM_LABEL = '확인';
const DEFAULT_CANCEL_LABEL = '취소';

const BUTTON_BASE =
  'inline-flex h-10 items-center justify-center rounded-sm px-4 text-xsmall14 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const CANCEL_CLASSES = `${BUTTON_BASE} border border-neutral-70 bg-white text-neutral-20 hover:bg-neutral-95`;

const ACTION_DEFAULT = `${BUTTON_BASE} bg-primary text-white hover:bg-primary-hover`;
const ACTION_DESTRUCTIVE = `${BUTTON_BASE} bg-red-500 text-white hover:bg-red-600`;

function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 선언적 confirm 다이얼로그.
 * - destructive variant: 빨간 톤 액션 버튼
 * - onConfirm이 Promise를 반환하면 await 후 닫힘
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  variant = 'default',
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
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description ? (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <AlertDialogCancel className={CANCEL_CLASSES} disabled={pending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            data-variant={variant}
            className={cx(actionClasses)}
            disabled={pending}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
