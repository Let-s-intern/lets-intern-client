/**
 * 카테고리별 카운트 결과 버킷.
 */
export interface CategoryBucket {
  label: string;
  count: number;
}

interface CategoryCountOptions {
  /** 상위 N개만 유지하고 나머지는 `restLabel` 버킷으로 합산한다. */
  topN?: number;
  /** null/undefined/빈문자열/'-' 값에 사용할 라벨. 기본값 `'미입력'`. */
  emptyLabel?: string;
  /** topN 초과 항목을 합산할 라벨. 기본값 `'기타'`. */
  restLabel?: string;
  /** true이면 null/undefined/빈문자열/'-' 값을 카운트에서 완전히 제외한다. */
  excludeEmpty?: boolean;
  /**
   * 다중 값 필드를 분리하기 위한 구분자.
   * 지정 시 `pick` 결과를 이 패턴으로 split → 각 토큰을 trim 후 별도 카테고리로 누적한다.
   * 예: `splitDelimiter: ','` 로 `'마케팅, 영업'` → `['마케팅', '영업']` 각각 +1
   */
  splitDelimiter?: string | RegExp;
}

const DEFAULT_EMPTY_LABEL = '미입력';
const DEFAULT_REST_LABEL = '기타';

/**
 * 아이템 배열을 카테고리별 카운트 버킷 배열로 변환한다.
 *
 * - null/undefined/빈문자열/`'-'`은 `emptyLabel`(기본 `'미입력'`) 버킷에 누적된다.
 *   `excludeEmpty: true`이면 미입력 값을 버킷 생성 없이 완전히 제외한다.
 * - 결과는 카운트 내림차순으로 정렬된다.
 * - `topN`이 주어지면 상위 N개만 유지하고 나머지를 `restLabel` 버킷으로 합산한다.
 *   단, top N+1 이후에 데이터가 없으면 `restLabel` 버킷은 생성하지 않는다.
 * - 빈 입력은 빈 배열을 반환한다.
 */
export const categoryCount = <T>(
  items: T[],
  pick: (item: T) => string | null | undefined,
  options?: CategoryCountOptions,
): CategoryBucket[] => {
  if (items.length === 0) return [];

  const emptyLabel = options?.emptyLabel ?? DEFAULT_EMPTY_LABEL;
  const restLabel = options?.restLabel ?? DEFAULT_REST_LABEL;
  const excludeEmpty = options?.excludeEmpty ?? false;

  const splitDelimiter = options?.splitDelimiter;

  const countByLabel = new Map<string, number>();
  for (const item of items) {
    const raw = pick(item);
    const isRawEmpty = raw == null || raw === '' || raw === '-';
    if (isRawEmpty) {
      if (excludeEmpty) continue;
      countByLabel.set(emptyLabel, (countByLabel.get(emptyLabel) ?? 0) + 1);
      continue;
    }

    const tokens = splitDelimiter
      ? raw
          .split(splitDelimiter)
          .map((t) => t.trim())
          .filter((t) => t !== '' && t !== '-')
      : [raw];

    if (tokens.length === 0) {
      if (excludeEmpty) continue;
      countByLabel.set(emptyLabel, (countByLabel.get(emptyLabel) ?? 0) + 1);
      continue;
    }

    for (const token of tokens) {
      countByLabel.set(token, (countByLabel.get(token) ?? 0) + 1);
    }
  }

  const sorted: CategoryBucket[] = Array.from(countByLabel.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  if (options?.topN == null || sorted.length <= options.topN) {
    return sorted;
  }

  const top = sorted.slice(0, options.topN);
  const rest = sorted.slice(options.topN);
  const restCount = rest.reduce((sum, bucket) => sum + bucket.count, 0);

  if (restCount === 0) return top;

  return [...top, { label: restLabel, count: restCount }];
};
