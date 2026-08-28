/**
 * Next(웹) / Vite(어드민·멘토) 양쪽에서 안전하게 env를 읽는다.
 *
 * 핵심 제약: `process.env.X` / `import.meta.env.X` 는 빌드 타임에
 * **정적 치환**으로 인라인되므로, 반드시 *리터럴 키* 로 접근해야 한다.
 * 동적 인덱스 접근(`env[key]`) 은 Turbopack 클라이언트 번들에서
 * 치환 대상이 되지 않아 runtime에 undefined 가 된다.
 */

/**
 * Vite 환경에서만 import.meta.env 에 환경 변수가 채워진다.
 *
 * 핵심: Vite 의 `import.meta.env` 정적 치환은 **AST 상 정확한 member access 패턴**
 * (`import.meta.env.<KEY>`) 만 인식한다. cast(`as unknown as ...`) 가 끼거나 변수
 * 거친 동적 접근(`VITE_ENV.VITE_X`) 은 transform 누락으로 dev/build 모두에서 undefined
 * 가 되어 워닝 폭주. 그래서 각 키를 **직접 리터럴 텍스트** 로 참조한다.
 *
 * - Vite: dev/build 모두 정적 치환·객체 inject
 * - Next(Turbopack/SWC): import.meta 는 ESM 컨텍스트에서 정의되지만 .env 는 undefined → ?? fallback
 * - jest(next/jest SWC): import.meta syntax 자체는 valid, .env 는 undefined → fallback
 *
 * packages/api 는 vite/client 타입을 직접 import 하지 않으므로 이 파일이 실제로
 * 접근하는 키만 타입 보강한다(위 주석대로 어차피 리터럴 키만 쓰므로 인덱스
 * 시그니처는 불필요). 인덱스 시그니처(`[key: string]: ...`)로 보강하면
 * web(Next.js)이 물고 오는 webpack/module.d.ts 의 `[key: string]: string |
 * boolean | undefined` 와 값 타입이 달라 병합 시 충돌(ts2374, tsgo에서만 검출)
 * 이 난다. 개별 프로퍼티는 인덱스 시그니처와 달리 가리키는 값이 호환되기만 하면
 * 다른 선언과 충돌하지 않으므로 vite/client·webpack 양쪽 컨텍스트 모두 안전하다.
 *
 * `ImportMeta.env`는 vite/client(node_modules/vite/types/importMeta.d.ts)의
 * `readonly env: ImportMetaEnv` 선언과 modifier·타입을 동일하게 맞춰 재선언한다.
 */
declare global {
  interface ImportMetaEnv {
    readonly VITE_SERVER_API?: string;
    readonly VITE_SERVER_API_V2?: string;
    readonly VITE_SERVER_API_V3?: string;
    readonly VITE_API_BASE_PATH?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

function readViteVar(read: () => string | undefined): string | undefined {
  try {
    return read();
  } catch {
    return undefined;
  }
}

// admin/mentor 의 tsconfig 는 `"types": ["vite/client", ...]` 화이트리스트로
// @types/node 를 의도적으로 제외하므로, 이 파일이 그 컨텍스트에서 컴파일될 때
// 직접 `process` 참조는 ts(2591)을 일으킨다.
// 모듈 로컬 ambient 선언으로 타입만 보강하면 런타임에는 영향이 없고,
// `process.env.<리터럴>` 텍스트 패턴이 그대로 남아 Next/Turbopack 정적 치환도 유지된다.
// 타입은 항상 존재로 두고(runtime undefined 는 아래 typeof 가드가 처리),
// const 변수 거친 narrowing 누락으로 ts(2533) 가 재발하지 않도록 한다.
declare const process: { env: Record<string, string | undefined> };

// Vite 브라우저 번들에는 `process` 전역이 실제로 없어 직접 접근 시 ReferenceError.
// `typeof <bare id>` 는 미선언 식별자에도 안전하므로 Vite에서 false 로 단락된다.
const HAS_PROCESS_ENV =
  typeof process !== 'undefined' && typeof process.env !== 'undefined';

// module-top throw는 admin/mentor SPA를 통째로 죽여 SSO 등 무관한 흐름까지 막힘.
// fail-fast 의도(self-origin 호출 방지)는 axios.ts/axiosV2.ts/axiosV3.ts의
// `if (!baseURL) throw` 가드가 호출 시점에 보장하므로, 여기서는 빈 문자열로 노출하고
// 콘솔 경고만 남긴다.
function readEnv(value: string | undefined, label: string): string {
  if (!value && typeof window !== 'undefined') {
    console.error(
      `[@letscareer/api] env ${label} is not defined. ` +
        `Set it in apps/{web,admin,mentor} env files. ` +
        `이 값이 비면 요청이 self-origin 으로 흘러 운영 사고로 이어집니다.`,
    );
  }
  return value ?? '';
}

/**
 * v1 API base URL (예: https://letsintern.kr/api/v1).
 * env 키: NEXT_PUBLIC_SERVER_API (Next.js) → VITE_SERVER_API (Vite).
 */
export const SERVER_API: string = readEnv(
  (HAS_PROCESS_ENV ? process.env.NEXT_PUBLIC_SERVER_API : undefined) ??
    readViteVar(() => import.meta.env?.VITE_SERVER_API),
  '"NEXT_PUBLIC_SERVER_API" (or "VITE_SERVER_API")',
);

/**
 * v2 API base URL.
 * env 키: NEXT_PUBLIC_SERVER_API_V2 → VITE_SERVER_API_V2.
 */
export const SERVER_API_V2: string = readEnv(
  (HAS_PROCESS_ENV ? process.env.NEXT_PUBLIC_SERVER_API_V2 : undefined) ??
    readViteVar(() => import.meta.env?.VITE_SERVER_API_V2),
  '"NEXT_PUBLIC_SERVER_API_V2" (or "VITE_SERVER_API_V2")',
);

/**
 * v3 API base URL. 현재 BE 미배포.
 * env 키: NEXT_PUBLIC_SERVER_API_V3 → VITE_SERVER_API_V3.
 */
export const SERVER_API_V3: string = readEnv(
  (HAS_PROCESS_ENV ? process.env.NEXT_PUBLIC_SERVER_API_V3 : undefined) ??
    readViteVar(() => import.meta.env?.VITE_SERVER_API_V3),
  '"NEXT_PUBLIC_SERVER_API_V3" (or "VITE_SERVER_API_V3")',
);

/**
 * 백엔드 호스트 루트 (API 경로 prefix 없음).
 * OAuth 콜백·외부 임베드 등 호스트 루트가 필요한 곳에서만 사용.
 */
export const API_BASE_PATH: string = readEnv(
  (HAS_PROCESS_ENV ? process.env.NEXT_PUBLIC_API_BASE_PATH : undefined) ??
    readViteVar(() => import.meta.env?.VITE_API_BASE_PATH),
  '"NEXT_PUBLIC_API_BASE_PATH" (or "VITE_API_BASE_PATH")',
);
