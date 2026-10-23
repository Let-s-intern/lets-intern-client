/**
 * items 를 worker 로 처리하되 동시에 limit 개까지만 돌린다. 하나가 끝나면 다음 것을 시작한다.
 * worker 의 실패는 여기서 삼키지 않는다 — 행마다 결과를 따로 남기도록 worker 안에서 처리한다.
 * signal 이 중단되면 아직 시작하지 않은 항목은 시작하지 않는다.
 */
export const runWithLimit = async <T>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<void>,
  signal?: AbortSignal,
): Promise<void> => {
  let next = 0;
  const lane = async () => {
    while (next < items.length && !signal?.aborted) {
      const item = items[next];
      next += 1;
      await worker(item);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, lane),
  );
};
