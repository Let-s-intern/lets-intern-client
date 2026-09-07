import '@testing-library/jest-dom';

/*
 * jsdom 은 ResizeObserver 를 구현하지 않는다. 크기를 재서 배율을 잡는 컴포넌트가
 * 마운트되는 순간 ReferenceError 로 렌더 자체가 죽으므로, 빈 껍데기를 채워 둔다.
 * 관측 결과가 필요한 테스트는 각자 목으로 덮어쓰면 된다.
 */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
