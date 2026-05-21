import '@testing-library/jest-dom/vitest';

// jsdom 미구현 polyfill — Radix Toast가 swipe 처리에서 사용
// (jsdom 25 기준 hasPointerCapture/releasePointerCapture/setPointerCapture 모두 없음)
if (typeof Element !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
}
