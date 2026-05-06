'use client';

import { useEffect } from 'react';

const RELOAD_FLAG_KEY = 'sentry_stale_chunk_reloaded';

function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const name = error.name.toLowerCase();
  const message = error.message.toLowerCase();
  return (
    name === 'chunkloaderror' ||
    message.includes('failed to load chunk') ||
    message.includes('loading chunk') ||
    message.includes('chunkloaderror')
  );
}

/**
 * ChunkLoadError 감지 시 1회 자동 새로고침하는 클라이언트 컴포넌트.
 * sessionStorage로 reload 횟수를 추적하여 무한 루프를 방지합니다.
 */
export default function StaleChunkHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (!isChunkLoadError(event.error)) return;

      const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG_KEY);
      if (alreadyReloaded) return;

      sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
      window.location.reload();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isChunkLoadError(event.reason)) return;

      const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG_KEY);
      if (alreadyReloaded) return;

      sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
      window.location.reload();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
