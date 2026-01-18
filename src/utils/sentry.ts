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

/**
 * Webhook으로 전송하기 전에 에러를 필터링합니다.
 * 불필요한 노이즈 에러(React Fast Refresh, Manifest, 네트워크 에러 등)를 제외합니다.
 * @param error - 에러 객체
 * @param url - 에러가 발생한 URL (선택사항)
 * @returns true면 필터링 (전송하지 않음), false면 전송
 */
export function shouldFilterError(error: Error, url?: string): boolean {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';
  const urlLower = url?.toLowerCase() || '';

  // React Fast Refresh 에러
  if (
    message.includes('fast refresh') ||
    message.includes('react refresh') ||
    stack.includes('fast refresh') ||
    stack.includes('react refresh')
  ) {
    return true;
  }

  // Manifest, favicon, service worker 관련 에러
  if (
    urlLower.includes('manifest') ||
    urlLower.includes('favicon') ||
    urlLower.includes('service-worker') ||
    urlLower.includes('sw.js') ||
    message.includes('manifest') ||
    message.includes('favicon')
  ) {
    return true;
  }

  // 네트워크 에러 (CORS, NetworkError, Failed to fetch, timeout 등)
  if (
    name.includes('networkerror') ||
    message.includes('failed to fetch') ||
    message.includes('network error') ||
    message.includes('networkerror') ||
    message.includes('cors') ||
    message.includes('cross-origin') ||
    message.includes('timeout') ||
    message.includes('econnrefused') ||
    message.includes('econnreset') ||
    message.includes('enotfound') ||
    message.includes('eai_again') ||
    (name === 'typeerror' &&
      (message.includes('fetch') ||
        message.includes('network') ||
        message.includes('cors'))) ||
    stack.includes('fetch') ||
    stack.includes('xmlhttprequest')
  ) {
    return true;
  }

  // Chrome Extension, Firefox Extension 에러
  if (
    urlLower.startsWith('chrome-extension://') ||
    urlLower.startsWith('moz-extension://') ||
    urlLower.startsWith('safari-extension://') ||
    stack.includes('chrome-extension://') ||
    stack.includes('moz-extension://')
  ) {
    return true;
  }

  // ResizeObserver 에러 (일부 - 너무 많은 경우만)
  if (
    name.includes('resizeobserver') ||
    (message.includes('resizeobserver') &&
      message.includes('loop limit exceeded'))
  ) {
    return true;
  }

  // Script error (크로스 오리진 에러로 인한 일반적인 에러)
  if (message === 'script error' || message === 'script error.') {
    return true;
  }

  // 기타 노이즈 에러
  // - Non-Error promise rejection captured
  if (
    message.includes('non-error promise rejection') ||
    message.includes('unhandled promise rejection')
  ) {
    return true;
  }

  return false;
}
