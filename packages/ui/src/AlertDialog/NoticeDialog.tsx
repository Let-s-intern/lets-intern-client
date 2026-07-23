'use client';

/**
 * 사용처 (@letscareer/ui 소비처, 2026-07-22 기준):
 *   - apps/web/src/app/(user)/payment-input/page.tsx
 */

import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from './primitives';

export interface NoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 단일 확인 버튼 라벨 (기본 '확인') */
  confirmLabel?: string;
  /** 확인 클릭 시 실행 (예: 홈으로 이동). 미지정 시 닫기만 한다. */
  onConfirm?: () => void;
}

const OVERLAY_CLASSES =
  'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in';

const CONTENT_CLASSES =
  'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-04 focus:outline-none data-[state=open]:animate-fade-in';

const TITLE_CLASSES = 'text-small18 font-semibold text-neutral-0';
const DESCRIPTION_CLASSES = 'mt-2 text-xsmall14 text-neutral-30';

const ACTION_CLASSES =
  'inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-xsmall14 font-medium text-white transition-colors hover:bg-primary-hover';

/**
 * 단일 확인 버튼 안내 다이얼로그 (Layer 1).
 *
 * 선택(확인/취소)이 없는 순수 알림용. `window.alert` 대체로 쓴다.
 * ConfirmDialog와 달리 취소 버튼이 없어 "잘못된 접근" 등 강제 안내에 적합.
 */
export function NoticeDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '확인',
  onConfirm,
}: NoticeDialogProps) {
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
          <div className="mt-6 flex justify-end">
            <AlertDialogAction className={ACTION_CLASSES} onClick={onConfirm}>
              {confirmLabel}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
