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
 * imperative confirm API의 백킹 Provider.
 *
 * 어떤 컴포넌트인가:
 *   단일 ConfirmDialog 인스턴스를 트리 어딘가에 마운트하고, `useConfirm()` 훅이
 *   소비할 수 있는 imperative `confirm(...)` 함수를 Context로 제공한다.
 *   동시 호출 시 이전 promise는 resolve(false)로 정리하여 dangling을 방지한다.
 *   cancel/ESC/외부닫기는 모두 resolve(false), action 클릭은 resolve(true).
 *
 *   imperative 흐름이 자연스러운 케이스(핸들러 내부에서 await 후 다음 액션 실행)에
 *   유용하지만, 선언적 preset 컴포넌트(EditConfirmDialog / DangerConfirmDialog) 사용을
 *   기본으로 권장한다. UI 구성 의도가 컴포넌트 트리에 그대로 드러나서 디자인 PR
 *   리뷰가 쉽다.
 *
 * 어디에 마운트되어 있는가:
 *   • apps/web/src/context/Providers.tsx (앱 루트, useConfirm 사용 가능 영역)
 *
 * 어디서 useConfirm으로 호출되고 있는가:
 *   직접 호출처 0건 (apps/web — 2026-05-21). 호출처 4곳 모두 선언적 preset
 *   컴포넌트로 마이그레이션 완료. admin/mentor 앱 호출처 확인 후 미사용 확정 시
 *   deprecation 검토.
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
