/**
 * 마케팅 동의율 통계.
 */
export interface MarketingAgreeStat {
  total: number;
  agreed: number;
  /** 0~100 실수. 총원 0이면 0. 표시단에서 `.toFixed(N)`로 자리수 결정. */
  percent: number;
}

/**
 * 신청자 배열의 마케팅 동의율을 계산한다.
 *
 * - `percent`는 `(agreed / total) * 100` 실수다. 표시단에서 자리수 결정.
 * - `total === 0`이면 `{ total: 0, agreed: 0, percent: 0 }`을 반환한다.
 */
export const marketingAgreeStat = (
  items: Array<{ marketingAgree: boolean }>,
): MarketingAgreeStat => {
  const total = items.length;
  if (total === 0) return { total: 0, agreed: 0, percent: 0 };

  let agreed = 0;
  for (const item of items) {
    if (item.marketingAgree) agreed += 1;
  }

  return {
    total,
    agreed,
    percent: (agreed / total) * 100,
  };
};
