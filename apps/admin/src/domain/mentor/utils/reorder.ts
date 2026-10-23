/**
 * from 위치의 항목을 rank 순위(1부터)에 끼워 넣는다. 사이 항목은 한 칸씩 밀린다.
 * 1 미만은 1, 개수 초과는 마지막으로 맞춘다. 원본 배열은 바꾸지 않는다.
 */
export function moveToRank<T>(items: T[], from: number, rank: number): T[] {
  if (from < 0 || from >= items.length) return items;

  const to = Math.min(Math.max(rank, 1), items.length) - 1;
  if (to === from) return items;

  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** i 와 j 위치를 맞바꾼다. 범위 밖이면 원본을 그대로 돌려준다 */
export function swap<T>(items: T[], i: number, j: number): T[] {
  const inRange = (index: number) => index >= 0 && index < items.length;
  if (!inRange(i) || !inRange(j)) return items;

  const next = [...items];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
