// 멤버십 모달/시트(BenefitModal·ImageLightbox 등)가 열린 동안 배경 본문 스크롤을 잠근다.
//
// 과거 iframe 임베드 시절에는 부모 창 NavBar 숨김을 postMessage 로 동기화했으나,
// 본 웹앱 직접 마운트로 전환되면서 그 로직(startHeaderSync/postMessage)은 무동작이 되어 제거했다.
// - 헤더 숨김: 글로벌 NavBar 가 자체 스크롤 hide/show 를 수행하므로 별도 처리 불필요.
// - 모달 가림: BenefitModal·ImageLightbox 는 body 포털 + 높은 z-index 로 NavBar 위에 렌더되어 가려지지 않음.
// 따라서 여기서는 "오버레이 열림 시 배경 스크롤 잠금" 기능만 남긴다.

function lockBodyScroll(lock: boolean) {
  if (typeof document === 'undefined') return;
  const value = lock ? 'hidden' : '';
  document.documentElement.style.overflow = value;
  document.body.style.overflow = value;
}

/** 오버레이(모달·시트) 열림/닫힘을 배경 스크롤 잠금에 반영한다. */
export function setOverlayOpen(open: boolean) {
  lockBodyScroll(open);
}
