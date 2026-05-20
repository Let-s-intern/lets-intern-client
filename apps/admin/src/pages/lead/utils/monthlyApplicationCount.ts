import dayjs from '@/lib/dayjs';

/**
 * 월별 신청자 카운트 데이터 포인트.
 */
export interface MonthlyApplicationCountPoint {
  /** YYYY-MM 포맷의 월 문자열 */
  month: string;
  /** 해당 월의 신청자 수 */
  count: number;
}

const MONTH_FORMAT = 'YYYY-MM';

/**
 * 마그넷 신청자 배열을 월별 신청자 수 시리즈로 변환한다.
 *
 * - 입력 배열이 비어 있으면 빈 배열을 반환한다.
 * - 가장 이른 신청월부터 가장 늦은 신청월까지 빈 월도 `count: 0`으로 채운다.
 * - 동일 월 중복 신청은 누적 합산한다.
 * - 시간 오름차순으로 정렬된다.
 */
export const monthlyApplicationCount = <
  T extends { createDate?: string | null },
>(
  applications: T[],
): MonthlyApplicationCountPoint[] => {
  if (applications.length === 0) return [];

  const countByMonth = new Map<string, number>();
  for (const application of applications) {
    if (!application.createDate) continue;
    const d = dayjs(application.createDate);
    if (!d.isValid()) continue;
    const month = d.format(MONTH_FORMAT);
    countByMonth.set(month, (countByMonth.get(month) ?? 0) + 1);
  }

  if (countByMonth.size === 0) return [];

  const months = Array.from(countByMonth.keys()).sort();
  const minMonth = dayjs(`${months[0]}-01`);
  const maxMonth = dayjs(`${months[months.length - 1]}-01`);

  const result: MonthlyApplicationCountPoint[] = [];
  let cursor = minMonth;
  while (!cursor.isAfter(maxMonth, 'month')) {
    const month = cursor.format(MONTH_FORMAT);
    result.push({ month, count: countByMonth.get(month) ?? 0 });
    cursor = cursor.add(1, 'month');
  }

  return result;
};
