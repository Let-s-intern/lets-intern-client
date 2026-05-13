/**
 * 퍼센트 값을 신호등 그라데이션 컬러(hex)로 매핑한다.
 *
 * 응답률/동의율처럼 "높을수록 좋은" KPI에 사용한다.
 * 0~100% 전 구간을 10% 단위로 나눠 빨강 → 주황 → 노랑 → 초록 흐름.
 *
 * - ≥ 90 : #059669 (진한 에메랄드)
 * - ≥ 80 : #10b981 (에메랄드)
 * - ≥ 70 : #22c55e (밝은 초록)
 * - ≥ 60 : #84cc16 (라임)
 * - ≥ 50 : #eab308 (노랑)
 * - ≥ 40 : #f59e0b (앰버/주황)
 * - ≥ 30 : #f97316 (오렌지)
 * - ≥ 20 : #ef4444 (밝은 빨강)
 * - ≥ 10 : #dc2626 (빨강)
 * - <  10 : #991b1b (진한 빨강)
 */
export const getPercentColor = (percent: number): string => {
  if (percent >= 90) return '#059669';
  if (percent >= 80) return '#10b981';
  if (percent >= 70) return '#22c55e';
  if (percent >= 60) return '#84cc16';
  if (percent >= 50) return '#eab308';
  if (percent >= 40) return '#f59e0b';
  if (percent >= 30) return '#f97316';
  if (percent >= 20) return '#ef4444';
  if (percent >= 10) return '#dc2626';
  return '#991b1b';
};
