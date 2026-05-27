/** 뱃지에 표기할 최대 숫자 — 초과 시 "99+". */
export const MAX_BADGE = 99;

/** 안읽음 개수를 뱃지 라벨로 변환 (0이면 빈 문자열). */
export function formatBadge(count: number): string {
  if (count <= 0) return '';
  return count > MAX_BADGE ? `${MAX_BADGE}+` : String(count);
}
