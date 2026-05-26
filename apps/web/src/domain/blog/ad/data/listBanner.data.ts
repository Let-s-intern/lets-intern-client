import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 블로그 리스트 상단 배너 우측의 "뉴스레터 바로 신청하기" 이미지 버튼 데이터
// (기존 CSS pill 버튼을 투명 PNG 이미지 버튼으로 교체)
export const blogListBannerButtonData = {
  image: '/images/blog/ad/banner-subscribe-button.png',
  width: 498, // 원본 px (비율 계산용 — 수정 금지)
  height: 72, // 원본 px (비율 계산용 — 수정 금지)
  link: NEWSLETTER_SUBSCRIBE_URL,
  alt: '렛츠커리어 뉴스레터 바로 신청하기',
  // 크기/위치 — pc·모바일 별도. 너비만 지정하면 비율(498:72)은 자동 유지.
  size: {
    pc: { widthPx: 300 }, // 데스크톱 버튼 너비(px) — 키우려면 ↑, 줄이려면 ↓
    mobile: { widthPx: 240 }, // 모바일 버튼 너비(px) — 키우려면 ↑, 줄이려면 ↓
  },
} as const;
