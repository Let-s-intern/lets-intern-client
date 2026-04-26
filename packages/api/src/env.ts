type AnyEnv = Record<string, string | undefined>;

function readProcessEnv(key: string): string | undefined {
  if (typeof process === 'undefined') return undefined;
  const env = (process as unknown as { env?: AnyEnv }).env;
  return env?.[key];
}

function readImportMetaEnv(key: string): string | undefined {
  try {
    const meta = Function('return typeof import.meta !== "undefined" ? import.meta : undefined')();
    if (!meta || typeof meta !== 'object') return undefined;
    const env = (meta as { env?: AnyEnv }).env;
    return env?.[key];
  } catch {
    return undefined;
  }
}

/**
 * v1 API base URL (예: https://letsintern.kr/v1).
 * env 키: NEXT_PUBLIC_SERVER_API (Next.js) → VITE_SERVER_API (Vite) → ''.
 */
export const SERVER_API: string =
  readProcessEnv('NEXT_PUBLIC_SERVER_API') ??
  readImportMetaEnv('VITE_SERVER_API') ??
  '';

/**
 * v2 API base URL (예: https://letsintern.kr/v2).
 * env 키: NEXT_PUBLIC_SERVER_API_V2 → VITE_SERVER_API_V2 → ''.
 */
export const SERVER_API_V2: string =
  readProcessEnv('NEXT_PUBLIC_SERVER_API_V2') ??
  readImportMetaEnv('VITE_SERVER_API_V2') ??
  '';

/**
 * v3 API base URL (예: https://letsintern.kr/v3).
 * env 키: NEXT_PUBLIC_SERVER_API_V3 → VITE_SERVER_API_V3 → ''.
 */
export const SERVER_API_V3: string =
  readProcessEnv('NEXT_PUBLIC_SERVER_API_V3') ??
  readImportMetaEnv('VITE_SERVER_API_V3') ??
  '';

/**
 * 백엔드 호스트 루트 (API 경로 prefix 없음).
 * OAuth 콜백·외부 임베드 등 호스트 루트가 필요한 곳에서만 사용.
 */
export const API_BASE_PATH: string =
  readProcessEnv('NEXT_PUBLIC_API_BASE_PATH') ??
  readImportMetaEnv('VITE_API_BASE_PATH') ??
  '';
