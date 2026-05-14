'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';
import { sendErrorToWebhook } from '@/utils/webhook';
import { rscRenderFailed } from '@/utils/log';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    const route =
      typeof window !== 'undefined' ? window.location.pathname : undefined;

    // Sentry로 에러 전송 (server-component 종류 태그 + route 정보 추가)
    Sentry.captureException(error, {
      tags: { kind: 'server-component' },
      extra: {
        digest: error.digest,
        route,
      },
    });

    // §8.5.2 — RSC 렌더 실패 구조화 로그
    rscRenderFailed(error.digest, route);

    // Webhook으로도 에러 전송 (이중 안전장치)
    sendErrorToWebhook(error, {
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      extra: {
        digest: error.digest,
      },
    }).catch(() => {
      // Webhook 전송 실패는 조용히 무시 (무한 루프 방지)
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
