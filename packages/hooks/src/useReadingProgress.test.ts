import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useReadingProgress from './useReadingProgress';

/** offsetTop/offsetHeight를 런타임에 바꿀 수 있는 가변 가짜 본문 요소 */
interface FakeElement {
  offsetTop: number;
  offsetHeight: number;
}

function createFakeElement(
  offsetTop: number,
  offsetHeight: number,
): FakeElement {
  return { offsetTop, offsetHeight };
}

/** FakeElement를 훅 시그니처(HTMLElement)에 맞춰 전달하는 getter */
function getterFor(el: FakeElement | null): () => HTMLElement | null {
  return () => el as unknown as HTMLElement | null;
}

function setViewport({
  scrollY,
  innerHeight,
}: {
  scrollY: number;
  innerHeight: number;
}) {
  Object.defineProperty(window, 'scrollY', {
    value: scrollY,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: innerHeight,
    configurable: true,
  });
}

describe('useReadingProgress', () => {
  beforeEach(() => {
    // rAF를 동기 실행해 scroll 핸들러의 측정이 즉시 반영되도록 한다.
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('본문 요소 기준 진행률을 0~1 비율로 계산한다', () => {
    // offsetTop=100, offsetHeight=1000, scrollY=0, innerHeight=600
    // ratio = (0 + 600 - 100) / 1000 = 0.5
    setViewport({ scrollY: 0, innerHeight: 600 });
    const el = createFakeElement(100, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));

    expect(result.current).toBeCloseTo(0.5);
  });

  it('계산값이 1을 초과하면 1로 클램프한다', () => {
    // ratio = (5000 + 600 - 100) / 1000 = 5.5 → 1
    setViewport({ scrollY: 5000, innerHeight: 600 });
    const el = createFakeElement(100, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));

    expect(result.current).toBe(1);
  });

  it('계산값이 0 미만이면 0으로 클램프한다', () => {
    // ratio = (0 + 100 - 2000) / 1000 = -1.9 → 0
    setViewport({ scrollY: 0, innerHeight: 100 });
    const el = createFakeElement(2000, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));

    expect(result.current).toBe(0);
  });

  it('대상 요소가 없으면 0을 반환한다', () => {
    setViewport({ scrollY: 1000, innerHeight: 600 });

    const { result } = renderHook(() => useReadingProgress(getterFor(null)));

    expect(result.current).toBe(0);
  });

  it('scroll 이벤트 시 offsetTop/offsetHeight를 live 재측정해 갱신한다', () => {
    setViewport({ scrollY: 0, innerHeight: 600 });
    // 가변 요소: 측정 시점마다 offsetHeight가 변할 수 있음을 검증
    const el = createFakeElement(100, 1000);

    const { result } = renderHook(() => useReadingProgress(getterFor(el)));
    expect(result.current).toBeCloseTo(0.5);

    // 스크롤 이동 + lazy 로딩으로 본문 높이 증가 (live 재측정)
    setViewport({ scrollY: 400, innerHeight: 600 });
    el.offsetHeight = 2000;

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // ratio = (400 + 600 - 100) / 2000 = 0.45
    expect(result.current).toBeCloseTo(0.45);
  });
});
