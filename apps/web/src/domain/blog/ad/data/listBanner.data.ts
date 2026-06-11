import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 블로그 리스트 상단 배너 우측의 "뉴스레터 바로 신청하기" 이미지 버튼 데이터
// (기존 CSS pill 버튼을 투명 PNG 이미지 버튼으로 교체)
export const blogListBannerButtonData = {
  image: '/images/blog/ad/banner-subscribe-button.png',
  width: 996, // 원본 px (비율 계산용 — 수정 금지)
  height: 144, // 원본 px (비율 계산용 — 수정 금지)
  link: NEWSLETTER_SUBSCRIBE_URL,
  alt: '렛츠커리어 뉴스레터 바로 신청하기',
  // 크기/위치 — pc·모바일 별도. 너비만 지정하면 비율(996:144)은 자동 유지.
  // widthPx=버튼 너비, offsetX=좌우 이동(오른쪽 +, 왼쪽 - px), offsetY=상하 이동(아래 +, 위 - px)
  size: {
    pc: { widthPx: 240, offsetX: 0, offsetY: 10 }, // 데스크톱
    mobile: { widthPx: 240, offsetX: 0, offsetY: 0 }, // 모바일
  },
} as const;
