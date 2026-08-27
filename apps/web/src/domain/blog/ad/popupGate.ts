import {
  BLOG_POPUP_HIDE_UNTIL,
  POPUP_HIDE_DURATION_MS,
} from './data/newsletter';

/**
 * "하루 동안 보지 않기" 기록 키.
 *
 * `popupId`를 주면 팝업 단위로 키가 갈린다. 어드민에서 팝업을 여러 개 운영하는 순간
 * 단일 키는 의도와 어긋난다 — 팝업 A를 닫았다고 팝업 B까지 24시간 안 뜨기 때문이다.
 * 인자가 없으면 현행 단일 키를 그대로 쓴다(구 팝업 호환).
 */
function hideUntilKey(popupId?: number): string {
  return popupId === undefined
    ? BLOG_POPUP_HIDE_UNTIL
    : `${BLOG_POPUP_HIDE_UNTIL}:${popupId}`;
}

/**
 * 스크롤 팝업 노출 게이트.
 * 기록된 차단 시각이 현재보다 미래면 false(노출 안 함)
 * → "하루 동안 보지 않기"만 차단. 그 외에는 매 방문마다 노출 허용.
 *
 * SSR 안전: window가 없으면 false.
 */
export function canShowPopup(popupId?: number): boolean {
  if (typeof window === 'undefined') return false;

  // Safari 시크릿 모드·스토리지 차단 환경에서는 localStorage 접근이 throw → 노출 허용으로 폴백.
  try {
    const hideUntil = window.localStorage.getItem(hideUntilKey(popupId));
    if (hideUntil && Number(hideUntil) > Date.now()) return false;
  } catch {
    return true;
  }

  return true;
}

/** "하루 동안 보지 않기" — 해당 팝업의 노출을 24시간 차단한다. */
export function hidePopupForDay(popupId?: number): void {
  if (typeof window === 'undefined') return;

  // 스토리지 차단 환경에서 setItem이 throw해도 앱이 죽지 않도록 무시(차단 저장만 실패).
  try {
    window.localStorage.setItem(
      hideUntilKey(popupId),
      String(Date.now() + POPUP_HIDE_DURATION_MS),
    );
  } catch {
    // no-op: 차단 정보를 저장하지 못해도 팝업 동작 자체는 정상 유지.
  }
}
