import dayjs from '@/lib/dayjs';

/**
 * 일자별 신청자 카운트 데이터 포인트.
 */
export interface DailyApplicationCountPoint {
  /** YYYY-MM-DD 포맷의 일자 문자열 */
  date: string;
  /** 해당 일자의 신청자 수 */
  count: number;
}

const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * 마그넷 신청자 배열을 일자별 신청자 수 시리즈로 변환한다.
 *
 * - 입력 배열이 비어 있으면 빈 배열을 반환한다.
 * - 가장 이른 신청일부터 가장 늦은 신청일까지 빈 일자도 `count: 0`으로 채운다.
 * - 동일 일자 중복 신청은 누적 합산한다.
 * - 시간 오름차순으로 정렬된다.
 *
 * 타임존이 없는 ISO 문자열(예: `2026-05-12T13:24:00`)이 들어오면 dayjs가
 * 로컬 시간으로 해석하여 일자(YYYY-MM-DD)를 안정적으로 추출한다.
 */
export const dailyApplicationCount = (
  applications: Array<{ createDate?: string }>,
): DailyApplicationCountPoint[] => {
  if (applications.length === 0) return [];

  // 일자별 카운트 집계 (createDate 누락 항목은 건너뛴다)
  const countByDate = new Map<string, number>();
  for (const application of applications) {
    if (!application.createDate) continue;
    const date = dayjs(application.createDate).format(DATE_FORMAT);
    countByDate.set(date, (countByDate.get(date) ?? 0) + 1);
  }

  if (countByDate.size === 0) return [];

  // min ~ max 일자 결정
  const dates = Array.from(countByDate.keys()).sort();
  const minDate = dayjs(dates[0]);
  const maxDate = dayjs(dates[dates.length - 1]);

  // 범위 내 모든 일자를 채워 라인 단절을 막는다.
  const result: DailyApplicationCountPoint[] = [];
  let cursor = minDate;
  while (!cursor.isAfter(maxDate, 'day')) {
    const date = cursor.format(DATE_FORMAT);
    result.push({ date, count: countByDate.get(date) ?? 0 });
    cursor = cursor.add(1, 'day');
  }

  return result;
};
