'use client';

import { sendErrorToWebhook } from '@/utils/webhook';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

/**
 * 라우트 세그먼트(error.tsx)용 공용 에러 폴백.
 * 서버 컴포넌트 fetch throw + 미포착 클라이언트 렌더 throw를 헤더/레이아웃을 유지한 채 흡수한다.
 * global-error.tsx 와 동일한 Sentry + webhook 로깅 패턴을 따른다.
 */
export default function SegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const route =
      typeof window !== 'undefined' ? window.location.pathname : undefined;

    Sentry.captureException(error, {
      tags: { kind: 'route-segment' },
      extra: { digest: error.digest, route },
    });

    sendErrorToWebhook(error, {
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      extra: { digest: error.digest },
    }).catch(() => {
      // Webhook 전송 실패는 조용히 무시 (무한 루프 방지)
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 text-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-small18 text-neutral-0 font-semibold">
          문제가 발생했어요
        </p>
        <p className="text-xsmall14 text-neutral-40">
          일시적인 오류로 페이지를 불러오지 못했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="bg-primary text-xsmall14 rounded-sm px-5 py-2.5 font-medium text-neutral-100"
          onClick={reset}
        >
          다시 시도
        </button>
        <Link
          className="border-neutral-80 text-xsmall14 text-neutral-20 rounded-sm border px-5 py-2.5 font-medium"
          href="/"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
