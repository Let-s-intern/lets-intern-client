'use client';

import * as React from 'react';

import { ConfirmDialog, type ConfirmVariant } from './ConfirmDialog';

export interface ConfirmOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface ConfirmEntry extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = React.createContext<ConfirmFn | null>(null);

/**
 * 단일 ConfirmDialog 인스턴스를 마운트하고 imperative `confirm(...)` API를 제공한다.
 * - 동시 호출 시 이전 promise는 resolve(false)로 정리하여 dangling을 방지한다.
 * - cancel/ESC/외부닫기는 모두 resolve(false), action 클릭은 resolve(true).
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [entry, setEntry] = React.useState<ConfirmEntry | null>(null);

  const confirm = React.useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      const next: ConfirmEntry = { ...options, resolve };
      // 이전 호출이 살아 있으면 false로 정리한 뒤 새 entry로 교체.
      // functional setState로 최신 entry를 동기적으로 확인한다.
      setEntry((current) => {
        if (current) {
          current.resolve(false);
        }
        return next;
      });
    });
  }, []);

  const handleOpenChange = React.useCallback((open: boolean) => {
    if (open) return;
    // 닫힐 때 아직 resolve 안 됐다면 false로 처리
    setEntry((current) => {
      if (current) {
        current.resolve(false);
      }
      return null;
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    setEntry((current) => {
      if (current) {
        current.resolve(true);
      }
      return null;
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {entry ? (
        <ConfirmDialog
          open
          onOpenChange={handleOpenChange}
          title={entry.title}
          description={entry.description}
          confirmLabel={entry.confirmLabel}
          cancelLabel={entry.cancelLabel}
          variant={entry.variant}
          onConfirm={handleConfirm}
        />
      ) : null}
    </ConfirmContext.Provider>
  );
}
