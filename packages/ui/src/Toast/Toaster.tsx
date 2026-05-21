'use client';

/**
 * Toast Provider + Viewport 통합 (앱 루트 마운트용).
 *
 * 어떤 컴포넌트인가:
 *   Radix ToastProvider로 children을 감싸고 ToastViewport를 화면 중앙에 portal
 *   마운트한다. 활성 toast가 있을 때 화면 전체에 backdrop(반투명 + blur)을
 *   덮어 사용자가 결과 알림을 확실히 인지하도록 한다.
 *
 *   내부적으로 toast queue를 useState로 관리하며, useToast 훅이 소비할 수
 *   있는 imperative `enqueue(...)` 함수를 Context로 제공한다. 각 toast에는
 *   고유 id를 부여해 중복 dismiss 안전성을 확보했고, Radix가 onOpenChange(false)로
 *   알려주면 자동으로 queue에서 제거한다.
 *
 *   swipeDirection='up'으로 위 방향 스와이프 시 닫힌다(중앙 모달 형태에 적합).
 *   backdrop은 클릭 차단을 위한 시각 효과만 담당하며 pointer-events-none이라
 *   사용자 인터랙션을 가로채지 않는다(toast의 close 버튼/swipe 동작은 정상).
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

// Viewport: 화면 중앙, toast 자체에 pointer-events-auto 부여(클릭/swipe 가능)
const VIEWPORT_CLASSES =
  'pointer-events-none fixed inset-0 z-50 m-0 flex items-center justify-center p-6 outline-none';

// Backdrop: 활성 toast 있을 때만 보이도록 opacity transition (toast의 scale 애니메이션과 동기)
const BACKDROP_CLASSES =
  'pointer-events-none fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200';

// Toast.tsx의 `transition-all duration-200`과 동기. 이 시간 이후 entry를
// 배열에서 제거해 data-[state=closed] 애니메이션이 끝까지 재생되도록 한다.
const CLOSE_ANIMATION_DURATION_MS = 200;

export function Toaster({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = React.useState<ToastEntry[]>([]);
  const nextIdRef = React.useRef(0);

  const enqueue = React.useCallback<EnqueueFn>((options) => {
    const id = ++nextIdRef.current;
    setEntries((current) => [...current, { ...options, id, open: true }]);
  }, []);

  const handleOpenChange = React.useCallback((id: number, open: boolean) => {
    if (open) return;
    // 1단계: open=false로 표시 → data-state=closed로 전환되며 종료 애니메이션 실행
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, open: false } : entry,
      ),
    );
    // 2단계: 애니메이션이 끝난 뒤 DOM에서 완전 제거 (메모리/포커스 트랩 누적 방지)
    setTimeout(() => {
      setEntries((current) => current.filter((entry) => entry.id !== id));
    }, CLOSE_ANIMATION_DURATION_MS);
  }, []);

  const hasActive = entries.some((entry) => entry.open);

  return (
    <ToastEnqueueContext.Provider value={enqueue}>
      <ToastProvider swipeDirection="up">
        {children}
        <div
          className={`${BACKDROP_CLASSES} ${hasActive ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />
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
