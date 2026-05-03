import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback?: ReactNode;
  rejectedFallback?: (props: FallbackProps) => ReactNode;
}

function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <p className="text-neutral-40 text-sm">
        {error?.message ?? '오류가 발생했습니다.'}
      </p>
      <button
        className="text-sm text-blue-500 underline"
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
