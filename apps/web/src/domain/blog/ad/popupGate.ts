import {
  BLOG_POPUP_HIDE_UNTIL,
  POPUP_HIDE_DURATION_MS,
} from './data/newsletter';

/**
 * 스크롤 팝업 노출 게이트.
 * `BLOG_POPUP_HIDE_UNTIL`(localStorage)이 현재 시각보다 미래면 false(노출 안 함)
 * → "하루 동안 보지 않기"만 차단. 그 외에는 매 방문마다 노출 허용.
 *
 * SSR 안전: window가 없으면 false.
 */
export function canShowPopup(): boolean {
  if (typeof window === 'undefined') return false;

  const hideUntil = window.localStorage.getItem(BLOG_POPUP_HIDE_UNTIL);
  if (hideUntil && Number(hideUntil) > Date.now()) return false;

  return true;
}

/** "하루 동안 보지 않기" — 24시간 동안 노출을 차단한다. */
export function hidePopupForDay(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    BLOG_POPUP_HIDE_UNTIL,
    String(Date.now() + POPUP_HIDE_DURATION_MS),
  );
}
