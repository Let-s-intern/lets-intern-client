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

export const SERVER_API: string =
  readProcessEnv('NEXT_PUBLIC_SERVER_API') ??
  readImportMetaEnv('VITE_SERVER_API') ??
  '';

export const API_BASE_PATH: string =
  readProcessEnv('NEXT_PUBLIC_API_BASE_PATH') ??
  readImportMetaEnv('VITE_API_BASE_PATH') ??
  '';
