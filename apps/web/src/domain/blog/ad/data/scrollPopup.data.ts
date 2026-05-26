import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 스크롤 팝업 데이터 (본문 60% 읽은 시점에 중앙 모달 노출)
// 이미지 경로는 플레이스홀더 — 최종 에셋 수령 후 apps/web/public/images/blog/ad/ 에 배치
export const blogScrollPopupData = {
  baseImage: '/images/blog/ad/popup.png',
  baseWidth: 820,
  baseHeight: 947,
  signpostImage: '/images/blog/ad/popup-signpost.png',
  alt: '렛츠커리어의 이야기를 가장 빠르게 — 무료 뉴스레터 구독',
  link: NEWSLETTER_SUBSCRIBE_URL,
  triggerRatio: 0.6, // 본문(<article>) 60% 읽은 시점에 노출 (페이지 전체 X)
  // 푯말(표지판) 위치/크기/페이드 조정값 — 숫자만 바꿔 미세조정
  signpost: {
    widthPct: 70, // 카드 너비 대비 푯말 너비(%) — 키우려면 ↑, 줄이려면 ↓
    topPct: 26, // 카드 상단~푯말 상단 거리(%) — 내리려면 ↑, 올리려면 ↓
    leftPct: 50, // 가로 중심(%) — 50=정중앙, 오른쪽으로 옮기려면 ↑
    fadeStartPct: 55, // 이 지점(%)부터 하단(기둥 끝)으로 투명 페이드 시작 — 100=페이드 없음
  },
} as const;
