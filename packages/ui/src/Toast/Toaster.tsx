'use client';

/**
 * Toast Provider + Viewport 통합 (앱 루트 마운트용).
 *
 * 어떤 컴포넌트인가:
 *   Radix ToastProvider로 children을 감싸고 ToastViewport를 화면 우측 하단에
 *   portal 마운트한다. 내부적으로 toast queue를 useState로 관리하며, useToast
 *   훅이 소비할 수 있는 imperative `enqueue(...)` 함수를 Context로 제공한다.
 *
 *   각 toast에는 고유 id를 부여해 중복 dismiss 안전성을 확보했고, Radix가
 *   onOpenChange(false)로 알려주면 자동으로 queue에서 제거한다(언마운트도 함께).
 *   swipeDirection='right'로 모바일에서 오른쪽 스와이프로 닫을 수 있다.
 *
 * 어디에 마운트되어 있는가:
 *   • apps/web/src/context/Providers.tsx (앱 루트, useToast 사용 가능 영역)
 *
 * 사용 가이드:
 *   - 앱 루트(Providers)에 한 번만 마운트. 중복 마운트 금지.
 *   - 호출처에서는 `useToast()` 훅을 통해 사용한다.
 *   - 선언적 사용이 필요하면 `SuccessToast` / `ErrorToast` 컴포넌트를 직접 렌더해도 된다.
 */

import * as React from 'react';

import { Toast, type ToastVariant } from './Toast';
import { ToastProvider, ToastViewport } from './primitives';

export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
  open: boolean;
}

type EnqueueFn = (options: ToastOptions) => void;

export const ToastEnqueueContext = React.createContext<EnqueueFn | null>(null);

const VIEWPORT_CLASSES =
  'fixed bottom-4 right-4 z-50 m-0 flex w-auto max-w-[100vw] list-none flex-col gap-2 outline-none';

export function Toaster({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = React.useState<ToastEntry[]>([]);
  const nextIdRef = React.useRef(0);

  const enqueue = React.useCallback<EnqueueFn>((options) => {
    const id = ++nextIdRef.current;
    setEntries((current) => [...current, { ...options, id, open: true }]);
  }, []);

  const handleOpenChange = React.useCallback(
    (id: number, open: boolean) => {
      if (open) return;
      // 닫힘 신호를 받으면 해당 entry를 open=false로 표시 → Radix 애니메이션 종료 후
      // 다음 commit에서 제거. 간단히 즉시 제거해도 Radix가 close 애니메이션을 위해
      // 자체 캐시를 보존하므로 시각적 문제 없음.
      setEntries((current) => current.filter((entry) => entry.id !== id));
    },
    [],
  );

  return (
    <ToastEnqueueContext.Provider value={enqueue}>
      <ToastProvider swipeDirection="right">
        {children}
        {entries.map((entry) => (
          <Toast
            key={entry.id}
            open={entry.open}
            onOpenChange={(open) => handleOpenChange(entry.id, open)}
            title={entry.title}
            description={entry.description}
            variant={entry.variant}
            duration={entry.duration}
          />
        ))}
        <ToastViewport className={VIEWPORT_CLASSES} />
      </ToastProvider>
    </ToastEnqueueContext.Provider>
  );
}
