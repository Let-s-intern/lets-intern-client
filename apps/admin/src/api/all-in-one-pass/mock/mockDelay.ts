/** 로딩 상태가 렌더되도록 아주 짧은 지연을 준다. */
export const mockDelay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((res) => setTimeout(() => res(value), ms));
