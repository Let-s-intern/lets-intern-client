import type * as Sentry from '@sentry/nextjs';

/**
 * Sentry 이벤트 태그를 webhook에서 사용할 수 있는 형식으로 정규화합니다.
 * @param tags - Sentry 이벤트의 tags 객체
 * @returns 정규화된 태그 객체 또는 undefined
 */
export function normalizeSentryTags(
  tags: Sentry.Event['tags'],
): Record<string, string | number | boolean | null | undefined> | undefined {
  if (!tags) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(tags).map(([key, value]) => [
      key,
      value?.toString() ?? null,
    ]),
  ) as Record<string, string | number | boolean | null | undefined>;
}

