/**
 * 퍼센트 값을 신호등 컬러(hex)로 매핑한다.
 *
 * 응답률/동의율 같이 "높을수록 좋은" KPI에 사용한다.
 * - ≥ 80% : 진한 초록  (#10b981)
 * - ≥ 60% : 청록      (#02b3a7)
 * - ≥ 40% : 주황      (#f59e0b)
 * - <  40% : 빨강      (#ef4444)
 */
export const getPercentColor = (percent: number): string => {
  if (percent >= 80) return '#10b981';
  if (percent >= 60) return '#02b3a7';
  if (percent >= 40) return '#f59e0b';
  return '#ef4444';
};
