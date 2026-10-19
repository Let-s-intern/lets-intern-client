/** 건별 구분 라벨: 첫 건(index 0)=기준 라벨, 이후=연장 일수 */
export const periodKindLabel = (
  index: number,
  extendedDays: number | null,
  baseLabel: string,
) => (index === 0 ? baseLabel : `${extendedDays}일 연장`);
