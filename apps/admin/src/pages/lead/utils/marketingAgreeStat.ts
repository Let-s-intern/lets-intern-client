/**
 * 마케팅 동의율 통계.
 */
export interface MarketingAgreeStat {
  total: number;
  agreed: number;
  /** 0~100 정수(반올림). 총원 0이면 0. */
  percent: number;
}

/**
 * 신청자 배열의 마케팅 동의율을 계산한다.
 *
 * - `percent`는 `Math.round((agreed / total) * 100)`로 계산되며 소수점은 가지지 않는다.
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
    percent: Math.round((agreed / total) * 100),
  };
};
