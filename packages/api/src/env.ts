/**
 * Next(웹) / Vite(어드민·멘토) 양쪽에서 안전하게 env를 읽는다.
 *
 * 핵심 제약: `process.env.X` / `import.meta.env.X` 는 빌드 타임에
 * **정적 치환**으로 인라인되므로, 반드시 *리터럴 키* 로 접근해야 한다.
 * 동적 인덱스 접근(`env[key]`) 은 Turbopack 클라이언트 번들에서
 * 치환 대상이 되지 않아 runtime에 undefined 가 된다.
 */

/**
 * Vite 환경에서만 import.meta.env 가 존재한다. Next(번들러)는 ESM이지만
 * 라이브러리 코드 컨텍스트에 따라 import.meta 자체를 모르므로 Function 우회.
 * 반환되는 객체는 Vite가 빌드 시 정적 치환한 결과 (런타임 객체 아님 — 호출 1회만 의미).
 */
function readViteEnv(): Record<string, string | undefined> {
  try {
    const meta = Function(
      'return typeof import.meta !== "undefined" ? import.meta : undefined',
    )();
    return meta?.env ?? {};
  } catch {
    return {};
  }
}
const VITE_ENV = readViteEnv();

function required(value: string | undefined, label: string): string {
  if (!value) {
    throw new Error(
      `[@letscareer/api] env ${label} is not defined. ` +
        `Set it in apps/{web,admin,mentor} env files. ` +
        `이 값이 비면 요청이 self-origin 으로 흘러 운영 사고로 이어집니다.`,
    );
  }
  return value;
}

/**
 * v1 API base URL (예: https://letsintern.kr/api/v1).
 * env 키: NEXT_PUBLIC_SERVER_API (Next.js) → VITE_SERVER_API (Vite).
 */
export const SERVER_API: string = required(
  process.env.NEXT_PUBLIC_SERVER_API ?? VITE_ENV.VITE_SERVER_API,
  '"NEXT_PUBLIC_SERVER_API" (or "VITE_SERVER_API")',
);

/**
 * v2 API base URL.
 * env 키: NEXT_PUBLIC_SERVER_API_V2 → VITE_SERVER_API_V2.
 */
export const SERVER_API_V2: string = required(
  process.env.NEXT_PUBLIC_SERVER_API_V2 ?? VITE_ENV.VITE_SERVER_API_V2,
  '"NEXT_PUBLIC_SERVER_API_V2" (or "VITE_SERVER_API_V2")',
);

/**
 * v3 API base URL. 현재 BE 미배포.
 * env 키: NEXT_PUBLIC_SERVER_API_V3 → VITE_SERVER_API_V3.
 */
export const SERVER_API_V3: string = required(
  process.env.NEXT_PUBLIC_SERVER_API_V3 ?? VITE_ENV.VITE_SERVER_API_V3,
  '"NEXT_PUBLIC_SERVER_API_V3" (or "VITE_SERVER_API_V3")',
);

/**
 * 백엔드 호스트 루트 (API 경로 prefix 없음).
 * OAuth 콜백·외부 임베드 등 호스트 루트가 필요한 곳에서만 사용.
 */
export const API_BASE_PATH: string = required(
  process.env.NEXT_PUBLIC_API_BASE_PATH ?? VITE_ENV.VITE_API_BASE_PATH,
  '"NEXT_PUBLIC_API_BASE_PATH" (or "VITE_API_BASE_PATH")',
);
