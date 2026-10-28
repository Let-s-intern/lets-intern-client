const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 서버 일시(KST LocalDateTime, 계약 5.6)의 날짜 부분만 읽어 "11.10(월)" 로 만든다.
 * 실행 환경의 시간대에 흔들리지 않도록 요일은 UTC 기준 날짜로 계산한다.
 */
export const formatMonthDayWithWeekday = (dateTime: string) => {
  const [year, month, day] = dateTime.slice(0, 10).split('-');
  const weekday =
    WEEKDAYS[
      new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day)),
      ).getUTCDay()
    ];
  return `${month}.${day}(${weekday})`;
};
