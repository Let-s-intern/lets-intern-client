import { NEWSLETTER_SUBSCRIBE_URL } from './newsletter';

// 사이드 패널 데이터 (우측 사이드바 "추천 챌린지" 박스 위)
// 이미지 경로는 플레이스홀더 — 최종 에셋 수령 후 apps/web/public/images/blog/ad/ 에 배치
export const blogSidePanelData = {
  baseImage: '/images/blog/ad/side-panel.png',
  baseWidth: 656,
  baseHeight: 360,
  signpostImage: '/images/blog/ad/side-panel-signpost.png',
  signpostWidth: 327, // 푯말 원본 px (비율 자동 유지용 — aspectRatio 계산)
  signpostHeight: 260,
  alt: '렛츠커리어 블로그 글을 매주 받아보기 — 지금 바로 무료 구독',
  link: NEWSLETTER_SUBSCRIBE_URL,
  // 푯말(표지판) 위치/크기 — 데스크톱 전용(패널이 md 미만에서 숨김). 숫자만 바꿔 미세조정.
  // 목표 배치: 문구 밑 · "지금 바로 무료 구독" 버튼 오른쪽 · 박스에 조금 꽉 차게.
  // widthPct=박스 너비 대비 푯말 너비(%), topPct=박스 상단~푯말 상단(%), leftPct=가로 중심(%)
  signpost: {
    pc: { widthPct: 46, topPct: 30, leftPct: 76 }, // 크기/상하/좌우(%)
  },
  // CTA(투명 링크) 위치/크기 — "지금 바로 무료 구독" pill 영역에 겹침. 데스크톱 전용.
  // bottomPct=하단에서 거리, left/rightPct=좌우 안쪽 여백, heightPct=링크 높이 (모두 %).
  cta: {
    pc: { bottomPct: 30, leftPct: 8, rightPct: 45, heightPct: 18 },
  },
  // 첫 진입 시 자동 흔들림 — 횟수/속도 조정. (이후 호버 시에도 흔들림)
  introWobble: {
    count: 1, // 흔들리는 횟수 — 많이 흔들리게 하려면 ↑ (예 5)
    durationMs: 500, // 1회 흔들림 속도(ms) — 작을수록 빠름(예 300), 클수록 느림(예 800)
  },
} as const;
