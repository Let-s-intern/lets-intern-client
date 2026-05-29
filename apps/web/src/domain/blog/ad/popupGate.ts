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

  // Safari 시크릿 모드·스토리지 차단 환경에서는 localStorage 접근이 throw → 노출 허용으로 폴백.
  try {
    const hideUntil = window.localStorage.getItem(BLOG_POPUP_HIDE_UNTIL);
    if (hideUntil && Number(hideUntil) > Date.now()) return false;
  } catch {
    return true;
  }

  return true;
}

/** "하루 동안 보지 않기" — 24시간 동안 노출을 차단한다. */
export function hidePopupForDay(): void {
  if (typeof window === 'undefined') return;

  // 스토리지 차단 환경에서 setItem이 throw해도 앱이 죽지 않도록 무시(차단 저장만 실패).
  try {
    window.localStorage.setItem(
      BLOG_POPUP_HIDE_UNTIL,
      String(Date.now() + POPUP_HIDE_DURATION_MS),
    );
  } catch {
    // no-op: 차단 정보를 저장하지 못해도 팝업 동작 자체는 정상 유지.
  }
}
