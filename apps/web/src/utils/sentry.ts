import type { ApiError } from '@letscareer/api';

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

