'use client';

import { useEffect } from 'react';
import { staleChunkReload } from '@/utils/log';

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
 * §8.5.3 — ChunkLoadError 메시지/속성에서 chunk URL을 추출한다.
 * 추출 불가능하면 undefined.
 */
function extractChunkUrl(
  error: unknown,
  filename: string | undefined,
): string | undefined {
  if (filename) return filename;
  if (!(error instanceof Error)) return undefined;
  // 일반적으로 "Loading chunk N failed.\n(error: https://.../_next/static/chunks/abc.js)" 형태
  const match = error.message.match(/https?:\/\/[^\s)]+/);
  return match?.[0];
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

      const chunkUrl = extractChunkUrl(event.error, event.filename);
      if (chunkUrl) staleChunkReload(chunkUrl);

      sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
      window.location.reload();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isChunkLoadError(event.reason)) return;

      const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG_KEY);
      if (alreadyReloaded) return;

      const chunkUrl = extractChunkUrl(event.reason, undefined);
      if (chunkUrl) staleChunkReload(chunkUrl);

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
