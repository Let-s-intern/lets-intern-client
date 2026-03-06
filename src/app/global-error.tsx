'use client';

import { sendErrorToWebhook } from '@/utils/webhook';
import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Sentry로 에러 전송
    Sentry.captureException(error);

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
