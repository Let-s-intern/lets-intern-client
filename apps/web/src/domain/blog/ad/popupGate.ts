import {
  BLOG_POPUP_HIDE_UNTIL,
  BLOG_POPUP_SHOWN,
  POPUP_HIDE_DURATION_MS,
} from './data/newsletter';

/**
 * 스크롤 팝업 노출 게이트.
 * 다음 중 하나라도 해당하면 false(노출 안 함):
 * - `BLOG_POPUP_HIDE_UNTIL`(localStorage)이 현재 시각보다 미래 → "하루 동안 보지 않기" 유효
 * - `BLOG_POPUP_SHOWN`(sessionStorage) 존재 → 세션당 1회 노출 보장
 *
 * SSR 안전: window가 없으면 false.
 */
export function canShowPopup(): boolean {
  if (typeof window === 'undefined') return false;

  const hideUntil = window.localStorage.getItem(BLOG_POPUP_HIDE_UNTIL);
  if (hideUntil && Number(hideUntil) > Date.now()) return false;

  if (window.sessionStorage.getItem(BLOG_POPUP_SHOWN)) return false;

  return true;
}

/** 세션 내 재노출을 막는 플래그 기록. */
export function markPopupShown(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(BLOG_POPUP_SHOWN, 'true');
}

/** "하루 동안 보지 않기" — 24시간 동안 노출을 차단한다. */
export function hidePopupForDay(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    BLOG_POPUP_HIDE_UNTIL,
    String(Date.now() + POPUP_HIDE_DURATION_MS),
  );
}
