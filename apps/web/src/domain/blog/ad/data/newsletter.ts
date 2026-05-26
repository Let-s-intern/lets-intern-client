// 뉴스레터 광고 공통 상수
// ⚠️ 구독 링크는 데이터로 분리 관리
// TODO: 실제 구독 링크로 교체 (현재 임시 구글 링크)
export const NEWSLETTER_SUBSCRIBE_URL = 'https://www.google.com';

// 팝업 노출 정책 키/기간 ("하루 동안 보지 않기" — 24h 차단)
export const BLOG_POPUP_HIDE_UNTIL = 'blogNewsletterPopupHideUntil'; // localStorage 키 (ms timestamp)
export const POPUP_HIDE_DURATION_MS = 24 * 60 * 60 * 1000; // 24시간
