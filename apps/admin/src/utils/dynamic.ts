import { ComponentType, lazy } from 'react';

type DynamicOptions = {
  ssr?: boolean;
  loading?: ComponentType;
};

/**
 * next/dynamic 호환 shim.
 * admin(Vite) 환경에서는 React.lazy로 위임한다.
 * 사용자는 반드시 상위에서 <Suspense>로 감싸야 한다.
 */
export function dynamic<T extends ComponentType<unknown>>(
  loader: () => Promise<{ default: T } | T>,
  _options?: DynamicOptions,
): T {
  const LazyComp = lazy(async () => {
    const mod = await loader();
    return 'default' in mod ? { default: mod.default } : { default: mod as T };
  });
  // TODO(ts-suppress): 검토 필요 — as unknown as 이중 캐스팅
  return LazyComp as unknown as T;
}

export default dynamic;
