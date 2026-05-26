// 뉴스레터 광고 공통 상수
// ⚠️ 값은 비워두고 사용자가 추후 입력 (구독 링크는 데이터로 분리 관리)
export const NEWSLETTER_SUBSCRIBE_URL = ''; // TODO: 실제 구독 링크 입력

// 팝업 노출 정책 키/기간
export const BLOG_POPUP_SHOWN = 'blogNewsletterPopupShown'; // sessionStorage 키
export const BLOG_POPUP_HIDE_UNTIL = 'blogNewsletterPopupHideUntil'; // localStorage 키 (ms timestamp)
export const POPUP_HIDE_DURATION_MS = 24 * 60 * 60 * 1000; // 24시간
