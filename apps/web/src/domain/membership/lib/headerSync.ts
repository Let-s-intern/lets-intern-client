// 부모(렛츠커리어 웹)의 헤더 표시 여부를 iframe 안에서 제어한다.
// - 아래로 스크롤 → 헤더 숨김 / 위로 스크롤(또는 최상단) → 헤더 표시
// - 모달·시트 같은 오버레이가 열리면 헤더 강제 숨김 (모달이 헤더에 안 가리도록)
const NEAR_TOP = 20;

let overlayOpen = false;
let lastY = 0;

function post(visible: boolean) {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage({ type: "membership:header", visible }, "*");
}

// 랜딩이 정상 마운트됐음을 부모에 알린다. 부모는 이 신호가 일정 시간 안에 오지 않으면
// (네트워크 오류·차단·잘못된 URL·404 페이지 등) 오류 화면으로 전환한다.
function postReady() {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage({ type: "membership:ready" }, "*");
}

export function startHeaderSync(): () => void {
  lastY = window.scrollY;
  const onScroll = () => {
    if (overlayOpen) return; // 오버레이 열린 동안은 숨김 유지
    const y = window.scrollY;
    const scrollingUp = y < lastY;
    lastY = y;
    post(scrollingUp || y < NEAR_TOP);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  // ready 는 한 번만 보내면 부모 리스너가 늦게 붙을 때 놓칠 수 있어 몇 번 반복 송신한다.
  [0, 500, 1500].forEach((delay) => setTimeout(postReady, delay));
  post(true);
  return () => window.removeEventListener("scroll", onScroll);
}

// 오버레이가 열린 동안 배경(랜딩 본문) 스크롤을 잠근다. iframe 안에서는 이
// 문서가 스크롤 컨테이너라 html/body 의 overflow 를 막으면 배경이 고정된다.
function lockBodyScroll(lock: boolean) {
  if (typeof document === "undefined") return;
  const value = lock ? "hidden" : "";
  document.documentElement.style.overflow = value;
  document.body.style.overflow = value;
}

// 오버레이(모달·시트) 열림/닫힘을 헤더 표시 + 배경 스크롤 잠금에 반영한다.
export function setOverlayOpen(open: boolean) {
  overlayOpen = open;
  lockBodyScroll(open);
  if (open) {
    post(false);
  } else {
    // 닫힐 때: 최상단이면 헤더 표시, 아니면 다음 위로-스크롤 때 나오게 숨김 유지
    post(window.scrollY < NEAR_TOP);
  }
}
