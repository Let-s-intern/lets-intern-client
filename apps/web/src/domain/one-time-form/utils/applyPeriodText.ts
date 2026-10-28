// 서버 일시는 KST LocalDateTime 문자열("2026-11-01T00:00:00", 계약 5.6). 시간대 변환 없이 날짜 부분만 읽는다
const splitDate = (dateTime: string) => {
  const [year, month, day] = dateTime.slice(0, 10).split('-');
  return { year, month, day };
};

/** "2026-11-02T10:00:00" -> "2026.11.02" */
export const formatDotDate = (dateTime: string) => {
  const { year, month, day } = splitDate(dateTime);
  return `${year}.${month}.${day}`;
};

/** 같은 해면 끝 날짜의 연도를 뺀다. "2026.11.01 ~ 11.10" */
export const formatApplyPeriod = (startDate: string, endDate: string) => {
  const start = splitDate(startDate);
  const end = splitDate(endDate);
  const endText =
    start.year === end.year
      ? `${end.month}.${end.day}`
      : formatDotDate(endDate);
  return `${formatDotDate(startDate)} ~ ${endText}`;
};

/** "2026-11-01T00:00:00" -> "11월 1일" */
export const formatMonthDay = (dateTime: string) => {
  const { month, day } = splitDate(dateTime);
  return `${Number(month)}월 ${Number(day)}일`;
};
