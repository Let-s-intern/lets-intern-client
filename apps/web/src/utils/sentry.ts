import type * as Sentry from '@sentry/nextjs';
import type { ApiError } from '@letscareer/api';

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
 * 다양한 에러 객체 shape에서 HTTP status를 정규화 추출.
 * - ApiError (packages/api): `err.status`
 * - 커스텀 client(utils/client.ts): `err.status`
 * - axios: `err.response.status`
 * - native fetch + plain Error throw: status 미보존 (undefined 반환)
 */
export function extractHttpStatus(err: unknown): number | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  const e = err as Partial<ApiError> & { response?: { status?: unknown } };
  if (typeof e.status === 'number') return e.status;
  if (typeof e.response?.status === 'number') return e.response.status;
  return undefined;
}

/**
 * 에러를 노이즈 카테고리로 분류합니다.
 * - 'translator': Google 번역기/브라우저 번역 확장이 유발하는 DOM 충돌 에러
 * - 'wallet': MetaMask/Web3 지갑 확장 에러
 * - 'stale-deploy': 배포 직후 stale chunk 로딩 실패 에러
 * - null: 노이즈가 아닌 실제 에러
 */
export function classifyNoise(
  error: Error,
): 'translator' | 'wallet' | 'stale-deploy' | null {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  // 번역기 DOM 충돌 (Google Translate 등이 DOM 노드를 제거해서 발생)
  if (
    name === 'typeerror' &&
    (message.includes('parentnode') ||
      message.includes('removechild') ||
      message.includes('insertbefore') ||
      message.includes('nextsibling') ||
      message.includes('previoussibling'))
  ) {
    return 'translator';
  }

  // MetaMask/Web3 지갑 확장 에러
  if (
    message.includes('metamask') ||
    message.includes('web3') ||
    message.includes('ethereum') ||
    message.includes('wallet')
  ) {
    return 'wallet';
  }

  // Stale chunk (배포 직후 오래된 JS 청크를 로드하지 못하는 에러)
  if (
    name === 'chunkloaderror' ||
    message.includes('failed to load chunk') ||
    message.includes('loading chunk') ||
    message.includes('chunkloaderror')
  ) {
    return 'stale-deploy';
  }

  return null;
}

/**
 * Webhook으로 전송하기 전에 에러를 필터링합니다.
 * 불필요한 노이즈 에러(React Fast Refresh, Manifest, 네트워크 에러 등)를 제외합니다.
 * 번역기/MetaMask/stale chunk는 drop 하지 않고 noise 태그로 격리합니다 (classifyNoise 활용).
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
