import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 스크롤 팝업 데이터 (본문 60% 읽은 시점에 중앙 모달 노출)
// 이미지 경로는 플레이스홀더 — 최종 에셋 수령 후 apps/web/public/images/blog/ad/ 에 배치
export const blogScrollPopupData = {
  // 완성 카드 이미지 (푯말·CTA pill 모두 baked-in, 별도 애니메이션 없음)
  baseImage: '/images/blog/ad/popup.png',
  baseWidth: 820, // popup.png 실제 px (원본 1731×2000 → 폭 820 리사이즈)
  baseHeight: 947, // 비율 유지 높이
  alt: '렛츠커리어의 이야기를 가장 빠르게 — 무료 뉴스레터 구독',
  link: NEWSLETTER_SUBSCRIBE_URL,
  triggerRatio: 0.6, // 본문(<article>) 60% 읽은 시점에 노출 (페이지 전체 X)
  borderRadiusPx: 16, // 팝업 모달 모서리 둥글기(px) — 각지게 0, 더 둥글게 ↑(예 24)
} as const;
