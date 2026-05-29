import dayjs from '@/lib/dayjs';

/**
 * 예약 날짜·시간 표기.
 * 형식: `YYYY년 M월 D일 요일 HH:mm-HH:mm` (예: 2026년 5월 29일 금요일 17:00-17:30)
 * start/end 가 다른 날짜여도 날짜는 start 기준으로만 표기한다(슬롯은 동일 일자 전제).
 */
export function formatReservationDateTime(
  startDate: string,
  endDate: string,
): string {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const datePart = start.format('YYYY년 M월 D일 dddd');
  return `${datePart} ${start.format('HH:mm')}-${end.format('HH:mm')}`;
}

/** 신청 시간 표기. 형식: `YYYY-MM-DD HH:mm` */
export function formatApplyDateTime(createDate: string): string {
  return dayjs(createDate).format('YYYY-MM-DD HH:mm');
}
