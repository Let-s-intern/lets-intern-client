import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 사이드 패널 데이터 (우측 사이드바 "추천 챌린지" 박스 위)
// 이미지 경로는 플레이스홀더 — 최종 에셋 수령 후 apps/web/public/images/blog/ad/ 에 배치
export const blogSidePanelData = {
  baseImage: '/images/blog/ad/side-panel.png',
  signpostImage: '/images/blog/ad/side-panel-signpost.png',
  alt: '렛츠커리어 블로그 글을 매주 받아보기 — 지금 바로 무료 구독',
  link: NEWSLETTER_SUBSCRIBE_URL,
} as const;
