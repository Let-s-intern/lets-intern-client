import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 스크롤 팝업 데이터 (본문 60% 읽은 시점에 중앙 모달 노출)
// 이미지 경로는 플레이스홀더 — 최종 에셋 수령 후 apps/web/public/images/blog/ad/ 에 배치
export const blogScrollPopupData = {
  baseImage: '/images/blog/ad/popup.png',
  signpostImage: '/images/blog/ad/popup-signpost.png',
  alt: '렛츠커리어의 이야기를 가장 빠르게 — 무료 뉴스레터 구독',
  link: NEWSLETTER_SUBSCRIBE_URL,
  triggerRatio: 0.6, // 본문(<article>) 60% 읽은 시점에 노출 (페이지 전체 X)
} as const;
