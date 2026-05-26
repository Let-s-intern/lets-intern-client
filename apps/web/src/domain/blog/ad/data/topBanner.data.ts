import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 상단 배너 데이터 (블로그 글 상세 컨텐츠 위, 블로그 전체 공통 노출)
// 이미지 경로는 플레이스홀더 — 최종 에셋 수령 후 apps/web/public/images/blog/ad/ 에 배치
export const blogTopBannerData = {
  pcImage: '/images/blog/ad/top-banner-pc.png',
  mobileImage: '/images/blog/ad/top-banner-mobile.png',
  alt: '렛츠커리어 블로그 — 뉴스레터 바로 신청하기', // 화면 문구 = 접근성 텍스트
  link: NEWSLETTER_SUBSCRIBE_URL,
} as const;
