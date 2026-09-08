/**
 * 신청 시트의 날짜·시간 변환 유틸.
 *
 * 원본은 `domain/challenge/feedback/live/utils.ts` 다. 필요한 것만 복제했다 —
 * 도메인 간 공유는 하지 않는다(`.claude/rules/core.md` 프로젝트 불변식).
 *
 * 서버가 주는 슬롯 시각은 타임존이 없는 `LocalDateTime`("2026-09-13T10:00:00") 이다.
 * `new Date(iso)` 로 파싱하면 브라우저 타임존이 끼어들어 날짜가 하루 밀릴 수 있으므로
 * ISO 문자열은 **자르기**로 다룬다. 자리수가 고정이라 사전순 비교가 곧 시간순이다.
 */

/** `LocalDateTime` → 'YYYY-MM-DD'. */
export const toDateKey = (iso: string): string => iso.slice(0, 10);

/** `LocalDateTime` → 'HH:mm'. */
export const toTimeKey = (iso: string): string => iso.slice(11, 16);

/** 시간 버튼 라벨 (예: '10:00 ~ 10:30'). */
export const toSlotLabel = (startIso: string, endIso: string): string =>
  `${toTimeKey(startIso)} ~ ${toTimeKey(endIso)}`;

/** `Date` → 'YYYY-MM-DD' (로컬 기준). 캘린더가 '오늘'을 표시할 때 쓴다. */
export const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
