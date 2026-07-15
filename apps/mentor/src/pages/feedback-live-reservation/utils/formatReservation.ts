/**
 * 예약 현황 페이지 전용 날짜/시간 포맷 유틸.
 * 이 도메인에서만 사용하므로 colocate한다.
 */

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** ISO 문자열에서 "HH:mm" 추출. 파싱 실패 시 빈 문자열. */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * 완료된 예약 테이블의 "날짜 / 시간" 셀 표기.
 * 예: "2025년 10월 16일 목요일 17:30-18:00"
 */
export function formatDateTimeRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return startIso;
  const y = start.getFullYear();
  const mo = start.getMonth() + 1;
  const d = start.getDate();
  const dow = WEEKDAY_KO[start.getDay()];
  return `${y}년 ${mo}월 ${d}일 ${dow}요일 ${formatTime(startIso)}-${formatTime(endIso)}`;
}

/**
 * "신청 시간" 컬럼 표기. createDate가 없으면 "—".
 * 예: "2025-10-10 13:20"
 */
export function formatCreateDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d} ${formatTime(iso)}`;
}

/** ISO/날짜 문자열에서 "YYYY-MM-DD"(로컬 날짜)만 추출. 범위 필터 비교용. */
export function toDateKey(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}
