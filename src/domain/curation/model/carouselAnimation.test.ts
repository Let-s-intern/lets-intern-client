import { describe, expect, it } from 'vitest';

import {
  calculateCenterScrollLeft,
  calculateItemStyle,
  findClosestItemIndex,
  getContainerMetrics,
  getItemMetrics,
} from './carouselAnimation';

describe('calculateItemStyle', () => {
  const container = getContainerMetrics({
    left: 0,
    right: 1000,
    width: 1000,
    top: 0,
    bottom: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRect);

  it('중앙에 위치한 아이템은 opacity 1, scale 1', () => {
    const item = getItemMetrics({
      left: 450,
      right: 550,
      width: 100,
      top: 0,
      bottom: 0,
      height: 0,
      x: 450,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    const style = calculateItemStyle(container, item);
    expect(style.opacity).toBe(1.0);
    expect(style.scale).toBe(1.0);
  });

  it('화면 50% 이상 떨어진 아이템은 opacity 0, scale 0.85', () => {
    // 아이템 중심 = 1050, 컨테이너 중심 = 500 → 거리 550 > halfScreenWidth(500)
    const item = getItemMetrics({
      left: 1000,
      right: 1100,
      width: 100,
      top: 0,
      bottom: 0,
      height: 0,
      x: 1000,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    const style = calculateItemStyle(container, item);
    expect(style.opacity).toBe(0);
    expect(style.scale).toBe(0.85);
  });

  it('중간 거리의 아이템은 점진적으로 페이드', () => {
    // 중앙에서 약 35% 떨어진 위치 (25%~50% 구간)
    const item = getItemMetrics({
      left: 800,
      right: 900,
      width: 100,
      top: 0,
      bottom: 0,
      height: 0,
      x: 800,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    const style = calculateItemStyle(container, item);
    expect(style.opacity).toBeGreaterThan(0);
    expect(style.opacity).toBeLessThan(1);
    expect(style.scale).toBeGreaterThan(0.85);
    expect(style.scale).toBeLessThan(1);
  });
});

describe('findClosestItemIndex', () => {
  it('컨테이너 중앙에 가장 가까운 아이템의 인덱스를 반환', () => {
    const containerCenter = 500;

    const items = [
      { getBoundingClientRect: () => ({ left: 100, width: 100 }) },
      { getBoundingClientRect: () => ({ left: 450, width: 100 }) },
      { getBoundingClientRect: () => ({ left: 800, width: 100 }) },
    ] as HTMLElement[];

    const index = findClosestItemIndex(containerCenter, items);
    expect(index).toBe(1);
  });

  it('null 아이템은 건너뜀', () => {
    const containerCenter = 500;

    const items: (HTMLElement | null)[] = [
      null,
      { getBoundingClientRect: () => ({ left: 450, width: 100 }) } as HTMLElement,
      null,
    ];

    const index = findClosestItemIndex(containerCenter, items);
    expect(index).toBe(1);
  });
});

describe('calculateCenterScrollLeft', () => {
  it('아이템을 컨테이너 중앙에 맞추기 위한 scrollLeft 값 계산', () => {
    const container = {
      getBoundingClientRect: () => ({ left: 0, width: 1000 }),
      scrollLeft: 200,
    } as unknown as HTMLElement;

    const target = {
      getBoundingClientRect: () => ({ left: 300, width: 200 }),
    } as unknown as HTMLElement;

    // scrollLeft = 300 - 0 + 200 - (1000 - 200) / 2 = 500 - 400 = 100
    const result = calculateCenterScrollLeft(container, target);
    expect(result).toBe(100);
  });
});
