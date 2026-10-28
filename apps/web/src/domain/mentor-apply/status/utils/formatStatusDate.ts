const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** ISO 문자열의 날짜 부분만 읽는다. 시간대 변환 없이 서버가 준 날짜 그대로다 */
const toDateParts = (iso: string) => {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return { year, month, day };
};

/** 신청일 표시. `2026-10-28T14:03:00` → `2026. 10. 28.` */
export function formatSubmittedDate(iso: string): string {
  const { year, month, day } = toDateParts(iso);
  return `${year}. ${month}. ${day}.`;
}

/** 예상 회신일 표시. `2026-11-04` → `11월 4일 (수)` */
export function formatReplyDate(iso: string): string {
  const { year, month, day } = toDateParts(iso);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}
