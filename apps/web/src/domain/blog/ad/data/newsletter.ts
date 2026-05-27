// 뉴스레터 광고 공통 상수
// ⚠️ 구독 링크는 데이터로 분리 관리
export const NEWSLETTER_SUBSCRIBE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfhUNB00IpWjOTLyh1ptuySQkegj2JL_GA4SeZnmi9PKMe3Ug/viewform';

// 팝업 노출 정책 키/기간 ("하루 동안 보지 않기" — 24h 차단)
export const BLOG_POPUP_HIDE_UNTIL = 'blogNewsletterPopupHideUntil'; // localStorage 키 (ms timestamp)
export const POPUP_HIDE_DURATION_MS = 24 * 60 * 60 * 1000; // 24시간
