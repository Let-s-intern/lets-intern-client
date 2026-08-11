import type { AccessLogDetail, AccessLogTargetSummary } from '@/api/accessLog';

/**
 * 단건 응답의 낱개 내역을 목록과 같은 `이용 항목` 요약으로 접는다 (LC-3201, PRD 7.1).
 *
 * 목록 응답에는 `targetSummary` 가 함께 오지만 **단건 응답에는 없다.** 그래서 환불 모달은
 * `details` 에서 같은 모양을 만들어야 한다. 결과는 목록과 같은 문구로 읽혀야 한다 —
 * 같은 신청서가 목록과 환불 모달에서 다르게 보이면 운영이 어느 쪽을 믿을지 알 수 없다.
 *
 * `count` 는 접근 횟수가 아니라 **구별되는 대상 개수**다. 한 미션을 열 번 열어도 1건이고
 * 서로 다른 미션 셋을 열면 3건이다. 누적 횟수는 `accessCount` 로 따로 표시한다.
 * 이 둘을 섞으면 대시보드를 열두 번 새로고침한 건이 `대시보드 12건` 으로 보인다.
 *
 * `targetId` 가 없는 줄은 서로 같다고 볼 근거가 없어 각각 한 건으로 센다. 하나로 접으면
 * 실제보다 적게 이용한 것처럼 보이는데, 그 방향의 오차가 곧 잘못된 전액 환불이다.
 */
export const summarizeDetailTargets = (
  details: AccessLogDetail[] | null | undefined,
): AccessLogTargetSummary[] => {
  // Map 은 삽입 순서를 유지한다. 순서가 흔들리면 같은 데이터가 열 때마다 다르게 읽힌다.
  const buckets = new Map<string, { ids: Set<number>; unidentified: number }>();

  for (const detail of details ?? []) {
    // 타입이 비어도 버리지 않는다. 조용히 사라지면 실제로 이용한 건이 `없음` 으로 읽힌다.
    const targetType = detail.targetType?.trim() ?? '';

    let bucket = buckets.get(targetType);
    if (!bucket) {
      bucket = { ids: new Set<number>(), unidentified: 0 };
      buckets.set(targetType, bucket);
    }

    if (detail.targetId == null) bucket.unidentified += 1;
    else bucket.ids.add(detail.targetId);
  }

  return [...buckets].map(([targetType, bucket]) => ({
    targetType,
    count: bucket.ids.size + bucket.unidentified,
  }));
};
