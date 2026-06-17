'use client';

import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback?: ReactNode;
  rejectedFallback?: (props: FallbackProps) => ReactNode;
}

function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <p className="text-xsmall14 text-neutral-40">문제가 발생했습니다.</p>
      <button
        className="rounded-xs border-neutral-80 text-xsmall14 text-neutral-20 border px-4 py-2 font-medium"
        onClick={resetErrorBoundary}
      >
        다시 시도
      </button>
    </div>
  );
}

export function AsyncBoundary({
  children,
  pendingFallback = null,
  rejectedFallback,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallbackRender={rejectedFallback ?? DefaultErrorFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
