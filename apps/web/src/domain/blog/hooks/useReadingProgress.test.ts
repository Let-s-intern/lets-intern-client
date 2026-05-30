import { act, renderHook } from '@testing-library/react';

import useReadingProgress from './useReadingProgress';

/** getBoundingClientRect()의 top/height를 런타임에 바꿀 수 있는 가변 가짜 본문 요소 */
interface FakeElement {
  rect: { top: number; height: number };
  getBoundingClientRect: () => DOMRect;
}

function createFakeElement(top: number, height: number): FakeElement {
  const el: FakeElement = {
    rect: { top, height },
    getBoundingClientRect: () =>
      ({ top: el.rect.top, height: el.rect.height }) as DOMRect,
  };
  return el;
}

/** FakeElement를 훅 시그니처(HTMLElement)에 맞춰 전달하는 getter */
function getterFor(el: FakeElement | null): () => HTMLElement | null {
  return () => el as unknown as HTMLElement | null;
}

function setInnerHeight(innerHeight: number) {
  Object.defineProperty(window, 'innerHeight', {
    value: innerHeight,
    configurable: true,
  });
}

describe('useReadingProgress', () => {
  let originalRaf: typeof window.requestAnimationFrame;
  let originalCancelRaf: typeof window.cancelAnimationFrame;

  beforeEach(() => {
    // rAF를 동기 실행해 scroll 핸들러의 측정이 즉시 반영되도록 한다.
    originalRaf = window.requestAnimationFrame;
    originalCancelRaf = window.cancelAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame =
      (() => {}) as typeof window.cancelAnimationFrame;
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRaf;
    window.cancelAnimationFrame = originalCancelRaf;
  });

  it('본문 요소 기준 진행률을 0~1 비율로 계산한다', () => {
    // rect.top=100, rect.height=1000, innerHeight=600
    // ratio = (600 - 100) / 1000 = 0.5
    setInnerHeight(600);
    const el = createFakeElement(100, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));

    expect(result.current).toBeCloseTo(0.5);
  });

  it('계산값이 1을 초과하면 1로 클램프한다', () => {
    // ratio = (600 - (-4900)) / 1000 = 5.5 → 1
    setInnerHeight(600);
    const el = createFakeElement(-4900, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));

    expect(result.current).toBe(1);
  });

  it('계산값이 0 미만이면 0으로 클램프한다', () => {
    // ratio = (100 - 2000) / 1000 = -1.9 → 0
    setInnerHeight(100);
    const el = createFakeElement(2000, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));

    expect(result.current).toBe(0);
  });

  it('대상 요소가 없으면 0을 반환한다', () => {
    setInnerHeight(600);

    const { result } = renderHook(() => useReadingProgress(getterFor(null)));

    expect(result.current).toBe(0);
  });

  it('scroll 이벤트 시 rect를 live 재측정해 갱신한다', () => {
    setInnerHeight(600);
    // 가변 요소: 측정 시점마다 rect가 변할 수 있음을 검증
    const el = createFakeElement(100, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));
    expect(result.current).toBeCloseTo(0.5);

    // 스크롤 이동(rect.top ↓) + lazy 로딩으로 본문 높이 증가 (live 재측정)
    el.rect.top = -300;
    el.rect.height = 2000;

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // ratio = (600 - (-300)) / 2000 = 0.45
    expect(result.current).toBeCloseTo(0.45);
  });
});
