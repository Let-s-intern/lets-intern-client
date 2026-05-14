import * as Sentry from '@sentry/nextjs';

/**
 * §7.3 — 블로그 추천 fallback이 발생했을 때 'blog.recommend.fallback' op span을
 * 1회 emit한다 (KPI 카운터). 호출처는 catch 분기에서 captureBlogError 직전에 호출.
 */
export function emitBlogRecommendFallbackSpan(opts: {
  section: 'blogRecommendList' | 'programRecommendList';
  err: unknown;
}): void {
  const fallbackReason = opts.err instanceof Error ? opts.err.name : 'unknown';
  Sentry.startSpan(
    {
      name: 'blog.recommend.fallback',
      op: 'app.fallback',
      attributes: {
        section: opts.section,
        fallbackReason,
      },
    },
    () => {},
  );
}
