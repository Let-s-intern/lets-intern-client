import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 사이드 패널 데이터 (우측 사이드바 "추천 챌린지" 박스 위)
// 이미지 경로는 플레이스홀더 — 최종 에셋 수령 후 apps/web/public/images/blog/ad/ 에 배치
export const blogSidePanelData = {
  baseImage: '/images/blog/ad/side-panel.png',
  baseWidth: 656,
  baseHeight: 360,
  signpostImage: '/images/blog/ad/side-panel-signpost.png',
  alt: '렛츠커리어 블로그 글을 매주 받아보기 — 지금 바로 무료 구독',
  link: NEWSLETTER_SUBSCRIBE_URL,
  // 푯말(표지판) 위치/크기/페이드 조정값 — 숫자만 바꿔 미세조정
  // 목표 배치: 문구 밑 · "지금 바로 무료 구독" 버튼 오른쪽 · 박스에 조금 꽉 차게
  signpost: {
    widthPct: 46, // 박스 너비 대비 푯말 너비(%) — 키우려면 ↑, 줄이려면 ↓
    topPct: 30, // 박스 상단~푯말 상단 거리(%) — 버튼 높이 근처로 내리려면 ↑
    leftPct: 68, // 가로 중심(%) — 오른쪽으로 옮기려면 ↑, 왼쪽이면 ↓
    fadeStartPct: 100, // 이 지점(%)부터 하단 투명 페이드 시작 — 100=페이드 없음
  },
} as const;
