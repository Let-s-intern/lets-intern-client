/** 구글 캘린더 "일정 추가"(TEMPLATE) 프리필 링크 생성 유틸. */

export interface GoogleCalendarEvent {
  title: string;
  /** ISO datetime. 오프셋/Z 가 없으면 KST(+09:00)로 간주해 UTC 로 변환한다. */
  startAt: string;
  endAt: string;
  details?: string;
  location?: string;
}

/**
 * ISO 문자열을 구글 캘린더 dates 파라미터(YYYYMMDDTHHMMSSZ, UTC)로 변환.
 *
 * BE 가 내려주는 예약 시각은 타임존 표기가 없는 KST(naive)라, 오프셋/Z 가 없으면
 * +09:00 로 간주한다. 이렇게 하면 브라우저 타임존과 무관하게 항상 동일한 절대
 * 시각으로 등록된다(UTC Z 로 순간이 고정되므로 ctz 파라미터가 불필요).
 */
function toGoogleCalendarUtc(iso: string): string {
  const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(iso);
  const date = new Date(hasTimezone ? iso : `${iso}+09:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`올바르지 않은 날짜입니다: ${iso}`);
  }
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

/**
 * 구글 캘린더 일정 추가 화면으로 여는 프리필 URL 을 만든다.
 * 링크를 열면 값이 채워진 "새 일정" 화면이 뜨고, 저장은 사용자가 수동으로 누른다.
 */
export function createGoogleCalendarUrl(event: GoogleCalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toGoogleCalendarUtc(event.startAt)}/${toGoogleCalendarUtc(
      event.endAt,
    )}`,
  });
  if (event.details) params.set('details', event.details);
  if (event.location) params.set('location', event.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
